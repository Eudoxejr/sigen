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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Switch from '@mui/material/Switch';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoyenApi, TransportModeApi } from "@/api/api";
import BeatLoader from "react-spinners/BeatLoader";
import { useDropzone } from 'react-dropzone'
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { toast } from 'react-toastify';

import NestedTarification from '@/components/common/nextedParty';
import { uploadFile } from '@/utils/uploadS3';
import { useDialogController } from '@/context/dialogueProvider';
import { v4 as uuidv4 } from 'uuid';
import { RenderIf } from "@/components/common/render.if";
import { Permissions } from "@/data/role-access-data";


const TransportMoyenCreate = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [_, dispatch] = useDialogController(); 


    const schema = yup.object({

        idTransportMode: yup.array().required("Entrez au moins un mode de transport").of(yup.string().required()),
        title: yup.string().trim().required("Le nom du moyen de transport est requis"),
        transportMoyenDescription: yup.string().trim().required("La description du moyen de transport est requis").min(5, "La description doit être au moins de 5 caractères"),
        formulaApplied: yup.string().trim().required("Choississez une formule"),
        vehicleName: yup.array().required("Entrez au moins un nom de vehicule").of(
            yup.string()
        ).min(1, "Entrez au moins un nom de vehicule"),
        onContact: yup.boolean().required("le champ est requis"),
        comeToMe: yup.boolean().required("le champ est requis"),
        travelCommissionForPlatformPercent: yup.number().when(['typeTransportMoyen'], ([typeTransportMoyen], schema) => {

            if (typeTransportMoyen === 'PRIVATEDRIVE') 
            {
                return schema.required("Le pourcentage de la commision TPT est requis")
            }
            else {
                return schema.nullable()
            }
    
        }),
        typeTransportMoyen: yup.string().required("le type de moyen de transport est requis").oneOf(["PRIVATEDRIVE", "PMR", "DEFAULT", "AVION", "PIROGUE"]),
        class: yup.array().nullable().of(
            yup.object({
                idClass: yup.string().trim().required(),
                className: yup.string().trim().required(),
                classDescription: yup.string().trim().required(),
                travelCommissionForPlatformPercent: yup.number().required(),
                prixPriseEnChargeUnder3K: yup.string(),
                uniqTarifUnder3K: yup.number(),
                pricePerMinute: yup.number().test('customValidation', 'Entrer le prix par minute', function(val) {
                    const {from} = this;
                    if (from[1].value.formulaApplied === 'PER_KILOMETER_PER_TIME') 
                    {
                        const valid = yup.number().required().isValidSync(from[0].value.pricePerMinute)
                        return valid   
                    }
                    else{
                        return true
                    }
                }),
                prixParJour: yup.number().test('customValidation', 'Entrer le prix par jour', function(val) {
                    const {from} = this;
                    if (from[1].value.formulaApplied === 'PER_DAY') 
                    {
                        const valid = yup.number().required().isValidSync(from[0].value.prixParJour)
                        return valid   
                    }
                    else{
                        return true
                    }
                }),
                tarification: yup.array().of(                          
                    yup.object({
                        day: yup.array().test('customValidation', 'Choississez un jour', function(val) {
                            const {from} = this;
                            if (from[2].value.formulaApplied === 'PER_KILOMETER') 
                            {
                                const valid = yup.array().required().min(1).isValidSync(from[0].value.day)
                                return valid   
                            }
                            else{
                                return true
                            }
                        }),
                        startTime: yup.string().test('customValidation', "Choississez l'heure de debut", function(val) {
                            const {from} = this;
                            if (from[2].value.formulaApplied === 'PER_KILOMETER') 
                            {
                                const valid = yup.string().trim().required().isValidSync(from[0].value.startTime)
                                return valid   
                            }
                            else{
                                return true
                            }
                        }),
                        endTime: yup.string().test('customValidation', "Choississez l'heure de fin", function(val) {
                            const {from} = this;
                            if (from[2].value.formulaApplied === 'PER_KILOMETER') 
                            {
                                const valid = yup.string().trim().required().isValidSync(from[0].value.endTime)
                                return valid   
                            }
                            else{
                                return true
                            }
                        }),
                        prixPriseEnCharge: yup.string().test('customValidation', "Entrez le prix de la prise en charge", function(val) {
                            const {from} = this;
                            if (from[2].value.formulaApplied === 'PER_KILOMETER') 
                            {
                                const valid = yup.number().required().isValidSync(from[0].value.prixPriseEnCharge)
                                return valid   
                            }
                            else{
                                return true
                            }
                        }),
                        pricePerKilometer: yup.string().test('customValidation', "Entrez le prix par kilomètre", function(val) {
                            const {from} = this;
                            if (from[2].value.formulaApplied === 'PER_KILOMETER') 
                            {
                                const valid = yup.number().required().isValidSync(from[0].value.pricePerKilometer)
                                return valid   
                            }
                            else
                            {
                                return true
                            }
                        })
                    })
                )
            })
        ).min(1, "Entrez au moins une class"),
        attachmentDriverRegister: yup.array().nullable().of(
            yup.object({
                title: yup.string().trim().required(),
                extension: yup.array().of(
                    yup.string()
                ).min(1, "Entrez au moins une extension")
            })
        ),
        attachmentVehiculeRegister: yup.array().nullable().of(
            yup.object({
                title: yup.string().trim().required(),
                extension: yup.array().of(
                    yup.string()
                ).min(1, "Entrez au moins une extension")
            })
        ),
        fieldVehiculeRegister: yup.array().nullable().of(
            yup.object({
                titleField: yup.string().trim().required(),
                typeField: yup.string().trim().required()
            })
        ),
        illustrationPic: yup.mixed().required("L'Image d'illustration est requis")
        
    }).required();


    const {control, watch, setValue, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            onContact: false,
            comeToMe: true,
            class: [
                {
                    idClass: uuidv4(),
                    className: "Basic",
                    classDescription: "La classe basic ...",
                    travelCommissionForPlatformPercent: 20,
                    tarification: [
                        {
                            day: [1,2,3,4,5,6,0],
                            startTime: '06:00',
                            endTime: '18:00',
                            prixPriseEnCharge: 2.10,
                            pricePerKilometer: 1.86
                        },
                        {
                            day: [1,2,3,4,5,6,0],
                            startTime: '18:01',
                            endTime: '05:59',
                            prixPriseEnCharge: 2.10,
                            pricePerKilometer: 2.79
                        },
                        {
                            day: ["ferier"],
                            startTime: '06:00',
                            endTime: '18:00',
                            prixPriseEnCharge: 2.10,
                            pricePerKilometer: 2.86
                        },
                        {
                            day: ["ferier"],
                            startTime: '18:01',
                            endTime: '05:59',
                            prixPriseEnCharge: 2.10,
                            pricePerKilometer: 3.89
                        }
                    ]
                }
            ],
            attachmentDriverRegister: [
                {
                    title: "",
                    extension: ["jpg", "jpeg", "png", "pdf"]
                }
            ],
            attachmentVehiculeRegister: [
                {
                    title: "",
                    extension: ["jpg", "jpeg", "png", "pdf"]
                },
            ],
            fieldVehiculeRegister: [
                {
                    titleField: "",
                    typeField: ""
                }
            ]
        }
    });

    const { fields:fieldClass, append:appendClass, remove:removeClass } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "class", // unique name for your Field Array
    });

    const { fields:fieldDriverRegister, append:appendDriverRegister, remove:removeDriverRegister } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "attachmentDriverRegister", // unique name for your Field Array
    });

    const { fields:fieldVehiculeRegisterattachement, append:appendVehiculeRegister, remove:removeVehiculeRegister } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "attachmentVehiculeRegister", // unique name for your Field Array
    });

    const { fields:champsVehiculeRegister, append:appendChampsVehiculeRegister, remove:removeChampsVehiculeRegister } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "fieldVehiculeRegister", // unique name for your Field Array
    });


    const watchformulaApplied = watch("formulaApplied", "");
    const watchtypeTransportMoyen = watch("typeTransportMoyen", "");
    const watchPhotoAdd = watch("illustrationPic", null);


    const getModes = async (inputValue) => {
        const res = await TransportModeApi.getTransportMode(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.title, value: data.idTransportMode } })
    };

    const loadOptionsMode = (inputValue) => 
        new Promise((resolve) => {
            resolve(getModes(inputValue))
        }
    );

    const [file, setfile] = useState();
    
    const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({

        multiple: false,
        noClick: true,
        // maxSize: 5000,
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': [],
            'image/svg': []
        },
        onDropAccepted: result => {
            setValue('illustrationPic', result[0])
            setfile(URL.createObjectURL(result[0]))
        }

    })


    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
            return MoyenApi.createMoyen(data)
        },
        gcTime:0,
        onSuccess: (response) => {

            navigate(-1)
            toast.success('Moyen de transport créé avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            queryClient.setQueriesData(["getMoyen"], (dataMoyen) => {
                const nextData = produce(dataMoyen, draftData => {
                    draftData.data.unshift(response.data)
                    draftData.meta.total = dataMoyen.meta.total+1
                })
                return nextData;
            })

            dispatch({
                type: "SET_BACKDROP",
                value: false
            })

        },
        onError: ({response}) => {
            
            setError('root.serverError', { 
                message: response.data.msg || "Une erreur s'est produite lors de la création du service"
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
            dispatch({
                type: "SET_BACKDROP",
                value: false
            })
        }

    })


    const handleClick = async (data) => {

        // alert("bon")

        dispatch({
            type: "SET_BACKDROP",
            value: true
        })

        await uploadFile(data.illustrationPic)
        .then((s3Link) => {
            data.illustrationPic = s3Link.Location
            mutate(data)    
        })
        .catch((err) => {

            console.log(err);

            toast.error("Une erreur s'est produite lors de l'upload de l'image", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            dispatch({
                type: "SET_BACKDROP",
                value: false
            })
        })

        // mutate(data)
    };


    return (

        <RenderIf allowedTo={Permissions.ADD_TRANSPORT_MEAN}>
            <div className="mt-12 mb-2 flex-1 w-full flex flex-col">

                <Card className=" min-h-[calc(100vh-150px)] shadow-none bg-transparent " >

                    <CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">

                        <div className='flex items-center' >
                            <Tooltip content="Retour">
                                <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                                    <AiOutlineArrowLeft color='white' size={22} />
                                </button>
                            </Tooltip>

                            <Typography variant="h6" color="blue-gray" >
                                Créer un moyen de transport
                            </Typography>
                        </div>

                        <Button
                            variant="gradient"
                            color="green"
                            onClick={handleSubmit(handleClick)}
                            disabled={isLoading}
                        >

                            {isLoading ?
                                <BeatLoader color="#fff" size={8} />
                                :
                                <span>Créer</span>
                            }

                        </Button>

                    </CardHeader>

                    <CardBody className="flex flex-1 pt-2 flex-col overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">

                        <div className="flex flex-row justify-between flex-wrap gap-y-6 gap-x-[1%]" >

                            <div className=" w-full md:w-[49%] min-h-[280px] rounded-lg bg-[#fff] shadow-sm " >
                                
                                <div className="h-[50px] w-full flex items-center pl-4 " >
                                    <span className=" text-blue-gray-500 text-[14px] font-semibold " >Informations Pincipales (1/2)</span>
                                </div>

                                <div className=" w-full flex flex-col flex-wrap gap-y-4 mt-1 justify-center " >

                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                        <Controller
                                            render={({
                                            field: { onChange, value },
                                            fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <AsyncSelect 
                                                        cacheOptions 
                                                        defaultOptions 
                                                        loadOptions={loadOptionsMode} 
                                                        isMulti
                                                        styles={{
                                                            control: (baseStyles, state) => ({
                                                            ...baseStyles,
                                                                fontSize: 14,
                                                                fontWeight: "400",
                                                                color: "red"
                                                            }),
                                                        }}
                                                        placeholder="Modes de transport"
                                                        onChange={(val) => onChange(val.map((item) => { return item.value })) }
                                                    />
                                                    {error && 
                                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="idTransportMode"
                                            control={control}
                                        />
                                    </div>

                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                        <Controller
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="text" color="blue-gray" label="Nom du moyen de transport" size="lg" error={invalid} />
                                                    {error && 
                                                        <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="title"
                                            control={control}
                                        />
                                    </div>

                                </div>

                                <div className=" w-full flex flex-row flex-wrap gap-y-2 mt-5 justify-center " >

                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                        <Controller
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <Textarea onChange={onChange} className=" w-full " value={value} type="text" color="blue-gray" label="Description du moyen de transport" size="lg" error={invalid} />
                                                    {error && 
                                                        <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="transportMoyenDescription"
                                            control={control}
                                        />
                                    </div>

                                </div>

                                <div className=" w-full flex flex-row flex-wrap gap-y-2 mt-1 mb-2 justify-center " >

                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >

                                        <Controller
                                            render={({
                                                field: { ref, onChange, value, ...field },
                                                fieldState: { invalid, error },
                                            }) => (
                                                <div style={{marginTop: 15}} >
                                                    <Select
                                                        styles={{
                                                            control: (baseStyles, state) => ({
                                                            ...baseStyles,
                                                                height: 44,
                                                                fontSize: 14,
                                                                fontWeight: "400",
                                                                color: "red"
                                                            }),
                                                        }}
                                                        placeholder="Formule de calcul du prix de la course"
                                                        isSearchable={false}
                                                        onChange={(val) => {
                                                            
                                                            if(val.value == 'AVION')
                                                            {
                                                                onChange(val.value)
                                                                setValue('class', null)
                                                                setValue('attachmentDriverRegister', null)
                                                                setValue('attachmentVehiculeRegister', null)
                                                                setValue('fieldVehiculeRegister', null)
                                                            }
                                                            else
                                                            {
                                                                onChange(val.value)
                                                                setValue('class', [
                                                                    {
                                                                        idClass: uuidv4(),
                                                                        className: "Basic",
                                                                        classDescription: "La classe basic ...",
                                                                        travelCommissionForPlatformPercent: 20,
                                                                        tarification: [
                                                                            {
                                                                                day: [1,2,3,4,5,6,0],
                                                                                startTime: '06:00',
                                                                                endTime: '18:00',
                                                                                prixPriseEnCharge: 2.10,
                                                                                pricePerKilometer: 1.86
                                                                            },
                                                                            {
                                                                                day: [1,2,3,4,5,6,0],
                                                                                startTime: '18:01',
                                                                                endTime: '05:59',
                                                                                prixPriseEnCharge: 2.10,
                                                                                pricePerKilometer: 2.79
                                                                            },
                                                                            {
                                                                                day: ["ferier"],
                                                                                startTime: '06:00',
                                                                                endTime: '18:00',
                                                                                prixPriseEnCharge: 2.10,
                                                                                pricePerKilometer: 2.86
                                                                            },
                                                                            {
                                                                                day: ["ferier"],
                                                                                startTime: '18:01',
                                                                                endTime: '05:59',
                                                                                prixPriseEnCharge: 2.10,
                                                                                pricePerKilometer: 3.89
                                                                            }
                                                                        ]
                                                                    }
                                                                ]),
                                                                setValue("attachmentDriverRegister", [
                                                                    {
                                                                        title: "",
                                                                        extension: ["jpg", "jpeg", "png", "pdf"]
                                                                    }
                                                                ]),
                                                                setValue("attachmentVehiculeRegister", [
                                                                    {
                                                                        title: "",
                                                                        extension: ["jpg", "jpeg", "png", "pdf"]
                                                                    },
                                                                ]),
                                                                setValue("fieldVehiculeRegister", [
                                                                    {
                                                                        titleField: "",
                                                                        typeField: ""
                                                                    }
                                                                ])
                                                            }

                                                        }}
                                                        options={
                                                            [
                                                                {label: 'Par Kilomètre', value: 'PER_KILOMETER'}, 
                                                                {label: 'Par Jour', value: 'PER_DAY'}, 
                                                                {label: 'Par Kilomètre & Temps', value: 'PER_KILOMETER_PER_TIME'}, 
                                                                {label: 'Par Trajet', value: 'PER_ROUTE'},
                                                                {label: 'Sur Devis', value: 'DEVIS'},
                                                                {label: 'Entre Aéroport', value: 'AVION'}
                                                            ]
                                                        } 
                                                    />
                                                </div>
                                            )}
                                            name="formulaApplied"
                                            control={control}
                                        />
                                        {errors?.formulaApplied && 
                                            <span className=" text-[10px] text-red-400 mt-1" >{errors?.formulaApplied.message}</span>
                                        }
                                    
                                    </div>

                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                        <Controller
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <div className="flex flex-row items-center justify-between mt-[4px]">
                                                        <span className=" text-[14px] text-blue-gray-600" >Disponible sur contact</span>
                                                        <Switch onChange={(e) => {onChange(e.target.checked)}} />
                                                    </div>
                                                    {error && 
                                                        <span class Name=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="onContact"
                                            control={control}
                                        />
                                    </div>

                                </div>

                            </div>

                            <div className=" w-full md:w-[49%] min-h-[280px] rounded-lg bg-[#fff] shadow-sm overflow-hidden " >
                                
                                <div className="h-[50px] w-full flex items-center pl-4 " >
                                    <span className=" text-blue-gray-500 text-[14px] font-semibold " >Informations Pincipales (2/2)</span>
                                </div>

                                <div className=" w-full flex flex-col flex-wrap gap-y-4 mt-1 justify-center " >

                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                        <Controller
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <Select
                                                        styles={{
                                                            control: (baseStyles, state) => ({
                                                            ...baseStyles,
                                                                height: 44,
                                                                fontSize: 14,
                                                                fontWeight: "400",
                                                                color: "red"
                                                            }),
                                                        }}
                                                        placeholder="type de moyen de transport"
                                                        isSearchable={false}
                                                        onChange={(val) => { 
                                                            if(val.value === "PRIVATEDRIVE")
                                                            {
                                                                setValue('attachmentVehiculeRegister', null)
                                                                setValue('fieldVehiculeRegister', null)
                                                            }
                                                            onChange(val.value) 
                                                        }}
                                                        options={
                                                            [{label: 'normal', value: 'DEFAULT'}, {label: 'PMR', value: 'PMR'}, {label: 'Chauffeur Privé', value: 'PRIVATEDRIVE'}, {label: 'Avion', value: 'AVION'}, {label: 'Pirogue', value: "PIROGUE"} ]
                                                        } 
                                                    />
                                                    {error && 
                                                        <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="typeTransportMoyen"
                                            control={control}
                                        />
                                    </div>

                                    {watchtypeTransportMoyen == "PRIVATEDRIVE" &&
                                        <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                            <Controller
                                                render={({
                                                    field: { ref, onChange, value, ...field },
                                                    fieldState: { invalid, error },
                                                }) => (
                                                    <div style={{marginTop: 15}} >
                                                        <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="number" step={0.5} max={100} icon={<AiOutlinePercentage size={20} color='grey' />} color="blue-gray" label="Commission sur course" size="lg" error={invalid} />
                                                    </div>
                                                )}
                                                name={`travelCommissionForPlatformPercent`}
                                                control={control}
                                            />
                                            {errors?.travelCommissionForPlatformPercent && 
                                                <span className=" text-[10px] text-red-400 mt-1" >{errors?.travelCommissionForPlatformPercent.message}</span>
                                            }
                                        </div>
                                    }

                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                        <Controller
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <Select
                                                        styles={{
                                                            control: (baseStyles, state) => ({
                                                            ...baseStyles,
                                                                height: 44,
                                                                fontSize: 14,
                                                                fontWeight: "400",
                                                                color: "red"
                                                            }),
                                                        }}
                                                        placeholder="Véhicules utilisés"
                                                        isSearchable={true}
                                                        isMulti={true}
                                                        onChange={(val) => onChange(val.map((item) => { return item.value })) }
                                                        options={
                                                            [
                                                                {label: 'Avion', value: 'Avion'}, 
                                                                {label: 'Bateau', value: 'Bateau'}, 
                                                                {label: 'Moto', value: 'Moto'},
                                                                {label: 'Voiture', value: 'Voiture'},
                                                                {label: 'Mini bus', value: 'Mini bus'},
                                                                {label: 'Bus', value: 'Bus'},
                                                            ]
                                                        }
                                                    />
                                                    {error && 
                                                        <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="vehicleName"
                                            control={control}
                                        />
                                    </div>
                                    
                                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >

                                        <Controller
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <div className="flex flex-row items-center justify-between mt-[4px]">
                                                        <span className=" text-[14px] text-blue-gray-600" >Va vers le client</span>
                                                        <Switch checked={value} onChange={(e) => {onChange(e.target.checked)}} />
                                                    </div>
                                                    {error && 
                                                        <span class Name=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="comeToMe"
                                            control={control}
                                        />

                                        <div className="h-[50px] w-full flex items-center pl-4 " >
                                            <span className=" text-blue-gray-500 text-[14px] font-semibold " >Image d'illustration</span>
                                        </div>

                                        <div className=" flex flex-col flex-1 mt-[5px] items-start " >

                                            <div {...getRootProps({ className: 'dropzone overflow-hidden bg-blue-gray-200 w-[190px] h-[140px] mb-2 rounded-[5px] '})}>
                                                
                                                <input {...getInputProps()} />

                                                <div className=' flex-1 flex h-full text-[12px] justify-center items-center '>
                                                    
                                                    {!isDragActive && 

                                                        <>

                                                            { watchPhotoAdd ?

                                                                <div className="render_albums relative w-full h-full" >

                                                                    <img
                                                                        src={file}
                                                                        className="object-cover w-full h-full "
                                                                        // style={img}
                                                                        // Revoke data uri after image is loaded
                                                                        // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                                                    />

                                                                    <div className="transition-all gap-x-6 duration-500 items-center view-shadow px-2 absolute flex flex-row h-[55px] w-full bottom-0 bg-[rgba(9,28,43,0.6)] " >

                                                                        <button disabled={isLoading} onClick={() => {setValue('illustrationPic', null), setfile(null)}} className="full gap-x-1 flex flex-row justify-center items-center text-white " >
                                                                            <AiFillCloseCircle color="red" size={18} />
                                                                            Supprimer
                                                                        </button>

                                                                        <button disabled={isLoading} onClick={open} className="full gap-x-1 flex flex-row justify-center items-center text-white " >
                                                                            <AiFillEdit size={18}/>
                                                                            Modifier
                                                                        </button>

                                                                    </div>

                                                                </div>

                                                                :

                                                                <div className="flex flex-col relative text-center text-[9px] justify-center items-center gap-y-1" >
                                                                    
                                                                    {/* Cliquez ici pour ajouter une image du moyen de transport ! <br/>
                                                                    <em>(Only *.jpeg and *.png images will be accepted)</em> */}
                                                                    <button onClick={open} className=" bottom-0 absolute px-4 py-2 rounded-md mt-2 bg-white cursor-pointer" >Selectionner</button>
                                                                    <BsCardImage size={100} />

                                                                </div>

                                                            }

                                                        </>

                                                    }

                                                    {isDragActive && !isDragReject && "Drop it like it's hot!"}
                                                    {isDragReject && "File type not accepted, sorry!"}

                                                </div>

                                            </div>

                                            {errors?.illustrationPic &&
                                                <span className=" text-[10px] text-red-400 mt-1" >{errors.illustrationPic.message}</span>
                                            }

                                        </div>

                                    </div>

                                </div>

                            </div>

                            
                            {watchformulaApplied !== "AVION" && 
                                <>

                                    {/* Classe */}
                                    {watchtypeTransportMoyen !== "PRIVATEDRIVE" &&
                                        <div className=" w-full md:w-[100%] min-h-[300px] rounded-lg bg-[#fff] shadow-sm " >
                                            
                                            <div className="h-[50px] w-full flex items-center mt-2 pl-4 justify-between " >
                                                <span className=" text-blue-gray-500 text-[14px] font-semibold " >Classe(s)</span>
                                                <Button onClick={() => { 
                                                    appendClass(
                                                        {
                                                            idClass: uuidv4(),
                                                            className: `Classe ${fieldClass.length+1}`,
                                                            classDescription: `La classe ${fieldClass.length+1} ...`,
                                                            travelCommissionForPlatformPercent: 20, 
                                                            tarification: [
                                                                {
                                                                    day: [1,2,3,4,5,6,0],
                                                                    startTime: '06:00',
                                                                    endTime: '18:00',
                                                                    prixPriseEnCharge: 2.10,
                                                                    pricePerKilometer: 1.86
                                                                },
                                                                {
                                                                    day: [1,2,3,4,5,6,0],
                                                                    startTime: '18:01',
                                                                    endTime: '05:59',
                                                                    prixPriseEnCharge: 2.10,
                                                                    pricePerKilometer: 2.79
                                                                },
                                                                {
                                                                    day: ["ferier"],
                                                                    startTime: '06:00',
                                                                    endTime: '18:00',
                                                                    prixPriseEnCharge: 2.10,
                                                                    pricePerKilometer: 2.86
                                                                },
                                                                {
                                                                    day: ["ferier"],
                                                                    startTime: '18:01',
                                                                    endTime: '05:59',
                                                                    prixPriseEnCharge: 2.10,
                                                                    pricePerKilometer: 3.89
                                                                }
                                                            ]
                                                        }
                                                    )
                                                }} 
                                                className='self-center h-[38px] bg-green-500 hover:shadow-none mr-[8px] ' >
                                                    <span>Ajouter</span>
                                                </Button>  
                                            </div>

                                            <div className= " flex flex-1 mx-3 flex-wrap gap-y-12 py-3 md:justify-between justify-center " >

                                                {fieldClass.map((field, index) => (

                                                    <fieldset key={field.id} className={" px-4 py-2 md:w-[48%] w-[100%] rounded-md outline outline-[1px] outline-blue-gray-100 flex flex-col " }>
                                                                                                
                                                        <legend className="text-[12px] pt-2 bg-white font-bold justify-between" >
                                                            Classe {index+1}
                                                            <button 
                                                                onClick={() => { 
                                                                    fieldClass.length > 1 ? 
                                                                        removeClass(index) 
                                                                    :  
                                                                        toast.error('Vous devez ajouter au moins une classe', {
                                                                            position: "top-right",
                                                                            autoClose: 2000,
                                                                            hideProgressBar: true,
                                                                            closeOnClick: true,
                                                                            pauseOnHover: false,
                                                                            draggable: false,
                                                                            progress: undefined,
                                                                            theme: "colored",
                                                                        });
                                                                }} 
                                                                className='w-[20px] h-[20px] rounded-full justify-center items-center ml-1 bg-red-400 text-[#fff] ' 
                                                            >
                                                                x
                                                            </button>
                                                        </legend>

                                                        <>
                                                            <Controller
                                                                render={({
                                                                    field: { ref, onChange, value, ...field },
                                                                    fieldState: { invalid, error },
                                                                }) => (
                                                                    <div style={{marginTop: 15}} >
                                                                        <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="text" color="blue-gray" label="Nom de la classe" size="lg" error={invalid} />
                                                                    </div>
                                                                )}
                                                                name={`class[${index}].className`}
                                                                control={control}
                                                            />
                                                            {errors?.class?.[index]?.className && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.className.message}</span>
                                                            }
                                                        </>

                                                        <>
                                                            <Controller
                                                                render={({
                                                                    field: { ref, onChange, value, ...field },
                                                                    fieldState: { invalid, error },
                                                                }) => (
                                                                    <div style={{marginTop: 15}} >
                                                                        <Textarea onChange={onChange} className=" w-full " value={value} type="text" color="blue-gray" label="Description de la classe" size="lg" error={invalid} />
                                                                    </div>
                                                                )}
                                                                name={`class[${index}].classDescription`}
                                                                control={control}
                                                            />
                                                            {errors?.class?.[index]?.classDescription && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.classDescription.message}</span>
                                                            }
                                                        </>

                                                        <>
                                                            <Controller
                                                                render={({
                                                                    field: { ref, onChange, value, ...field },
                                                                    fieldState: { invalid, error },
                                                                }) => (
                                                                    <div style={{marginTop: 15}} >
                                                                        <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="number" step={0.5} max={100} icon={<AiOutlinePercentage size={20} color='grey' />} color="blue-gray" label="Commission sur course" size="lg" error={invalid} />
                                                                    </div>
                                                                )}
                                                                name={`class[${index}].travelCommissionForPlatformPercent`}
                                                                control={control}
                                                            />
                                                            {errors?.class?.[index]?.travelCommissionForPlatformPercent && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.travelCommissionForPlatformPercent.message}</span>
                                                            }
                                                        </>

                                                        {["PER_KILOMETER", "PER_KILOMETER_PER_TIME"].includes(watchformulaApplied) &&
                                                            <>

                                                                {watchformulaApplied === "PER_KILOMETER_PER_TIME" &&
                                                                    <>
                                                                        <Controller
                                                                            render={({
                                                                                field: { ref, onChange, value, ...field },
                                                                                fieldState: { invalid, error },
                                                                            }) => (
                                                                                <div className=" w-[100%] " style={{ marginTop: 10}} >
                                                                                    <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="number" step={0.5} max={100} icon={<AiFillEuroCircle size={20} color='grey' />} color="blue-gray" label="Coût par minute" size="lg" error={invalid} />
                                                                                </div>
                                                                            )}
                                                                            name={`class[${index}].pricePerMinute`}
                                                                            control={control}
                                                                        />
                                                                        {errors?.class?.[index]?.pricePerMinute && 
                                                                            <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.pricePerMinute.message}</span>
                                                                        }

                                                                    </>
                                                                }

                                                                <>
                                                                    <Controller
                                                                        render={({
                                                                            field: { ref, onChange, value, ...field },
                                                                            fieldState: { invalid, error },
                                                                        }) => (
                                                                            <div className=" w-[100%] " style={{ marginTop: 10}} >
                                                                                <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="number" step={0.5} max={100} icon={<AiFillEuroCircle size={20} color='grey' />} color="blue-gray" label="Coût prise en charge moins de 3km" size="lg" error={invalid} />
                                                                            </div>
                                                                        )}
                                                                        name={`class[${index}].prixPriseEnChargeUnder3K`}
                                                                        control={control}
                                                                    />
                                                                    {errors?.class?.[index]?.prixPriseEnChargeUnder3K && 
                                                                        <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.prixPriseEnChargeUnder3K.message}</span>
                                                                    }

                                                                </>

                                                                <>
                                                                    <Controller
                                                                        render={({
                                                                            field: { ref, onChange, value, ...field },
                                                                            fieldState: { invalid, error },
                                                                        }) => (
                                                                            <div className=" w-[100%] " style={{marginBottom: 15, marginTop: 10}} >
                                                                                <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="number" step={0.5} max={100} icon={<AiFillEuroCircle size={20} color='grey' />} color="blue-gray" label="Forfait unique moins de 3km" size="lg" error={invalid} />
                                                                            </div>
                                                                        )}
                                                                        name={`class[${index}].uniqTarifUnder3K`}
                                                                        control={control}
                                                                    />
                                                                    {errors?.class?.[index]?.uniqTarifUnder3K && 
                                                                        <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.uniqTarifUnder3K.message}</span>
                                                                    }
                                                                </>
                                                                                                            
                                                                {errors?.class?.[index]?.tarification && 
                                                                    <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.tarification.message}</span>
                                                                }
                                                                <NestedTarification nestIndex={index} control={control} /> 

                                                            </>
                                                        }

                                                        
                                                        {watchformulaApplied === "PER_DAY" &&
                                                            <>
                                                                <Controller
                                                                    render={({
                                                                        field: { ref, onChange, value, ...field },
                                                                        fieldState: { invalid, error },
                                                                    }) => (
                                                                        <div className=" w-[100%] " style={{ marginTop: 10}} >
                                                                            <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="number" step={0.5} max={100} icon={<AiFillEuroCircle size={20} color='grey' />} color="blue-gray" label="Coût par jour" size="lg" error={invalid} />
                                                                        </div>
                                                                    )}
                                                                    name={`class[${index}].prixParJour`}
                                                                    control={control}
                                                                />
                                                                {errors?.class?.[index]?.prixParJour && 
                                                                    <span className=" text-[10px] text-red-400 mt-1" >{errors?.class?.[index]?.prixParJour.message}</span>
                                                                }

                                                            </>
                                                        }

                                                    </fieldset>

                                                ))}

                                            </div>

                                        </div>
                                    }


                                    {/* pièce driver */}
                                    <div className=" w-full min-h-[300px] rounded-lg bg-[#fff] shadow-sm " >
                                        
                                        <div className="h-[50px] w-full flex items-center mt-2 pl-4 justify-between " >
                                            <span className=" text-blue-gray-500 text-[14px] font-semibold " >Pièce(s) pour l'inscription d'un conducteur</span>
                                            <Button onClick={() => { 
                                                appendDriverRegister(
                                                    {
                                                        title: `Pièce ${fieldDriverRegister.length+1}`,
                                                        extension: []
                                                    }
                                                )
                                            }} 
                                            className='self-center h-[38px] bg-green-500 hover:shadow-none mr-[8px] ' >
                                                <span>Ajouter</span>
                                            </Button>  
                                        </div>

                                        <div className= " flex flex-1 mx-3 flex-wrap gap-y-12 py-3 md:justify-between justify-center " >

                                            {fieldDriverRegister.map((field, index) => (

                                                <fieldset key={field.id} className={" px-4 py-2 md:w-[48%] w-[100%] rounded-md outline outline-[1px] outline-blue-gray-100 flex flex-col " }>
                                                                                            
                                                    <legend className="text-[12px] pt-2 bg-white font-bold justify-between" >
                                                        Pièce {index+1}
                                                        <button 
                                                            onClick={() => { 
                                                                removeDriverRegister(index) 
                                                            }} 
                                                            className='w-[20px] h-[20px] rounded-full justify-center items-center ml-1 bg-red-400 text-[#fff] ' 
                                                        >
                                                            x
                                                        </button>
                                                    </legend>

                                                    <>
                                                        <Controller
                                                            render={({
                                                                field: { ref, onChange, value, ...field },
                                                                fieldState: { invalid, error },
                                                            }) => (
                                                                <div style={{marginTop: 15}} >
                                                                    <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="text" color="blue-gray" label="Nom de la pièce (Ex de pièce: carte d'identité)" size="lg" error={invalid} />
                                                                </div>
                                                            )}
                                                            name={`attachmentDriverRegister[${index}].title`}
                                                            control={control}
                                                        />
                                                        {errors?.attachmentDriverRegister?.[index]?.title && 
                                                            <span className=" text-[10px] text-red-400 mt-1" >{errors?.attachmentDriverRegister?.[index]?.title.message}</span>
                                                        }
                                                    </>

                                                    <>
                                                        <Controller
                                                            render={({
                                                                field: { onChange, value },
                                                                fieldState: { invalid, error}
                                                            }) => (
                                                                <div style={{marginTop: 15}} >
                                                                    <Select
                                                                        styles={{
                                                                            control: (baseStyles, state) => ({
                                                                            ...baseStyles,
                                                                                height: 44,
                                                                                fontSize: 14,
                                                                                fontWeight: "400",
                                                                                color: "red"
                                                                            }),
                                                                        }}
                                                                        placeholder="extension de la pièce"
                                                                        isSearchable={false}
                                                                        isMulti={true}
                                                                        defaultValue={ 
                                                                            value.map((item) => { return { label: item, value: item} })
                                                                        }
                                                                        onChange={(val) => onChange(val.map((item) => { return item.value })) }
                                                                        options={
                                                                            [{label: 'jpg', value: 'jpg'}, {label: 'jpeg', value: 'jpeg'}, {label: 'png', value: 'png'}, {label: 'pdf', value: 'pdf'} ]
                                                                        } 
                                                                    />
                                                                    {error && 
                                                                        <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                                    }
                                                                </div>
                                                            )}
                                                            name={`attachmentDriverRegister[${index}].extension`}
                                                            control={control}
                                                        />
                                                        {errors?.attachmentDriverRegister?.[index]?.extension && 
                                                            <span className=" text-[10px] text-red-400 mt-1" >{errors?.attachmentDriverRegister?.[index]?.extension.message}</span>
                                                        }
                                                    </>

                                                </fieldset>

                                            ))}

                                        </div>


                                    </div>


                                    {/* vehicule  */}
                                    {watchtypeTransportMoyen !== "PRIVATEDRIVE" &&
                                        <div className="w-full min-h-[300px] rounded-lg bg-[#fff] shadow-sm " >
                                            
                                            <div className="h-[50px] w-full flex items-center mt-2 pl-4 justify-between " >
                                                <span className=" text-blue-gray-500 text-[14px] font-semibold " >Pièce(s) et champ(s) pour l'ajout d'un véhicule</span>
                                            </div>

                                            <div className=" flex flex-1 mt-3 justify-between flex-wrap " >

                                                <div className=" w-full md:w-[49%] min-h-[300px] rounded-lg bg-[#fff] shadow-sm " >
                                                
                                                    <div className="h-[50px] w-full flex items-center mt-2 pl-4 justify-between " >
                                                        <span className=" text-blue-gray-500 text-[14px] font-semibold " >Pièce(s) pour l'ajout d'un véhicule</span>
                                                        <Button onClick={() => { 
                                                            appendVehiculeRegister(
                                                                {
                                                                    title: `Pièce ${fieldVehiculeRegisterattachement.length+1}`,
                                                                    extension: []
                                                                }
                                                            )
                                                        }} 
                                                        className='self-center h-[38px] bg-green-500 hover:shadow-none mr-[8px] ' >
                                                            <span>Ajouter</span>
                                                        </Button>  
                                                    </div>

                                                    {fieldVehiculeRegisterattachement.map((field, index) => (

                                                        <fieldset key={field.id} className={"mx-3 px-4 py-2 rounded-md outline outline-[1px] outline-blue-gray-100 flex flex-col "+ ( index > 0 ? "mt-[30px] mb-2" : "mt-2 mb-2" ) }>
                                                                                                    
                                                            <legend className="text-[12px] pt-2 bg-white font-bold justify-between" >
                                                                Pièce {index+1}
                                                                <button 
                                                                    onClick={() => { 
                                                                        removeVehiculeRegister(index) 
                                                                    }} 
                                                                    className='w-[20px] h-[20px] rounded-full justify-center items-center ml-1 bg-red-400 text-[#fff] ' 
                                                                >
                                                                    x
                                                                </button>
                                                            </legend>

                                                            <>
                                                                <Controller
                                                                    render={({
                                                                        field: { ref, onChange, value, ...field },
                                                                        fieldState: { invalid, error },
                                                                    }) => (
                                                                        <div style={{marginTop: 15}} >
                                                                            <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="text" color="blue-gray" label="Nom de la pièce (Ex de pièce: carte grise)" size="lg" error={invalid} />
                                                                        </div>
                                                                    )}
                                                                    name={`attachmentVehiculeRegister[${index}].title`}
                                                                    control={control}
                                                                />
                                                                {errors?.attachmentVehiculeRegister?.[index]?.title && 
                                                                    <span className=" text-[10px] text-red-400 mt-1" >{errors?.attachmentVehiculeRegister?.[index]?.title.message}</span>
                                                                }
                                                            </>

                                                            <>
                                                                <Controller
                                                                    render={({
                                                                        field: { onChange, value },
                                                                        fieldState: { invalid, error}
                                                                    }) => (
                                                                        <div style={{marginTop: 15}} >
                                                                            <Select
                                                                                styles={{
                                                                                    control: (baseStyles, state) => ({
                                                                                    ...baseStyles,
                                                                                        height: 44,
                                                                                        fontSize: 14,
                                                                                        fontWeight: "400",
                                                                                        color: "red"
                                                                                    }),
                                                                                }}
                                                                                placeholder="extension de la pièce"
                                                                                isSearchable={false}
                                                                                isMulti={true}
                                                                                // defaultValue={ 
                                                                                //     value.map((item) => { return { label: item, value: item} })
                                                                                // }
                                                                                onChange={(val) => onChange(val.map((item) => { return item.value })) }
                                                                                options={
                                                                                    [{label: 'jpg', value: 'jpg'}, {label: 'jpeg', value: 'jpeg'}, {label: 'png', value: 'png'}, {label: 'pdf', value: 'pdf'} ]
                                                                                } 
                                                                            />
                                                                            {error && 
                                                                                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    name={`attachmentVehiculeRegister[${index}].extension`}
                                                                    control={control}
                                                                />
                                                                {errors?.attachmentVehiculeRegister?.[index]?.extension && 
                                                                    <span className=" text-[10px] text-red-400 mt-1" >{errors?.attachmentVehiculeRegister?.[index]?.extension.message}</span>
                                                                }
                                                            </>

                                                        </fieldset>

                                                    ))}


                                                </div>

                                                <div className=" w-full md:w-[49%] min-h-[300px] rounded-lg bg-[#fff] shadow-sm " >
                                                
                                                    <div className="h-[50px] w-full flex items-center mt-2 pl-4 justify-between " >
                                                        <span className=" text-blue-gray-500 text-[14px] font-semibold " >Champs pour l'ajout d'un véhicule</span>
                                                        <Button onClick={() => { 
                                                            appendChampsVehiculeRegister(
                                                                {
                                                                    titleField: "",
                                                                    typeField: ""
                                                                }
                                                            )
                                                        }} 
                                                        className='self-center h-[38px] bg-green-500 hover:shadow-none mr-[8px] ' >
                                                            <span>Ajouter</span>
                                                        </Button>  
                                                    </div>

                                                    {champsVehiculeRegister.map((field, index) => (

                                                        <fieldset key={field.id} className={"mx-3 px-4 py-2 rounded-md outline outline-[1px] outline-blue-gray-100 flex flex-col "+ ( index > 0 ? "mt-[30px] mb-2" : "mt-2 mb-2" ) }>
                                                                                                    
                                                            <legend className="text-[12px] pt-2 bg-white font-bold justify-between" >
                                                                Champs {index+1}
                                                                <button 
                                                                    onClick={() => { 
                                                                        removeChampsVehiculeRegister(index) 
                                                                    }} 
                                                                    className='w-[20px] h-[20px] rounded-full justify-center items-center ml-1 bg-red-400 text-[#fff] ' 
                                                                >
                                                                    x
                                                                </button>
                                                            </legend>

                                                            <>
                                                                <Controller
                                                                    render={({
                                                                        field: { ref, onChange, value, ...field },
                                                                        fieldState: { invalid, error },
                                                                    }) => (
                                                                        <div style={{marginTop: 15}} >
                                                                            <Input onChange={onChange} className=" h-[40px] w-full " value={value} type="text" color="blue-gray" label="Nom du champs (Ex: vehicule marque)" size="lg" error={invalid} />
                                                                        </div>
                                                                    )}
                                                                    name={`fieldVehiculeRegister[${index}].titleField`}
                                                                    control={control}
                                                                />
                                                                {errors?.fieldVehiculeRegister?.[index]?.titleField && 
                                                                    <span className=" text-[10px] text-red-400 mt-1" >{errors?.fieldVehiculeRegister?.[index]?.titleField.message}</span>
                                                                }
                                                            </>

                                                            <>
                                                                <Controller
                                                                    render={({
                                                                        field: { onChange, value },
                                                                        fieldState: { invalid, error}
                                                                    }) => (
                                                                        <div style={{marginTop: 15}} >
                                                                            <Select
                                                                                styles={{
                                                                                    control: (baseStyles, state) => ({
                                                                                    ...baseStyles,
                                                                                        height: 44,
                                                                                        fontSize: 14,
                                                                                        fontWeight: "400",
                                                                                        color: "red"
                                                                                    }),
                                                                                }}
                                                                                placeholder="type de champs"
                                                                                isSearchable={false}
                                                                                onChange={(val) => onChange(val.value) }
                                                                                options={
                                                                                    [{label: 'text', value: 'text'}, {label: 'image', value: 'image'} ]
                                                                                } 
                                                                            />
                                                                            {error && 
                                                                                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                                            }
                                                                        </div>
                                                                    )}
                                                                    name={`fieldVehiculeRegister[${index}].typeField`}
                                                                    control={control}
                                                                />

                                                            </>

                                                        </fieldset>

                                                    ))}


                                                </div>


                                            </div>

                                        </div>
                                    }

                                </>
                            }

                        </div>

                    </CardBody>
                    
    

                </Card>

            </div>
        </RenderIf>

    );
}

export default TransportMoyenCreate;
