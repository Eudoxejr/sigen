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
import { RenderIf } from "@/components/common";
import { Permissions } from "@/data/role-access-data";


const AddClassToTransportMoyen = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [_, dispatch] = useDialogController(); 
    const { state } = useLocation();

    const params = state?.moyen?.data

    const schema = yup.object({
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
        ).min(1, "Entrez au moins une class")
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
            ]
        }
    });

    const { fields:fieldClass, append:appendClass, remove:removeClass } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "class", // unique name for your Field Array
    });

    const watchformulaApplied = watch("formulaApplied", params?.formulaApplied);
    const watchtypeTransportMoyen = watch("typeTransportMoyen", params?.typeTransportMoyen);

    const getModes = async (inputValue) => {
        const res = await TransportModeApi.getTransportMode(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.title, value: data.idTransportMode } })
    };


    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
            // return MoyenApi.createMoyen(data)
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

        <RenderIf allowedTo={Permissions.ADD_CLASS}>

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
                                Ajouter des classes
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
                                <span>Ajouter</span>
                            }

                        </Button>

                    </CardHeader>

                    <CardBody className="flex flex-1 pt-2 flex-col overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">

                        <div className="flex flex-row justify-between flex-wrap gap-y-6 gap-x-[1%]" >
 
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
                                                    <span>Plus</span>
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

                                </>
                            }

                        </div>

                    </CardBody>
                    
    

                </Card>

            </div>
        </RenderIf>

    );
}

export default AddClassToTransportMoyen;
