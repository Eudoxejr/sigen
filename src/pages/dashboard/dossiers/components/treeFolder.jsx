import React from 'react'
import { produce } from "immer"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import AsyncSelect from 'react-select/async';
import { CategoriesApi, ClientApi, CollaboApi, FoldersApi } from "@/api/api";

import IconButton from '@mui/material/IconButton';
import { FaTrash } from "react-icons/fa";
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Collapse from '@mui/material/Collapse';

import { animated, useSpring } from '@react-spring/web';
import { FaFolder } from "react-icons/fa";

import Typography from '@mui/material/Typography';
import { useDialogueStore } from '@/store/dialogue.store';
import TreeFolderGen2 from './treeFolderGen2';
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


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
            : theme.palette.grey[400],
    position: 'relative',
    [`& .${treeItemClasses.content}`]: {
        flexDirection: 'row-reverse',
        borderRadius: theme.spacing(0.7),
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
        padding: theme.spacing(0.5),
        paddingRight: theme.spacing(1),
        fontWeight: 500,
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
        },
        [`& .${treeItemClasses.iconContainer}`]: {
            marginRight: theme.spacing(2),
        },
        [`&.Mui-expanded `]: {
            '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.dark,
            },
            '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                left: '16px',
                top: '44px',
                height: 'calc(100% - 48px)',
                width: '1.5px',
                backgroundColor:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[300]
                        : theme.palette.grey[700],
            },
        },
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
        },
        [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
            backgroundColor:
                theme.palette.mode === 'light'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.dark,
            color: 'white',
        },
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: theme.spacing(3.5),
        [`& .${treeItemClasses.content}`]: {
            fontWeight: 500,
        },
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



export default function TreeFolder({ setActiveStep, configFolder, setConfigFolder }) {

    const { setDialogue } = useDialogueStore()
    const queryClient = useQueryClient();
    const { setBackdrop } = useDialogueStore()
    const navigate = useNavigate();

    const schema = yup.object({
        subFoldersGen1: yup.array().of(
            yup.object({
                folderName: yup.string().trim().required("Le nom du dossier est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                isMinuteFolder: yup.boolean().required(),
                subFoldersGen2: yup.array().of(
                    yup.object({
                        folderName: yup.string().trim().required("Le nom du dossier est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                        isMinuteFolder: yup.boolean().required()
                    })
                )
                .test('is-unique-gen2', 'Les noms des sous dossiers doivent être unique', function (value) {
                    if(value)
                    {
                        const sub_dossier_names = value?.map(subDos => subDos.folderName);
                        const uniqueSubDosNames = new Set(sub_dossier_names);
                        return sub_dossier_names.length === uniqueSubDosNames.size;
                    }
                    return true
                })
            })
        ).test('is-unique', 'Les noms des dossiers doivent être unique', function (value) {
            const sub_dossier_names = value.map(subDos => subDos.folderName);
            const uniqueSubDosNames = new Set(sub_dossier_names);
            return sub_dossier_names.length === uniqueSubDosNames.size;
        })
    }).required();


    const { control, setValue, handleSubmit, setError, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            "subFoldersGen1": [
                {
                    "folderName": 'Minute',
                    "isMinuteFolder": true,
                }
            ]
        }
    });

    const { fields:fieldSubFoldersGen1, prepend: prependSubFoldersGen1, remove:removeSubFoldersGen1 } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "subFoldersGen1", // unique name for your Field Array
    });


    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
            return FoldersApi.createFolders(data)
        },
        gcTime:0,
        onSuccess: (response) => {

            navigate(-1)
            toast.success('Dossier créé avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            queryClient.setQueriesData(["getDossier"], (dataDos) => {
                const nextData = produce(dataDos, draftData => {
                    draftData.data.unshift(response.data)
                    draftData.meta.total = dataDos.meta.total+1
                })
                return nextData;
            })

            setBackdrop({active: false})

        },
        onError: ({response}) => {
            
            setError('root.serverError', { 
                message: response.data.message || "Une erreur s'est produite lors de la création du dossier"
                // message: "Une erreur s'est produite lors de la connexion"
            })
            toast.error('Une Erreur s\'est produite', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            setBackdrop({active: false})
        }

    })


    const handleClick = async (data) => {
        const finalData = {
            ...configFolder,
            ...data
        }
        setBackdrop({active: true})
        mutate(finalData)
    };


    return (
        <>

            <div className=" w-full md:w-[80%] self-center py-6 flex flex-wrap gap-y-5 gap-x-[4%] rounded-md mb-[30px] mt-[50px] " >

                <div className=" w-full md:w-[40%] flex flex-col font-medium flex-wrap text-[13px] " >
                    Créer l'arborescence du dossier. Ajouter des dossiers et sous-dossiers au besoin. <br/>
                    <br/>
                    Vous pouvez aussi sélectionnez modèle d'arborescence:
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        // loadOptions={loadOptionsCategorie}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: 40,
                                fontSize: 13,
                                fontWeight: "400",
                                marginTop: 15,
                                color: "red"
                            }),
                        }}
                        placeholder="Choisir un modèle"
                        onChange={(val) => { onChange(val.value)}}
                    />
                </div>

                <div className=" w-full md:w-[45%] flex flex-col flex-wrap gap-y-2 px-[2%] " >

                    <SimpleTreeView
                        defaultExpandedItems={['1']}
                        sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    >

                        <StyledTreeItem 
                            itemId="1" 
                            labelText="Le Dossier" 
                            labelIcon={FaFolder}
                            delete={true} 
                        >

                            {fieldSubFoldersGen1.map((field, index) => (
                                
                                <StyledTreeItem 
                                    key={index} 
                                    itemId={`FoldersGen1${index}`} 
                                    labelText={field.folderName} 
                                    labelIcon={FaFolder}
                                    delete={field.folderName == "Minute"} 
                                    onHandleDelete={() => removeSubFoldersGen1(index)}
                                >
                                    {field.folderName !== "Minute" &&
                                        <TreeFolderGen2 errors={errors} add={field.folderName !== "Minute"} nextIndex={index} control={control} />
                                    }
                                </StyledTreeItem>

                            ))}

                            <button 
                                onClick={() => { 
                                    setDialogue({
                                        size: "sm",
                                        open: true,
                                        view: "add-sub-folder",
                                        data: null,
                                        function: prependSubFoldersGen1
                                    })
                                }}
                                className=" w-[35px] text-[12px] mt-2 text-white flex justify-center items-center h-[32px] bg-green-500 rounded-md" 
                            >
                                +
                            </button>

                            { errors.subFoldersGen1 &&
                                <span className=" text-red-500 text-[12px] " >{errors.subFoldersGen1.message}</span>
                            }

                        </StyledTreeItem>

                    </SimpleTreeView>

                </div>

            </div>

            <div className=" w-full md:w-[80%] mt-5 self-center flex flex-row justify-end gap-x-5 " >
                <button onClick={() => setActiveStep(0)} className=" bg-primary font-medium text-[14px] text-white px-4 py-2 rounded-md  " >
                    Précédent
                </button>
                <button onClick={handleSubmit(handleClick)} className=" bg-green-600 font-medium text-[14px] text-white px-4 py-2 rounded-md  " >
                    Créer le dossier
                </button>
            </div>

        </>
    )
}
