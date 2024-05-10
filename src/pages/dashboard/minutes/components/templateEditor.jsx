// import { createRoot } from 'react-dom/client';
// import '../css/default.component.css';
import * as React from 'react';
import { useEffect, useRef } from 'react';

import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';

import { DialogUtility, Dialog } from '@syncfusion/ej2-react-popups';
import { AiOutlineArrowLeft} from "react-icons/ai";
import { ListView } from '@syncfusion/ej2-react-lists';
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import { FaFolder } from "react-icons/fa";
import Collapse from '@mui/material/Collapse';
import { animated, useSpring } from '@react-spring/web';
import IconButton from '@mui/material/IconButton';
import { IoMdAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import NextedTreeItem from './nestedTreeItem';
import { useDialogueStore } from '@/store/dialogue.store';
import AsyncSelect from 'react-select/async';
import { CategoriesApi } from "@/api/api";
import { uploadBlobToS3 } from '@/utils/uploadS3V2';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { handleBackendErrors } from "@/utils/handleHandler";
import { TemplateApi } from '@/api/api';

const StyledTreeItemLabel = styled(Typography)({
    color: 'inherit',
    // fontFamily: 'General Sans',
    fontWeight: 'inherit',
    flexGrow: 1,
  });

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.25)
        : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
    const { labelIcon: LabelIcon, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            slots={{
                groupTransition: TransitionComponent,
            }}
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <StyledTreeItemLabel className=' line-clamp-1 ' variant="body2">{labelText}</StyledTreeItemLabel>

                    <div className=" flex flex-row " >

                        {/* {other.add &&
                            <IconButton
                                // onClick={handleClick}
                            >
                                <IoMdAdd size={18} />
                            </IconButton>
                        } */}

                        {!other.delete &&
                            <IconButton
                                onClick={(e) => { other.onHandleDelete(), e.stopPropagation()}}
                            >
                                <FaTrash color="red" size={15} />
                            </IconButton>
                        }

                    </div>

                </Box>
            }
            {...other}
            ref={ref}
        />
    );
});

DocumentEditorContainerComponent.Inject(Toolbar);

