import React from 'react'
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import AsyncSelect from 'react-select/async';
import { CategoriesApi, ClientApi, CollaboApi, FoldersApi } from "@/api/api";


export default function ConfigFolder({setActiveStep, configFolder, setConfigFolder}) {


    const schema = yup.object({
        clientId: yup.string().trim("Sélectionner le client svp").required("Sélectionner le client svp"),
        categoryId: yup.string().trim("Sélectionner une catégorie svp").required("Sélectionner une catégorie svp"),
        managerId: yup.string().trim("Sélectionner un titulaire svp").required("Sélectionner un titulaire svp"),
        subManagerId: yup.string()
    }).required();


    const { control, setValue, handleSubmit, setError, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: configFolder ? {
            ...configFolder
        } : null
    });

    
    const getCient = async (inputValue) => {
        const res = await ClientApi.getClient(1, 12, inputValue)
        return res.data.map((data) => { return { label: data?.civility !== 'Structure' ? data.firstname + ' ' + data.lastname : data.denomination, value: data.id } })
    };
    const loadOptionsClient = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCient(inputValue))
        });


    const getCat = async (inputValue) => {
        const res = await CategoriesApi.getCategories(1, 8, inputValue)
        return res.data.map((data) => { return { label: data.category_name, value: data.id, other: data } })
    };
    const loadOptionsCategorie = (inputValue) =>
        new Promise((resolve) => {
            resolve(getCat(inputValue))
        })


    const getCol = async (inputValue) => {
        const res = await CollaboApi.getCollabo(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.firstname + ' ' + data.lastname, value: data.id, other: data } })
    };
    const loadOptionsCol = (inputValue) =>
        new Promise((resolve) => {
            resolve(getCol(inputValue))
        })


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

            <div className=" w-full md:w-[80%] self-center py-2 flex flex-wrap gap-y-8 gap-x-[4%] rounded-md mb-[30px] mt-[40px] justify-center  " >

                <div className=" w-full md:w-[40%] flex flex-col flex-wrap gap-y-2 justify-center " >

                    <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >Le client</span>
                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] gap-y-[12px] " >
                        <Controller
                            render={({
                                field: { onChange, value, ref },
                                fieldState: { invalid, error }
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
                                                height: 40,
                                                fontSize: 13,
                                                fontWeight: "400",
                                                color: "red",
                                            }),
                                        }}
                                        placeholder="Client"
                                        onChange={(val) => onChange(val.value)}
                                    />
                                    {error &&
                                        <span className=" text-[12px] text-red-400 " >{error.message}</span>
                                    }
                                </>
                            )}
                            name="clientId"
                            control={control}
                        />
                    </div>

                </div>

                <div className=" w-full md:w-[40%] flex flex-col flex-wrap gap-y-2 justify-center " >
                    <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >La catégorie du dossier</span>
                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] gap-y-[12px] " >
                        <Controller
                            render={({
                                field: { onChange, value, ref },
                                fieldState: { invalid, error }
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
                                                height: 40,
                                                fontSize: 13,
                                                fontWeight: "400",
                                                color: "red"
                                            }),
                                        }}
                                        placeholder="catégorie du dossier"
                                        onChange={(val) => { onChange(val.value)}}
                                    />
                                    {error &&
                                        <span className=" text-[12px] text-red-400 " >{error.message}</span>
                                    }
                                </>
                            )}
                            name="categoryId"
                            control={control}
                        />
                    </div>
                </div>

                <div className=" w-full md:w-[40%] flex flex-col flex-wrap gap-y-2  justify-center " >

                    <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >Le collaborateur titulaire</span>
                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] gap-y-[12px] " >
                        <Controller
                            render={({
                                field: { onChange, value, ref },
                                fieldState: { invalid, error }
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
                                                height: 40,
                                                fontSize: 13,
                                                fontWeight: "400",
                                                color: "red"
                                            }),
                                        }}
                                        placeholder="collaborateur"
                                        onChange={(val) => onChange(val.value)}
                                    />
                                    {error &&
                                        <span className=" text-[12px] text-red-400 " >{error.message}</span>
                                    }
                                </>
                            )}
                            name="managerId"
                            control={control}
                        />
                    </div>

                </div>

                <div className="w-full md:w-[40%] flex flex-col flex-wrap gap-y-2 justify-center " >

                    <span className=" text-blue-gray-500 mx-[2.5%] text-[14px] font-medium " >Le collaborateur suppléant</span>
                    <div className=" w-[95%] min-w-[200px] mx-[2.5%] gap-y-[12px] " >
                        <Controller
                            render={({
                                field: { onChange, value, ref },
                                fieldState: { invalid, error }
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
                                                height: 40,
                                                fontSize: 13,
                                                fontWeight: "400",
                                                color: "red"
                                            }),
                                        }}
                                        placeholder="collaborateur suppléant"
                                        onChange={(val) => onChange(val.value)}
                                    />
                                    {error &&
                                        <span className=" text-[12px] text-red-400 " >{error.message}</span>
                                    }
                                </>
                            )}
                            name="subManagerId"
                            control={control}
                        />
                    </div>

                </div>

            </div>

            <div className=" w-full md:w-[80%] mt-5 self-center flex flex-row justify-end " >
                <button onClick={handleSubmit(handleClick)} className=" bg-primary font-medium text-[14px] text-white px-4 py-2 rounded-md  " >
                    Suivant
                </button>
            </div>

        </>
    )
}
