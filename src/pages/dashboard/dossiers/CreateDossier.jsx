
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

import NextedParty2 from '@/components/common/nextedParty2';
import NextedInformation from '@/components/common/nextedInformation';
import NextedInformationDone from '@/components/common/nestedInformationDone'
import { uploadFile } from '@/utils/uploadS3';
import { v4 as uuidv4 } from 'uuid';

import { useDialogueStore } from '@/store/dialogue.store';

// import { RenderIf } from "@/components/common";
// import { Permissions } from "@/data/role-access-data";


const DossierCreate = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setBackdrop } = useDialogueStore()


    const schema = yup.object({

        clientId: yup.string().trim("Sélectionner le client svp").required("Sélectionner le client svp"),
        categoryId: yup.string().trim("Sélectionner une catégorie svp").required("Sélectionner une catégorie svp"),
        managerId: yup.string().trim("Sélectionner un titulaire svp").required("Sélectionner un titulaire svp"),
        subManagerId: yup.string(),

        subCategories: yup.array().of(
            yup.object({
                is_minutier: yup.boolean().required(),
                sub_category_name: yup.string().trim().required("Le nom de la sous-catégorie est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                is_multi_parts: yup.boolean().required(),
                party_involved_are_customer: yup.boolean().required(),
                you_know_number_of_part: yup.boolean().required(),
                partyInvolved: yup.array().when(['is_multi_parts', 'you_know_number_of_part'], {
                    is: (is_multi_parts, you_know_number_of_part) => is_multi_parts && you_know_number_of_part,
                    then: () => yup.array().of(
                      yup.object().shape({
                        party_title: yup.string().trim().required("Le titre de la partie est requis").max(250, "Ne doit pas dépasser 250 caractères"),
                        sub_category_id: yup.string().required(),
                        informationDone: yup.array().of(
                            yup.object().shape({
                                // informationRequestedId: yup.string().required("Entrez cette information svp"),
                                key: yup.string().required("Entrez cette information svp"),
                                value: yup.string().required("Entrez cette information svp")
                            })
                        )
                      })
                    ).min(1, "Au moins une partie impliquée est requise")
                    .test('is-unique-party-title', 'Les noms des partie doivent être unique', function (value) {
                        const party_titles = value.map(partyInvolved => partyInvolved.party_title);
                        const uniqueparty_title = new Set(party_titles);
                        return party_titles.length === uniqueparty_title.size;
                    }),
                    otherwise: () => yup.array().test('is-unique-party-title', 'Les noms des partie doivent être unique', function (value) {
                        const party_titles = value.map(partyInvolved => partyInvolved.party_title);
                        const uniqueparty_title = new Set(party_titles);
                        return party_titles.length === uniqueparty_title.size;
                    })
                }),
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


    const {control, setValue, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            subCategories: [
            ]
        }
    });

    const { fields:fieldSubCategory, append:appendSubCategory, remove:removeSubCategory } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "subCategories", // unique name for your Field Array
    });


    const watchSubCategories = useWatch({
        control: control,
        name: "subCategories"
    })


    const getCient = async (inputValue) => {
        const res = await ClientApi.getClient(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.firstname+' '+data.lastname, value: data.id } })
    };
    const loadOptionsClient = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCient(inputValue))
        }
    );


    const onCategorieChange = (value) => {

        // setValue('subCategories', val.other.subCategories, {shouldDirty: true})
        const newValue = value.map((val) => { 
            return {
                ...val,
                ...!val?.is_multi_parts ? {informationDone: val.informationRequested.map((informationRequestedItem) => {
                    return {
                        informationRequestedId: informationRequestedItem?.id,
                        key: informationRequestedItem?.question,
                        value: ''
                    }
                }) } : null ,
                ...val?.is_multi_parts ? {partyInvolved: val?.partyInvolved.map((val2) => {
                    return { 
                        ...val2, 
                        "informationDone": val?.party_involved_are_customer ? 
                            [{ key: val2?.party_title, value: ''}]
                        : val.informationRequested.map((informationRequestedItem) => {
                            return {
                                informationRequestedId: informationRequestedItem?.id,
                                key: informationRequestedItem?.question,
                                value: ''
                            }
                        })
                    }
                }) } : null ,
            }
        })

        setValue('subCategories', newValue, {shouldDirty: true})

    }



    const getCat = async (inputValue) => {
        const res = await CategoriesApi.getCategories(1, 8, inputValue)
        return res.data.map((data) => { return { label: data.category_name, value: data.id, other: data } })
    };
    const loadOptionsCategorie = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCat(inputValue))
        }
    );



    const getCol = async (inputValue) => {
        const res = await CollaboApi.getCollabo(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.firstname+' '+data.lastname, value: data.id, other: data } })
    };
    const loadOptionsCol = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCol(inputValue))
        }
    );



    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
            return FoldersApi.createFolders(data)
        },
        gcTime:0,
        onSuccess: (response) => {

            console.log(response);

            navigate(-1)
            toast.success('Catégories créé avec succès', {
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

            setBackdrop({active: false})

        },
        onError: ({response}) => {
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
            setBackdrop({active: false})
        }

    })


    const handleClick = async (data) => {
        console.log(data);
        setBackdrop({active: true})
        mutate(data)
    };


    return (

        // <RenderIf allowedTo={Permissions.ADD_TRANSPORT_MEAN}>

            <div className="mt-12 mb-2 flex-1 w-full flex flex-col">

                <Card className=" min-h-[calc(100vh-150px)] shadow-none bg-transparent " >

                    <CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-primary flex flex-row items-center justify-between ">

                        <div className='flex items-center' >
                            <Tooltip content="Retour">
                                <button onClick={() => navigate(-1)} className=" bg-white w-[30px] h-[30px] mr-3 rounded-full flex justify-center items-center" >
                                    <AiOutlineArrowLeft className=' text-primary ' size={16} />
                                </button>
                            </Tooltip>

                            <Typography variant="h6" className=" text-white text-[15px] " color="blue-gray" >
                                Créer un dossier
                            </Typography>
                        </div>

                    </CardHeader>

                    <CardBody className="flex flex-1 flex-col overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">

                        <div className="flex flex-row justify-between flex-wrap gap-y-8 gap-x-[1%]" >

                            <div className=" w-full md:w-[100%] min-h-[200px] border-[0.5px] pb-6 rounded-lg bg-[#fff] shadow-sm " >
                                
                                <div className="h-[50px] w-full flex items-center pl-4 " >
                                    <span className=" text-blue-gray-500 text-[16px] font-semibold " >Informations Pincipales</span>
                                    <span className ></span>
                                </div>

                                <div className=" w-full flex gap-y-[15px] gap-x-[5%] flex-col justify-center md:flex-row flex-wrap " >

                                    <div className=" w-[full] md:w-[45%] order-1 " >

                                        <div className=" w-full flex flex-col flex-wrap gap-y-2 mt-1 justify-center " >

                                            <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >Le client</span>
                                            <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                                <Controller
                                                    render={({
                                                    field: { onChange, value, ref},
                                                    fieldState: { invalid, error}
                                                    }) => (
                                                        <>
                                                            <AsyncSelect 
                                                                cacheOptions 
                                                                ref={ref}
                                                                defaultOptions 
                                                                loadOptions={loadOptionsClient} 
                                                                styles={{
                                                                    control: (baseStyles, state) => ({
                                                                    ...baseStyles,
                                                                        height: 45,
                                                                        fontSize: 13,
                                                                        fontWeight: "400",
                                                                        color: "red",
                                                                    }),
                                                                }}
                                                                placeholder="Client"
                                                                onChange={(val) => onChange(val.value) }
                                                            />
                                                            {error && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="clientId"
                                                    control={control}
                                                />
                                            </div>

                                        </div>

                                        
                                        <div className=" w-full flex flex-col flex-wrap gap-y-2 mt-5 justify-center " >

                                            <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >La catégorie du dossier</span>
                                            <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                                <Controller
                                                    render={({
                                                    field: { onChange, value, ref},
                                                    fieldState: { invalid, error}
                                                    }) => (
                                                        <>
                                                            <AsyncSelect 
                                                                cacheOptions 
                                                                ref={ref}
                                                                defaultOptions 
                                                                loadOptions={loadOptionsCategorie} 
                                                                styles={{
                                                                    control: (baseStyles, state) => ({
                                                                    ...baseStyles,
                                                                        height: 45,
                                                                        fontSize: 13,
                                                                        fontWeight: "400",
                                                                        color: "red"
                                                                    }),
                                                                }}
                                                                placeholder="catégorie du dossier"
                                                                onChange={(val) => {onChange(val.value), onCategorieChange(val.other.subCategories) }}
                                                            />
                                                            {error && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="categoryId"
                                                    control={control}
                                                />
                                            </div>

                                        </div>

                                    </div>

                                    <div className=" w-[full] md:w-[45%] order-2 flex flex-col justify-center items-center " >
                                        
                                        <div className=" w-full flex flex-col flex-wrap gap-y-2 mt-1 justify-center " >

                                            <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >Le collaborateur titulaire</span>
                                            <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                                <Controller
                                                    render={({
                                                    field: { onChange, value, ref},
                                                    fieldState: { invalid, error}
                                                    }) => (
                                                        <>
                                                            <AsyncSelect 
                                                                cacheOptions 
                                                                ref={ref}
                                                                defaultOptions 
                                                                loadOptions={loadOptionsCol} 
                                                                styles={{
                                                                    control: (baseStyles, state) => ({
                                                                    ...baseStyles,
                                                                        height: 45,
                                                                        fontSize: 13,
                                                                        fontWeight: "400",
                                                                        color: "red"
                                                                    }),
                                                                }}
                                                                placeholder="collaborateur"
                                                                onChange={(val) => onChange(val.value)}
                                                            />
                                                            {error && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="managerId"
                                                    control={control}
                                                />
                                            </div>

                                        </div>

                                        
                                        <div className=" w-full flex flex-col flex-wrap gap-y-2 mt-5 justify-center " >

                                            <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >Le collaborateur suppléant</span>
                                            <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                                <Controller
                                                    render={({
                                                    field: { onChange, value, ref},
                                                    fieldState: { invalid, error}
                                                    }) => (
                                                        <>
                                                            <AsyncSelect 
                                                                cacheOptions 
                                                                ref={ref}
                                                                defaultOptions 
                                                                loadOptions={loadOptionsCol} 
                                                                styles={{
                                                                    control: (baseStyles, state) => ({
                                                                    ...baseStyles,
                                                                        height: 45,
                                                                        fontSize: 13,
                                                                        fontWeight: "400",
                                                                        color: "red"
                                                                    }),
                                                                }}
                                                                placeholder="collaborateur suppléant"
                                                                onChange={(val) => onChange(val.value)}
                                                            />
                                                            {error && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="subManagerId"
                                                    control={control}
                                                />
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            
                            {/* {
                                JSON.stringify(watchSubCategories)
                            } */}

  
                            <div className=" w-full md:w-[100%] min-h-[30px] border-[0.5px] py-2 rounded-lg bg-[#fff] shadow-sm " >
                                

                                <div className= " flex flex-1 mx-3 flex-wrap gap-y-12 py-5 justify-center " >

                                    {fieldSubCategory.map((field, index) => (

                                        <>

                                            {(field?.informationDone?.length > 0) &&

                                                <fieldset key={field.id} className={"py-2 md:w-[95%] w-[100%] gap-y-4 rounded-md outline outline-[1px]  outline-blue-gray-100 flex flex-col " }>
                                                                                            
                                                    <legend className="text-[14px] w-full rounded-t-md bg-primary py-4 text-white px-2 flex justify-start items-center gap-x-4 font-bold " >
                                                        {field.sub_category_name}
                                                    </legend>

                                                    <div className=" w-full gap-x-5 flex flex-1 flex-wrap mt-4 px-4 " >

                                                        <div className=" relative flex flex-1 flex-col " >

                                                            <div>
                                                                <NextedInformationDone nextIndex={index} control={control}/>
                                                                {errors?.subCategories?.[index]?.informationDone && <span className=" text-[11px] text-red-400 mt-1" >{errors?.subCategories?.[index]?.informationDone?.message}</span>}
                                                            </div>

                                                        </div>                                                

                                                    </div>

                                                </fieldset>

                                            }


                                            {(field?.is_multi_parts && field?.partyInvolved?.length > 0) &&

                                                <fieldset key={field.id} className={"py-2 md:w-[95%] w-[100%] gap-y-4 rounded-md outline outline-[1px]   outline-blue-gray-100 flex flex-col " }>

                                                    <legend className="text-[14px] w-full rounded-t-md bg-primary py-4 text-white px-2 flex justify-start items-center gap-x-4 font-bold " >
                                                        {field.sub_category_name}
                                                    </legend>

                                                    <div className=" w-full gap-x-5 flex flex-1 flex-wrap mt-4 px-4 " >

                                                        <div className=" relative flex flex-1 flex-col " >

                                                            <div>
                                                                <NextedParty2 isCustomer={field.party_involved_are_customer} nextIndex={index} control={control}/>
                                                                {errors?.subCategories?.[index]?.partyInvolved && <span className=" text-[11px] text-red-400 mt-1" >{errors?.subCategories?.[index]?.partyInvolved?.message}</span>}
                                                            </div>

                                                        </div>                                                

                                                    </div>

                                                </fieldset>

                                            }

                                        
                                        </>

                                    ))}

                                </div>

                                {errors?.subCategories && <span className=" text-[11px] text-red-400 mx-3 mt-3" >{errors?.subCategories?.message}</span>}

                            </div>

                        </div>

                        {JSON.stringify(errors)}

                        <Button
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

                        </Button>

                    </CardBody>
                    
    

                </Card>

            </div>

        // </RenderIf>

    );
}

export default DossierCreate;
