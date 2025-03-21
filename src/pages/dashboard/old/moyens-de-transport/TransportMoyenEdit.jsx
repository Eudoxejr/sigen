/* eslint-disable no-unused-expressions */
import React, {useState} from 'react';
import {produce} from "immer"
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
import { useNavigate, useLocation } from "react-router-dom";
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
import {useDropzone} from 'react-dropzone'
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { toast } from 'react-toastify';

import NestedTarification from '@/components/common/nextedParty';
import { uploadFile } from '@/utils/uploadS3';
import { useDialogController } from '@/context/dialogueProvider';
import { v4 as uuidv4 } from 'uuid';
import { RenderIf } from "@/components/common/render.if";
import { Permissions } from "@/data/role-access-data";


const TransportMoyenEdit = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { state } = useLocation();
    const [_, dispatch] = useDialogController(); 

    const params = state?.moyen?.data

    // console.log(state);


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
        illustrationPic: yup.mixed().required("L'Image d'illustration est requis"),
        illustrationValue: yup.string(),
        
    }).required();


    const {control, watch, setValue, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            idTransportMode: params?.transportModes?.map((item) => { return item?.transportModeId }),
            title: params?.title,
            transportMoyenDescription: params?.transportMoyenDescription,
            formulaApplied: params?.formulaApplied,
            onContact: params?.onContact,
            comeToMe: params?.comeToMe,
            typeTransportMoyen: params?.typeTransportMoyen,
            vehicleName: params?.vehicleName,
            travelCommissionForPlatformPercent: params?.travelCommissionForPlatformPercent,
            illustrationPic: params?.illustrationPic,
            illustrationValue: params?.illustrationPic
        }
    });

    const watchtypeTransportMoyen = watch("typeTransportMoyen", "");
    const watchPhotoAdd = watch("illustrationPic", params?.illustrationPic);


    const getModes = async (inputValue) => {
        const res = await TransportModeApi.getTransportMode(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.title, value: data.idTransportMode } })
    };

    const loadOptionsMode = (inputValue) => 
        new Promise((resolve) => {
            resolve(getModes(inputValue))
        }
    );

    const [file, setfile] = useState(params?.illustrationPic);
    
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
            setValue('illustrationValue', result[0]?.path)
            setValue('illustrationPic', result[0])
            setfile(URL.createObjectURL(result[0]))
        }

    })


    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
            return MoyenApi.putMoyen(data, params?.idTransportMoyen)
        },
        gcTime:0,
        onSuccess: (response) => {

            navigate(-1)
            toast.success('Moyen de transport modifié avec succès', {
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

                const indexUpdateMoyen = dataMoyen.data.findIndex((moyen) => moyen.idTransportMoyen == response?.data?.idTransportMoyen )
                const nextData = produce(dataMoyen, draftData => {
                    draftData.data[indexUpdateMoyen] = response?.data
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
                message: response.data.msg || "Une erreur s'est produite lors de la modification"
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

        // console.log(data);
        // console.log(params);

        dispatch({
            type: "SET_BACKDROP",
            value: true
        })

        if(data?.illustrationPic !== params?.illustrationPic )
        {

            await uploadFile(data.illustrationPic)
            .then((s3Link) => {
                // console.log(s3Link);
                data.illustrationPic = s3Link.Location
                mutate(data)    
            })
            .catch((err) => {

                // console.log(err);
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
        
        }
        else{
            mutate(data)
        }

    };


    return (

        <RenderIf allowedTo={Permissions.EDIT_TRANSPORT_MEAN}>

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
                                Modifier moyen de transport 
                            </Typography>
                        </div>

                        <Button
                            variant="gradient"
                            color="green"
                            onClick={handleSubmit(handleClick)}
                            disabled={(!isDirty || isLoading) ? true : false }
                        >

                            {isLoading ?
                                <BeatLoader color="#fff" size={8} />
                                :
                                <span>Modifier</span>
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
                                                        defaultValue={
                                                            params?.transportModes?.map((item) => { return { value: item?.transportModeId, label: item?.transportMode?.title }})
                                                        }
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
                                                        defaultValue={
                                                            {
                                                                label: params?.formulaApplied == "PER_KILOMETER" ? 'Par Kilomètre' 
                                                                    :params?.formulaApplied == "PER_DAY" ? 'Par Jour' 
                                                                    :params?.formulaApplied == "PER_KILOMETER_PER_TIME" ? 'Par Kilomètre & Temps' 
                                                                    :params?.formulaApplied == "PER_ROUTE" ? 'Par Trajet' 
                                                                    :params?.formulaApplied == "DEVIS" ? 'Sur Devis' 
                                                                    :params?.formulaApplied == "AVION" ? 'Entre Aéroport' : null, 
                                                                value: params?.formulaApplied
                                                            }
                                                        }
                                                        placeholder="Formule de calcul du prix de la course"
                                                        isSearchable={false}
                                                        isDisabled={true}
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
                                                        <Switch disabled={true} onChange={(e) => {onChange(e.target.checked)}} />
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
                                                        isDisabled={true}
                                                        defaultValue={
                                                            {
                                                                label: params?.typeTransportMoyen == "DEFAULT" ? "normal" 
                                                                    :params?.typeTransportMoyen == "PMR" ? 'PMR' 
                                                                    :params?.typeTransportMoyen == "PRIVATEDRIVE" ? 'Chauffeur Privé' 
                                                                    :params?.typeTransportMoyen == "AVION" ? 'Avion' 
                                                                    :params?.typeTransportMoyen == "PIROGUE" ? 'Pirogue' : null, 
                                                                value: params?.typeTransportMoyen
                                                            }
                                                        }
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
                                                        isDisabled={true}
                                                        placeholder="Véhicules utilisés"
                                                        isSearchable={true}
                                                        isMulti={true}
                                                        defaultValue={
                                                            params?.vehicleName?.map((item) => { return { value: item, label: item }})
                                                        }
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
                                                        <Switch checked={value} disabled={true} onChange={(e) => {onChange(e.target.checked)}} />
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

                        </div>

                    </CardBody>

                </Card>

            </div>

        </RenderIf>

    );
}

export default TransportMoyenEdit;
