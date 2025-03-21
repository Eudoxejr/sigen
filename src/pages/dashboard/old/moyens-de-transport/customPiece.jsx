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
	Input
} from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
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

import { uploadFile } from '@/utils/uploadS3';
import { useDialogController } from '@/context/dialogueProvider';
import { RenderIf } from "@/components/common/render.if";
import { Permissions } from "@/data/role-access-data";


const CustomPiece = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [_, dispatch] = useDialogController(); 
    const { state } = useLocation();
    const params = state?.moyen?.data

    // console.log('====================================');
    // console.log(params?.fieldVehiculeRegister);
    // console.log('====================================');

    const schema = yup.object({

        attachmentDriverRegister: yup.array().nullable().of(
            yup.object({
                idAttachement: yup.string().trim().required().nullable(), 
                title: yup.string().trim().required(),
                extension: yup.array().of(
                    yup.string()
                ).min(1, "Entrez au moins une extension")
            })
        ),
        attachmentVehiculeRegister: yup.array().nullable().of(
            yup.object({
                idAttachement: yup.string().trim().required().nullable(), 
                title: yup.string().trim().required(),
                extension: yup.array().of(
                    yup.string()
                ).min(1, "Entrez au moins une extension")
            })
        ),
        fieldVehiculeRegister: yup.array().nullable().of(
            yup.object({
                idField: yup.string().trim().required().nullable(), 
                titleField: yup.string().trim().required(),
                typeField: yup.string().trim().required()
            })
        )
        
    }).required();

    const {control, watch, setValue, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            attachmentDriverRegister: params?.attachmentDriverRegister,
            attachmentVehiculeRegister: params?.attachmentVehiculeRegister,
            fieldVehiculeRegister: params?.fieldVehiculeRegister
        }
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
                                Modifier les pièces
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
  
                            {watchformulaApplied !== "AVION" && 
                                <>

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
                                                                                defaultValue={{
                                                                                    label: value, value: value
                                                                                }}
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

export default CustomPiece;
