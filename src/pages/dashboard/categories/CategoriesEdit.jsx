
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
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlinePercentage, AiFillEuroCircle } from "react-icons/ai";
import { BsCardImage } from "react-icons/bs";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Switch from '@mui/material/Switch';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesApi, CategorieGroupeApi } from "@/api/api";
import BeatLoader from "react-spinners/BeatLoader";
import { useDropzone } from 'react-dropzone'
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { RiForbidLine } from "react-icons/ri";
import { toast } from 'react-toastify';

import NextedParty from '@/components/common/nextedParty';
import NextedInformation from '@/components/common/nextedInformation';
import { uploadFile } from '@/utils/uploadS3';
import { v4 as uuidv4 } from 'uuid';

import { useDialogueStore } from '@/store/dialogue.store';
import { TwitterPicker } from 'react-color';

// import { RenderIf } from "@/components/common";
// import { Permissions } from "@/data/role-access-data";


const CategoriesEdit = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setBackdrop } = useDialogueStore()
    const {state} = useLocation();

    console.log(state);

    const schema = yup.object({

        categoryName: yup.string().trim().required("Le nom de la catégorie est requis").max(250, "Ne doit pas dépasser 250 caractères"),
        categoryColor: yup.string().trim().required("Sélectionner une couleur de dossier").max(120, "Ne doit pas dépasser 120 caractères"),
        categorySlug: yup.string().trim().required("Ajouter un slug").max(6, "Ne doit pas dépasser 6 caractères"),
        categoryDescription: yup.string().trim().nullable(),
        categorieGroupId: yup.string().trim().required("Sélectionner un groupe de catégorie"),
        // subCategories: yup.array().of(
        //     yup.object({
        //         subCategoryName: yup.string().trim().required("Le nom de la sous-catégorie est requis").max(250, "Ne doit pas dépasser 250 caractères"),
        //         subCategoryDescription: yup.string().trim(),
        //         informationRequested: yup.array().of(
        //             yup.object({
        //                 question: yup.string().trim().required("L'information est requise").max(250, "Ne doit pas dépasser 250 caractères")
        //             })
        //         ).test('is-unique-question', 'Vous demandez la même information plusieurs fois', function (value) {
        //             const questions = value?.map(informationRequested => informationRequested.question);
        //             const uniquepartyquestions = new Set(questions);
        //             // console.log(questions?.length === uniquepartyquestions.size);
        //             return questions?.length === uniquepartyquestions.size;
        //         })
        //     })
        // ).test('is-unique', 'Les noms des sous-catégorie doivent être unique', function (value) {
        //     const subCategoryNames = value.map(subCat => subCat.subCategoryName);
        //     const uniqueSubCategoryNames = new Set(subCategoryNames);
        //     return subCategoryNames.length === uniqueSubCategoryNames.size;
        // })
        
    }).required();


    const {control, setValue, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categoryColor: state.category_color,
            categoryName: state.category_name,
            categorySlug: state.category_slug,
            categoryDescription: state.category_description,
            categorieGroupId: state.categorie_group_id
        }
    });


    const getGroup = async (inputValue) => {
        const res = await CategorieGroupeApi.getCategorieGroups(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.group_name, value: data.id } })
    };

    const loadOptionsGroupCategorie = (inputValue) => 
        new Promise((resolve) => {
            resolve(getGroup(inputValue))
        }
    );


    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
            return CategoriesApi.updateCategorie(data, state.id)
        },
        gcTime:0,
        onSuccess: (response) => {

            navigate(-1)
            toast.success('Catégorie modifiée avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            // queryClient.invalidateQueries(["getAllCategories"]) 

            queryClient.setQueriesData(["getAllCategories"], (dataCat) => {
                const indexUpdateCategorie = dataCat.data.findIndex((categorie) => categorie.id== response?.data?.id )
                if(indexUpdateCategorie >= 0)
                {
                    const nextData = produce(dataCat, draftData => {
                        draftData.data[indexUpdateCategorie] = response?.data
                    })
                    return nextData;
                }
            })

            setBackdrop({active: false})

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
            setBackdrop({active: false})
        }

    })


    const handleClick = async (data) => {
        setBackdrop({active: true})
        mutate(data)
    };


    return (

        // <RenderIf allowedTo={Permissions.ADD_TRANSPORT_MEAN}>

            <div className="mb-2 flex-1 w-full flex flex-col">

                <Card className=" min-h-[calc(100vh-150px)] shadow-none bg-transparent " >

                    <CardBody className="flex flex-1 flex-col overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">

                        <div className='flex items-center' >
                            <Tooltip content="Retour">
                                <button onClick={() => navigate(-1)} className=" bg-primary w-[35px] h-[35px] mr-3 rounded-full flex justify-center items-center" >
                                    <AiOutlineArrowLeft className=' text-white ' size={16} />
                                </button>
                            </Tooltip>
                            <Typography variant="h6" className=" text-blue-gray-700 text-[15px] " color="blue-gray" >
                                CREER UNE CATEGORIE
                            </Typography>
                        </div>

                        <div className="flex flex-row mt-5justify-between flex-wrap gap-y-5 mt-5 gap-x-[1%]" >

                            <div className=" w-full md:w-[100%] min-h-[280px] border-[0.5px] pb-6 rounded-lg bg-[#fff] shadow-sm " >
                                
                                <div className=" w-full flex gap-y-[15px] mt-3 flex-col justify-center md:flex-row flex-wrap " >

                                    <div className=" w-[full] md:w-[55%] order-1 " >

                                        <div className=" w-full flex flex-col flex-wrap gap-y-6 justify-center " >

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
                                                                defaultValue={{
                                                                    label: state.categoryGroup.group_name,
                                                                    value: state.categoryGroup.id
                                                                }}
                                                                defaultOptions 
                                                                loadOptions={loadOptionsGroupCategorie} 
                                                                styles={{
                                                                    control: (baseStyles, state) => ({
                                                                    ...baseStyles,
                                                                        height: 45,
                                                                        fontSize: 13,
                                                                        fontWeight: "400",
                                                                        color: "red"
                                                                    }),
                                                                }}
                                                                placeholder="Groupe de catégorie"
                                                                onChange={(val) => onChange(val.value)}
                                                            />
                                                            {error && 
                                                                <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="categorieGroupId"
                                                    control={control}
                                                />
                                            </div>

                                            <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                                <Controller
                                                    render={({
                                                        field: { onChange, value, ref },
                                                        fieldState: { invalid, error}
                                                    }) => (
                                                        <>
                                                            <Input ref={ref} onChange={onChange} className="h-[45px] w-full text-[13px] font-normal text-blue-gray-600" value={value} type="text" color="blue-gray" label="Nom de la catégorie" size="lg" error={invalid} />
                                                            {error && 
                                                                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="categoryName"
                                                    control={control}
                                                />
                                            </div>

                                            <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                                <Controller
                                                    render={({
                                                        field: { onChange, value, ref },
                                                        fieldState: { invalid, error}
                                                    }) => (
                                                        <>
                                                            <Input ref={ref} onChange={onChange} className="h-[45px] w-full uppercase text-[13px] font-normal text-blue-gray-600" value={value} type="text" color="blue-gray" label="Slug de la catégorie" size="lg" error={invalid} />
                                                            {error && 
                                                                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="categorySlug"
                                                    control={control}
                                                />
                                            </div>

                                        </div>

                                        <div className=" w-full flex flex-row flex-wrap mt-6 justify-center " >

                                            <div className=" w-[95%] min-w-[200px] mx-[2.5%] " >
                                                <Controller
                                                    render={({
                                                        field: { onChange, value, ref },
                                                        fieldState: { invalid, error}
                                                    }) => (
                                                        <>
                                                            <Textarea ref={ref} onChange={onChange} className="h-[45px] w-full text-[13px] font-normal text-blue-gray-600" value={value} type="text" color="blue-gray" label="Description de la catégorie" size="lg" error={invalid} />
                                                            {error && 
                                                                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                                            }
                                                        </>
                                                    )}
                                                    name="categoryDescription"
                                                    control={control}
                                                />
                                            </div>

                                        </div>

                                    </div>


                                    <div className=" w-[full] md:w-[40%] order-2 flex flex-col justify-center items-center " >
                                        
                                        <span className=" text-blue-gray-500 text-[13px] font-semibold mb-5 " >Choississez la couleurs des dossiers de cette catégorie</span>
                                        
                                        <Controller
                                            render={({
                                            field: { onChange, value },
                                            fieldState: { invalid, error}
                                            }) => (
                                                <>
                                                    <div className=" flex justify-center items-center px-5 w-[90%] sm:w-[62%] h-[50px] mb-3 border-[1px] border-gray-500 rounded-md " >
                                                        <div style={{ backgroundColor: value }} className={" w-full h-[40px] rounded-md "} />
                                                    </div>
                                                    <TwitterPicker
                                                        color={value} 
                                                        onChangeComplete={(color, event) => onChange(color.hex)} 
                                                        colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#795548", "#607d8b"]}
                                                    />
                                                    {error && 
                                                        <span className=" text-[10px] text-red-400 mt-3" >{error.message}</span>
                                                    }
                                                </>
                                            )}
                                            name="categoryColor"
                                            control={control}
                                        />

                                    </div>

                                </div>

                            </div>

                            
                            {/* <div className=" w-full flex flex-col md:w-[100%] min-h-[300px] border-[0.5px] py-6 rounded-lg bg-[#fff] shadow-sm " >
                                
                                <div className="h-[50px] w-full flex items-center mb-2  pl-4 justify-between " >
                                    <span className=" text-blue-gray-500 text-[14px] font-semibold " >Informations</span>
                                </div>

                                <span className=" font-medium text-[12px] px-6 " >Pour chaque catégorie (transaction immobilière, Succession, partage, immatriculation, fonds de commerce, déclaration, etc.), ajouter les sous-catégories qui vont avec:</span>

                                <div className= " flex flex-1 mx-3 flex-wrap gap-y-12 py-5 justify-center " >

                                    {fieldSubCategory.map((field, index) => (
                                        <fieldset key={field.id} className={"py-2 md:w-[95%] w-[100%] gap-y-4 rounded-md outline outline-[1px] overflow-hidden outline-blue-gray-100 flex flex-col " }>
                                                                                    
                                            <legend className="text-[14px] w-full rounded-t-md bg-primary py-4 text-white px-2 flex justify-start items-center gap-x-4 font-bold " >
                                                Sous-catégories {index+1} 
                                                <button 
                                                    onClick={() => { 
                                                        removeSubCategory(index) 
                                                    }} 
                                                    className='w-[30px] h-[30px] rounded-sm flex justify-center items-center ml-1 bg-red-400 text-[#fff] ' 
                                                >
                                                    x
                                                </button>
                                            </legend>

                                            <div className=" w-full gap-x-5 flex flex-1 flex-wrap mt-4 px-4 " >

                                                <div className=" flex flex-1 flex-col gap-y-2 " >

                                                    <>
                                                        <Controller
                                                            render={({
                                                                field: { ref, onChange, value, ...field },
                                                                fieldState: { invalid, error },
                                                            }) => (
                                                                <div style={{marginTop: 15}} >
                                                                    <Input ref={ref} disabled={watchSubCategories[index]?.isMinutier} onChange={onChange} className="h-[45px] w-full text-[13px] font-normal text-blue-gray-600" value={value} type="text" color="blue-gray" label="Title" size="lg" error={invalid} />
                                                                    {error && 
                                                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                                    }
                                                                </div>
                                                            )}
                                                            name={`subCategories[${index}].subCategoryName`}
                                                            control={control}
                                                        />
                                                    </>

                                                    <>
                                                        <Controller
                                                            render={({
                                                                field: { ref, onChange, value, ...field },
                                                                fieldState: { invalid, error },
                                                            }) => (
                                                                <div style={{marginTop: 15}} >
                                                                    <Textarea ref={ref} onChange={onChange} className="w-full text-[13px] font-normal text-blue-gray-600" value={value} type="text" color="blue-gray" label="Description" size="lg" error={invalid} />
                                                                    {error && 
                                                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                                                    }
                                                                </div>
                                                            )}
                                                            name={`subCategories[${index}].subCategoryDescription`}
                                                            control={control}
                                                        />
                                                    </>
                                                    
                                                </div>


                                                <div/>


                                                <div className=" relative flex flex-1 flex-col " >

                                                    <span className=" text-[13px] font-normal text-blue-gray-600" >Entrez les informations qui doivent être entrées lors de la création d'un dossier:</span>
                                                    
                                                    {(watchSubCategories[index]?.isMinutier || watchSubCategories[index]?.partyInvolvedAreCustomer)  ?
                                                        null
                                                        :
                                                        <>
                                                            <NextedInformation disabled={watchSubCategories[index]?.isMinutier || watchSubCategories[index]?.partyInvolvedAreCustomer} nextIndex={index} control={control}/>
                                                            {errors?.subCategories?.[index]?.informationRequested && <span className=" text-[11px] text-red-400 mt-1" >{errors?.subCategories?.[index]?.informationRequested?.message}</span>}
                                                        </>
                                                    }
                                                    
                                                    {(watchSubCategories[index]?.isMinutier || watchSubCategories[index]?.partyInvolvedAreCustomer ) &&
                                                        <div className=" absolute w-[100%] h-full rounded-md backdrop-blur-sm bg-gray-500/10 flex justify-center items-center" >
                                                            <RiForbidLine size={70} />
                                                        </div>
                                                    }

                                                </div>

                                            </div>

                                        </fieldset>
                                    ))}

                                </div>

                                <Button 
                                    onClick={() => { 
                                        appendSubCategory({
                                            id: uuidv4(),
                                            subCategoryName: "Sous-catégorie",
                                            subCategoryDescription: "",
                                            informationRequested: []
                                        })
                                    }} 
                                    className='self-center  h-[38px] bg-green-500 hover:shadow-none mr-[8px] ' >
                                    <span>Ajouter une sous catégorie</span>
                                </Button>  

                                {errors?.subCategories && <span className=" text-[11px] text-red-400 mx-3 mt-3" >{errors?.subCategories?.message}</span>}

                            </div> */}


                        </div>

                        <Button
                            className='mt-8 w-[60%] min-w-[250px] self-center '
                            color="green"
                            onClick={handleSubmit(handleClick)}
                            disabled={isLoading || !isDirty}
                        >
                            {isLoading ?
                                <BeatLoader color="#fff" size={8} />
                                :
                                <span>Modifier la catégorie</span>
                            }
                        </Button>

                    </CardBody>
                    
    

                </Card>

            </div>

        // </RenderIf>

    );
}

export default CategoriesEdit;
