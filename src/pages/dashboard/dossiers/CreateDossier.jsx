
/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { produce } from "immer"
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Tooltip,
    Button,
    Input,
    Textarea
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlinePercentage, AiFillEuroCircle } from "react-icons/ai";
import { BsCardImage } from "react-icons/bs";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Switch from '@mui/material/Switch';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesApi, ClientApi, CollaboApi, FoldersApi } from "@/api/api";
import BeatLoader from "react-spinners/BeatLoader";
import { useDropzone } from 'react-dropzone'
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { RiForbidLine } from "react-icons/ri";
import { toast } from 'react-toastify';

import { useDialogueStore } from '@/store/dialogue.store';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import Check from '@mui/icons-material/Check';
// import SettingsIcon from '@mui/icons-material/Settings';
import { CiSettings } from "react-icons/ci";
import { GrDocumentConfig } from "react-icons/gr";
import { LuFolderTree } from "react-icons/lu";
import { RiInformationLine } from "react-icons/ri";
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';


import ConfigFolder from './components/configFolder';
import TreeFolder from './components/treeFolder';


const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <div></div>
                // <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg, #2C93EB 0%, #2C93EB 50%, #2C93EB 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg, #2C93EB 0%, #2C93EB 50%, #2C93EB 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 136deg, #2C93EB 0%, #2C93EB 50%, #2C93EB 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg, #2C93EB 0%, #2C93EB 50%, #2C93EB 100%)',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <GrDocumentConfig size={22} />,
        2: <LuFolderTree size={22} />,
        3: <RiInformationLine size={25} />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};


const DossierCreate = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setBackdrop } = useDialogueStore()
    const [activeStep, setActiveStep] = useState(0);
    const [configFolder, setConfigFolder] = useState(null);

    const schema = yup.object({

        clientId: yup.string().trim("Sélectionner le client svp").required("Sélectionner le client svp"),
        categoryId: yup.string().trim("Sélectionner une catégorie svp").required("Sélectionner une catégorie svp"),
        managerId: yup.string().trim("Sélectionner un titulaire svp").required("Sélectionner un titulaire svp"),
        subManagerId: yup.string(),

        subCategories: yup.array().of(
            yup.object({
                sub_category_name: yup.string().trim().required("Le nom de la sous-catégorie est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                informationDone: yup.array().of(
                    yup.object().shape({
                        informationRequestedId: yup.string().required("Entrez cette information svp"),
                        key: yup.string().required("Entrez cette information svp"),
                        value: yup.string().required("Entrez cette information svp")
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
        ).test('is-unique', 'Les noms des sous-catégorie doivent être unique', function (value) {
            const sub_category_names = value.map(subCat => subCat.sub_category_name);
            const uniqueSubCategoryNames = new Set(sub_category_names);
            return sub_category_names.length === uniqueSubCategoryNames.size;
        })

    }).required();


    const { control, setValue, handleSubmit, setError, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            subCategories: [
            ]
        }
    });

    const { fields: fieldSubCategory, append: appendSubCategory, remove: removeSubCategory } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "subCategories", // unique name for your Field Array
    });


    const watchSubCategories = useWatch({
        control: control,
        name: "subCategories"
    })


    const onCategorieChange = (value) => {

        // setValue('subCategories', val.other.subCategories, {shouldDirty: true})
        const newValue = value.map((val) => {
            return {
                ...val,
                ...!val?.is_multi_parts ? {
                    informationDone: val.informationRequested.map((informationRequestedItem) => {
                        return {
                            informationRequestedId: informationRequestedItem?.id,
                            key: informationRequestedItem?.question,
                            value: ''
                        }
                    })
                } : null,
                ...val?.is_multi_parts ? {
                    partyInvolved: val?.partyInvolved.map((val2) => {
                        return {
                            ...val2,
                            "informationDone": val?.party_involved_are_customer ?
                                [{ key: val2?.party_title, value: '' }]
                                : val.informationRequested.map((informationRequestedItem) => {
                                    return {
                                        informationRequestedId: informationRequestedItem?.id,
                                        key: informationRequestedItem?.question,
                                        value: ''
                                    }
                                })
                        }
                    })
                } : null,
            }
        })

        setValue('subCategories', newValue, { shouldDirty: true })

    }


    const { mutate, isLoading } = useMutation({

        mutationFn: async (data) => {
            return FoldersApi.createFolders(data)
        },
        gcTime: 0,
        onSuccess: (response) => {
            navigate(-1)
            toast.success('Dossiers créé avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            // queryClient.setQueriesData(["getAllCategories"], (dataCat) => {
            //     const nextData = produce(dataCat, draftData => {
            //         draftData.data.unshift(response.data)
            //         draftData.meta.total = dataCat.meta.total+1
            //     })
            //     return nextData;
            // })

            setBackdrop({ active: false })

        },
        onError: ({ response }) => {
            setError('root.serverError', {
                message: response.data.msg || "Une erreur s'est produite lors de la création du dossiers"
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
            setBackdrop({ active: false })
        }

    })


    const handleClick = async (data) => {
        setBackdrop({ active: true })
        mutate(data)
    };

    const steps = ['1.Configuration du dossier', '2.Arborescence du dossier'];

    return (

        // <RenderIf allowedTo={Permissions.ADD_TRANSPORT_MEAN}>

        <div className="mt-12 mb-2 flex-1 w-full flex flex-col">

            <Card className=" min-h-[calc(100vh-150px)] shadow-none bg-transparent " >

                <div className='flex items-center' >
                    <Tooltip content="Retour">
                        <button onClick={() => navigate(-1)} className=" bg-primary w-[40px] h-[40px] mr-4 rounded-full flex justify-center items-center" >
                            <AiOutlineArrowLeft className=' text-white ' size={16} />
                        </button>
                    </Tooltip>
                    <Typography variant="h6" className=" text-blue-gray-700 text-[14px] " color="blue-gray" >
                        CREER UN DOSSIER
                    </Typography>
                </div>

                <CardBody className="flex flex-1 flex-col ">

                    <Stack sx={{ width: '100%' }} spacing={1}>
                        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Stack>

                    {activeStep === 0 &&
                        <ConfigFolder 
                            setActiveStep={setActiveStep}
                            setConfigFolder={setConfigFolder}
                            configFolder={configFolder}
                        />
                    }

                    {activeStep === 1 &&
                        <TreeFolder 
                            setActiveStep={setActiveStep}
                            setConfigFolder={setConfigFolder}
                            configFolder={configFolder}
                        />
                    }

                    {/* <Button
                            className='mt-8'
                            variant="gradient"
                            color="green"
                            onClick={handleSubmit(handleClick)}
                            disabled={isLoading}
                        >

                            {isLoading ?
                                <BeatLoader color="#fff" size={8} />
                                :
                                <span>Sauvegarder</span>
                            }

                        </Button> */}

                </CardBody>



            </Card>

        </div>

        // </RenderIf>

    );
}

export default DossierCreate;
