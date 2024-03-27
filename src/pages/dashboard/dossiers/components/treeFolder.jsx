import React from 'react'
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import AsyncSelect from 'react-select/async';
import { CategoriesApi, ClientApi, CollaboApi, FoldersApi } from "@/api/api";


import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Collapse from '@mui/material/Collapse';

import { animated, useSpring } from '@react-spring/web';
import { FaFolder } from "react-icons/fa";

import Typography from '@mui/material/Typography';
import { useDialogueStore } from '@/store/dialogue.store';

function DotIcon() {
    return (
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '70%',
                bgcolor: 'warning.main',
                display: 'inline-block',
                verticalAlign: 'middle',
                zIndex: 1,
                mr: 1,
            }}
        />
    );
}

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
                    <Box
                        component={LabelIcon}
                        className="labelIcon"
                        color="inherit"
                        sx={{ mr: 1, fontSize: '1.2rem' }}
                    />
                    <StyledTreeItemLabel variant="body2">{labelText}</StyledTreeItemLabel>
                </Box>
            }
            {...other}
            ref={ref}
        />
    );
});



export default function TreeFolder({ setActiveStep, configFolder, setConfigFolder }) {

    const { setDialogue } = useDialogueStore()

    const schema = yup.object({
        subFoldersGen1: yup.array().of(
            yup.object({
                folderName: yup.string().trim().required("Le nom du dossier est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                isMinuteFolder: yup.boolean().required(),
                subFoldersGen2: yup.array().of(
                    yup.object({
                        folderName: yup.string().trim().required("Le nom du dossier est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                        isMinuteFolder: yup.boolean().required(),
                        informationRequested: yup.array().of(
                            yup.object({
                                question: yup.string().trim().required("L'information est requise").max(250, "Ne doit pas dépasser 250 caractères")
                            })
                        ).test('is-unique-question', 'Vous demandez la même information plusieurs fois', function (value) {
                            const questions = value.map(informationRequested => informationRequested.question);
                            const uniquepartyquestions = new Set(questions);
                            return questions.length === uniquepartyquestions.size;
                        })
                    })
                ),
                informationRequested: yup.array().of(
                    yup.object({
                        question: yup.string().trim().required("L'information est requise").max(250, "Ne doit pas dépasser 250 caractères")
                    })
                ).test('is-unique-question', 'Vous demandez la même information plusieurs fois', function (value) {
                    const questions = value.map(informationRequested => informationRequested.question);
                    const uniquepartyquestions = new Set(questions);
                    return questions.length === uniquepartyquestions.size;
                })
            })
        ).test('is-unique', 'Les noms des dossiers et sous dossiers doivent être unique', function (value) {
            const sub_dossier_names = value.map(subDos => subDos.folderName);
            const uniqueSubDosNames = new Set(sub_dossier_names);
            return sub_dossier_names.length === uniqueSubDosNames.size;
        })
    }).required();


    const { control, setValue, handleSubmit, setError, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        // defaultValues: null
    });

    const { fields:fieldSubFoldersGen1, append:appendSubFoldersGen1, remove:removeSubFoldersGen1 } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "subFoldersGen1", // unique name for your Field Array
    });


    const getCient = async (inputValue) => {
        const res = await ClientApi.getClient(1, 12, inputValue)
        return res.data.map((data) => { return { label: data?.civility !== 'Structure' ? data.firstname + ' ' + data.lastname : data.denomination, value: data.id } })
    };
    const loadOptionsClient = (inputValue) =>
    new Promise((resolve) => {
        resolve(getCient(inputValue))
    });


    const handleClick = async (data) => {
        // setBackdrop({ active: true })
        // mutate(data)
        setConfigFolder(data)
        setActiveStep(1)
        console.log('====================================');
        console.log(data);
        console.log('====================================');
    };


    return (
        <>

            <div className=" w-full md:w-[80%] self-center py-6 flex flex-wrap gap-y-5 gap-x-[4%] rounded-md mb-[30px] mt-[50px] justify-center shadow-md " >

                <div className=" w-full md:w-[40%] flex flex-col flex-wrap gap-y-2 justify-center " >

                    <SimpleTreeView
                        aria-label="gmail"
                        defaultExpandedItems={['1']}
                        defaultSelectedItems="3"
                        sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    >

                        <StyledTreeItem itemId="1" labelText="Le Dossier" labelIcon={FaFolder}>

                            {/* <StyledTreeItem itemId="5" labelText="Company" labelIcon={FaFolder}>
                                <StyledTreeItem itemId="8" labelText="Payments" labelIcon={DotIcon} />
                                <StyledTreeItem itemId="9" labelText="Meeting notes" labelIcon={DotIcon} />
                                <StyledTreeItem itemId="10" labelText="Tasks list" labelIcon={DotIcon} />
                                <StyledTreeItem itemId="11" labelText="Equipment" labelIcon={DotIcon} />
                            </StyledTreeItem>

                            <StyledTreeItem itemId="6" labelText="Personal" labelIcon={DotIcon} />

                            <StyledTreeItem itemId="7" labelText="Images" labelIcon={DotIcon} /> */}

                            {fieldSubFoldersGen1.map((field, index) => (
                                <StyledTreeItem key={index} itemId={`FoldersGen1${index}`} labelText={field.folderName} labelIcon={FaFolder}>
                                    
                                    <button 
                                        onClick={() => { 
                                            appendSubFoldersGen1({
                                                folderName: "Sous-catégorie",
                                                isMinuteFolder: false,
                                                subFoldersGen2: [],
                                                informationRequested: []
                                            })
                                        }}
                                        className=" w-[35px] [35ppx] flex justify-left items-center text-[12px] px-4 mt-2 text-white h-[32px] bg-green-500 rounded-md" 
                                    >
                                        +
                                    </button>

                                </StyledTreeItem>
                            ))}

                            <button 
                                onClick={() => { 
                                    
                                    setDialogue({
                                        size: "md",
                                        open: true,
                                        view: "add-sub-folder",
                                        data: null,
                                        function: () => appendSubFoldersGen1({
                                            folderName: "",
                                            isMinuteFolder: false,
                                            subFoldersGen2: [],
                                            informationRequested: [],
                                        })
                                    })

                                }}
                                className=" w-[35px]== [35px] flex justify-start items-center text-[12px] px-4 mt-2 text-white h-[32px] bg-green-500 rounded-md" 
                            >
                                +
                            </button>

                        </StyledTreeItem>

                    </SimpleTreeView>

                </div>

                <div className=" w-full md:w-[40%] flex flex-col flex-wrap gap-y-2 justify-center " >


                </div>

            </div>

            <div className=" w-full md:w-[80%] mt-5 self-center flex flex-row justify-end gap-x-5 " >
                <button onClick={() => setActiveStep(0)} className=" bg-primary text-white px-3 py-2 rounded-md  " >
                    Précédent
                </button>
                <button onClick={handleSubmit(handleClick)} className=" bg-primary text-white px-3 py-2 rounded-md  " >
                    Suivant
                </button>
            </div>

        </>
    )
}