const TemplateEdit = ({edit}) => {

    useEffect(() => {
        rendereComplete();
    }, []);

    const { setDialogue, setBackdrop } = useDialogueStore()
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {state} = useLocation();
    const [loadFile, setloadFile] = React.useState(true);
    
    let container = useRef(null);

    // console.log(state)

    const schema = yup.object({
        categoryId: yup.string().trim("Sélectionner une catégorie svp").required("Sélectionner une catégorie svp"),
        templateName: yup.string().trim().required("Le nom du template est requis").max(250, "Ne doit pas dépasser 250 caractères"),
        group: yup.array().of(
            yup.object({
                id: yup.number(),
                name: yup.string().trim().required("Le nom du groupe est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                isClientGroup: yup.boolean().required(),
                variables: yup.array().of(
                    yup.object({
                        id: yup.number(),
                        name: yup.string().trim().required("Le nom de la variable est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                    })
                )
                // .test('is-unique-variable', 'Vous demandez la même information plusieurs fois', function (value) {
                //     const questions = value.map(informationRequested => informationRequested.question);
                //     const uniquepartyquestions = new Set(questions);
                //     return questions.length === uniquepartyquestions.size;
                // })
            })
        ).test('is-unique', 'Les noms des groupes de variable doivent être unique', function (value) {
            const group_names = value.map(group => group.name);
            const uniqueGroupNames = new Set(group_names);
            return group_names.length === uniqueGroupNames.size;
        }),
        deletedGroup: yup.array().of(yup.string().required()),
        deletedVariable: yup.array().of(yup.string().required())
    }).required();
    

    const { control, setValue, handleSubmit, setError, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            "group": [
                { 
                    "name": "Autres", 
                    "isClientGroup": false,
                    "variables": [
                    ]
                }
            ],
            ...edit && {
                "templateName": state.template_name,
                "categoryId": state.category_id                
            }
        }
    });

    const { fields:fieldGroup, append:appendGroup, prepend:prependGroup, remove:removeGroup } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "group", // unique name for your Field Array
    });

    const { append:appendDeletedGroup } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "deletedGroup", // unique name for your Field Array
    });

    const { append:appendDeletedVariable} = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "deletedVariable", // unique name for your Field Array
    });

    const {mutate} = useMutation({

        mutationFn: async (data) => {
          return TemplateApi.createTemplate(data)
        },
        gcTime:0,
        onSuccess: (response) => {
            queryClient.invalidateQueries(["getMinute"])
            setBackdrop({active: false})
            toast.success('Template ajouté avec succès', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            navigate(-1);
        },
        onError: ({response}) => {
            setBackdrop({active: false})
            toast.error(handleBackendErrors(response.data, "Une erreur s'est produite"), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
  
    })

    const {mutate:mutate2} = useMutation({

        mutationFn: async (data) => {
          return TemplateApi.updateTemplate(data, state.id)
        },
        gcTime:0,
        onSuccess: (response) => {
            setBackdrop({active: false})
            queryClient.invalidateQueries(["getMinute"])
            toast.success('Template modifié avec succès', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            navigate(-1);
        },
        onError: ({response}) => {
            setBackdrop({active: false})
            toast.error(handleBackendErrors(response.data, "Une erreur s'est produite"), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
  
    })

    const { isError, data: listVariable,  isLoading } = useQuery({
		queryKey: ["getVariablesOfTemplate", state?.id],
		queryFn: async ({ queryKey }) => {
			return TemplateApi.getTemplateVariable(queryKey[1])
		},
		enabled: edit || false,
        staleTime: 0,
        refetchOnWindowFocus: false
	})

    function addCustomIdToGroups(data) {
        return data.group.map(group => {
            const updatedVariables = group.variables.map(variable => {
                return { ...variable, customId: variable.id };
            });
            return { ...group, customId: group.id, variables: updatedVariables };
        });
    }

    useEffect(() => {
        if(listVariable?.group)
        {
            const newData = { ...listVariable, group: addCustomIdToGroups(listVariable) }
            setValue('group', newData.group)
        }
    }, [listVariable]);

    const handleClick = async (data) => {
        setBackdrop({active: true})
        container.current.documentEditor.saveAsBlob('Sfdt').then(async(blob) => {
            await uploadBlobToS3(blob)
            .then((s3Link) => {
                data.url = s3Link.Location
                if(edit){
                    console.log(data);
                    mutate2(data)
                }
                else {
                    mutate(data)
                }
            })
            .catch((err) => {
                setBackdrop({active: false})
                toast.error("Une erreur s'est produite lors de l'enrégistrement du template", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            })
        })
    };

    let hostUrl = "https://services.syncfusion.com/react/production/api/documenteditor/";

    let toolbarOptions = [
        "New",
        "Open",
        "Separator",
        "Undo",
        "Redo",
        "Separator",
        // {
        //     prefixIcon: "sf-icon-InsertMergeField",
        //     tooltipText: "Insert Field",
        //     text: onWrapText("Insert Field"),
        //     id: "InsertField",
        // },
        // {
        //     prefixIcon: "sf-icon-FinishMerge",
        //     tooltipText: "Merge Document",
        //     text: onWrapText("Merge Document"),
        //     id: "MergeDocument",
        // },
        "Separator",
        "Image",
        "Table",
        "Hyperlink",
        "Bookmark",
        "TableOfContents",
        "Separator",
        "Header",
        "Footer",
        "PageSetup",
        "PageNumber",
        "Break",
        "Separator",
        "Find",
        "Separator",
        "Comments",
        "TrackChanges",
        "Separator",
        "LocalClipboard",
        "RestrictEditing",
        "Separator",
        "FormFields",
        "UpdateFields"
    ];

    const closeFieldDialog = () => {
        insertFieldDialogObj.hide();
        container.current.documentEditor.focusIn();
    };

    let insertFieldDialogObj = new Dialog({
        header: "Ajouter une variable",
        content: '<div class="dialogContent">' +
            // tslint:disable-next-line:max-line-length
            '<label class="e-insert-field-label">Name:</label></br><input type="text" id="field_text" class="e-input" placeholder="Tapez un champ à insérer par exemple. Prénom">' +
            "</div>",
        showCloseIcon: true,
        isModal: true,
        width: "auto",
        height: "auto",
        close: closeFieldDialog,
        buttons: [
            {
                click: () => {
                    let fieldNameTextBox = document.getElementById("field_text");
                    let fieldName = fieldNameTextBox.value;
                    if (fieldName !== "") {
                        container.current.documentEditor.editor.insertField("MERGEFIELD " + fieldName + " \\* MERGEFORMAT");
                        console.log("MERGEFIELD " + fieldName + " \\* MERGEFORMAT");
                        listView.addItem('')
                    }
                    insertFieldDialogObj.hide();
                    container.current.documentEditor.focusIn();
                },
                buttonModel: {
                    content: "Ok",
                    cssClass: "e-flat",
                    isPrimary: true,
                },
            },
            {
                click: () => {
                    insertFieldDialogObj.hide();
                    container.current.documentEditor.focusIn();
                },
                buttonModel: {
                    content: "Annuler",
                    cssClass: "e-flat",
                },
            },
        ],
    });

    const loadDocumentFromURL = async () => {
        fetch(state?.url)
        .then(response => response.text()) // Assurez-vous que le contenu est lu correctement
        .then(sfdtContent => {
            container.current.documentEditor.open(sfdtContent);
            setloadFile(false)
        })
        .catch(error => {
            navigate(-1)
            toast.error('Une erreur s\'est produite lors du chargement du fichier', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            setloadFile(false)
        });
    };

    const onLoadDefault = () => {
        if(edit){loadDocumentFromURL()}
        container.current.documentEditor.documentName = "Template de minute";
        container.current.documentEditorSettings.showRuler = true;
        let item = toolbarOptions;
        container.current.toolbarItems = item;
        container.current.documentChange = () => {
            container.current.documentEditor.focusIn();
        };
    };

    const insertField = (fieldName) => {
        let fileName = fieldName
            .replace(/\n/g, "")
            .replace(/\r/g, "")
            .replace(/\r\n/g, "");
        let fieldCode = "MERGEFIELD  " + fileName + "  \\* MERGEFORMAT ";
        container.current.documentEditor.editor.insertField(fieldCode, "«" + fieldName + "»");
        container.current.documentEditor.focusIn();
    };

    const rendereComplete = () => {
        window.onbeforeunload = function () {
            return "Want to save your changes?";
        };
        container.current.documentEditor.pageOutline = "#E0E0E0";
        container.current.documentEditor.acceptTab = true;
        container.current.documentEditor.resize();
        onLoadDefault();
    };

    const getCat = async (inputValue) => {
        const res = await CategoriesApi.getCategories(1, 8, inputValue)
        return res.data.map((data) => { return { label: data.category_name, value: data.id, other: data } })
    };

    const loadOptionsCategorie = (inputValue) =>
    new Promise((resolve) => {
        resolve(getCat(inputValue))
    })


    return (

        <div className="control-pane ">

            <div className=" w-full items-center justify-between flex flex-row my-3" >

                <button onClick={() => navigate(-1)} className=" bg-primary w-[35px] h-[35px] mr-3 rounded-full flex justify-center items-center" >
                    <AiOutlineArrowLeft className=' text-white ' size={16} />
                </button>

                <Controller
                    render={({
                        field: { onChange, value, ref },
                        fieldState: { invalid, error}
                    }) => (
                        <div className="w-[300px]" >
                            <input onChange={onChange} className="h-[40px] w-full text-[13px] font-normal border border-gray-400 rounded-md px-2 text-blue-gray-600" value={value} type="text" color="blue-gray" placeholder="Title du template" size="lg" error={invalid} />
                            {error && 
                                <span className=" text-[10px] text-red-400" >{error.message}</span>
                            }
                        </div>
                    )}
                    name="templateName"
                    control={control}
                />

                <Controller
                    render={({
                        field: { onChange, value, ref },
                        fieldState: { invalid, error }
                    }) => (
                        <div className="w-[300px]" >
                            <AsyncSelect
                                cacheOptions
                                ref={ref}
                                defaultOptions
                                defaultValue={edit && {
                                    label: state.category.category_name,
                                    value: state.category.id
                                }}
                                loadOptions={loadOptionsCategorie}
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        height: 40,
                                        width: '100%',
                                        fontSize: 13,
                                        fontWeight: "400",
                                        color: "red"
                                    }),
                                }}
                                placeholder="catégorie du dossier"
                                onChange={(val) => { onChange(val.value)}}
                            />
                            {error &&
                                <span className=" text-[10px] text-red-400 " >{error.message}</span>
                            }
                        </div>
                    )}
                    name="categoryId"
                    control={control}
                />

                {!(edit && loadFile) ?
                    <button 
                        // disabled={!isDirty}
                        onClick={handleSubmit(handleClick)}
                        className=" bg-green-500 px-4 text-white disabled:bg-gray-600 rounded-md h-[35px]  font-medium text-[13px] " 
                    >
                        {edit? "Enrégistrer" : "Valider"}
                    </button>
                :
                    <button 
                        disabled={true}
                        onClick={handleSubmit(handleClick)}
                        className=" bg-green-500 px-4 text-white disabled:bg-gray-600 rounded-md h-[35px]  font-medium text-[13px] " 
                    >
                        chargement...
                    </button>
                }

            </div>

            <div className="control-section w-full overflow-hidden flex-1 flex flex-row ">

                <div className="w-[25%] flex flex-col px-[5px] max-h-[680px] control-section" style={{
                    paddingTop: 0,
                    paddingLeft: 5,
                    paddingRight: 5
                }}>
                    {edit ?
                    
                        !isLoading  ?

                            <>
                                <div className=" flex flex-col " >
                                    <label className=" font-medium " style={{ display: "block", margin: "1px", paddingTop: "8px" }}>
                                        Liste des variables
                                    </label>
                                    <button 
                                        onClick={() => { 
                                            setDialogue({
                                                size: "sm",
                                                open: true,
                                                view: "create-variable-group",
                                                data: null,
                                                functionPrependGroupVariable: prependGroup
                                            })
                                        }}
                                        disabled={isLoading}
                                        className=" bg-primary disabled:bg-gray-600 text-white rounded-md h-[35px] mt-3 font-medium text-[13px] " 
                                    >
                                        Créer un groupe de variable
                                    </button>
                                </div>
                                <div className=" mt-2 h-[500px] overflow-scroll w-full " >

                                    <Controller
                                        render={({
                                            fieldState: {error}
                                        }) => (

                                            <>
                                                {error && <span className=" text-[12px] text-red-500 " >{error.message}</span>}

                                                <SimpleTreeView
                                                    aria-label="customized"
                                                    sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 280 }}
                                                >
                                                    {fieldGroup.map((field, index) => (
                                                        <StyledTreeItem 
                                                            key={`FoldersGen1${index}`}
                                                            itemId={`FoldersGen1${index}`} 
                                                            labelIcon={FaFolder} 
                                                            delete={field.name == "Autres"} 
                                                            labelText={field.name}
                                                            onHandleDelete={() => { appendDeletedGroup(field.customId); removeGroup(index)} }
                                                        >
                                                            <NextedTreeItem insertField={insertField} deletedVariable={appendDeletedVariable} add={!field.isClientGroup} nextIndex={index} control={control}/>
                                                        </StyledTreeItem>
                                                    ))}
                                                </SimpleTreeView>
                                            </>

                                        )}
                                        name="group"
                                        control={control}
                                    />

                                </div>
                            </>

                        :  
                            <div className=" flex flex-1 flex-col items-center gap-y-2 mt-2 " >
                                {Array.from({ length: 6 }).map((_, key) => (
                                <div key={"variables"+key} className=" animate-pulse bg-gradient-to-br from-gray-100 to-blue-gray-200  rounded-[8px] bg-white p-[2%] h-[40px] w-[95%] " />
                                ))}
                            </div>

                        :

                        <>
                            <div className=" flex flex-col " >
                                <label className=" font-medium " style={{ display: "block", margin: "1px", paddingTop: "8px" }}>
                                    Liste des variables
                                </label>
                                <button 
                                    onClick={() => { 
                                        setDialogue({
                                            size: "sm",
                                            open: true,
                                            view: "create-variable-group",
                                            data: null,
                                            functionPrependGroupVariable: prependGroup
                                        })
                                    }}
                                    className=" bg-primary disabled:bg-gray-600 text-white rounded-md h-[35px] mt-3 font-medium text-[13px] " 
                                >
                                    Créer un groupe de variable
                                </button>
                            </div>
                            <div className=" mt-2 h-[500px] overflow-scroll w-full " >

                                <Controller
                                    render={({
                                        fieldState: {error}
                                    }) => (

                                        <>
                                            {error && <span className=" text-[12px] text-red-500 " >{error.message}</span>}

                                            <SimpleTreeView
                                                aria-label="customized"
                                                sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 280 }}
                                            >
                                                {fieldGroup.map((field, index) => (
                                                    <StyledTreeItem 
                                                        key={`FoldersGen1${index}`}
                                                        itemId={`FoldersGen1${index}`} 
                                                        labelIcon={FaFolder} 
                                                        delete={field.name == "Autres"} 
                                                        labelText={field.name}
                                                        onHandleDelete={() => removeGroup(index)}
                                                    >
                                                        <NextedTreeItem insertField={insertField} add={!field.isClientGroup} nextIndex={index} control={control}/>
                                                    </StyledTreeItem>
                                                ))}
                                            </SimpleTreeView>
                                        </>

                                    )}
                                    name="group"
                                    control={control}
                                />

                            </div>
                        </>
                    }
                    
                </div>

                <div className="w-[80%] flex flex-1 control-section mb-10 " style={{ paddingLeft: "0px", paddingRight: "0px", paddingTop: "5px" }}>
                    <DocumentEditorContainerComponent id="container" ref={container} style={{ display: "block" }} height={590} serviceUrl={hostUrl} enableSfdtExport={true} enableToolbar={true} locale="fr-FR" />
                </div>

            </div>

            <div className="overlay" id="popup-overlay"></div>

            <div id="waiting-popup">
                <svg className="circular" height="40" width="40">
                    <circle className="circle-path" cx="25" cy="25" r="20" fill="none" strokeWidth="6" strokeMiterlimit="10" />
                </svg>
            </div>

        </div>
    );
};
export default TemplateEdit;