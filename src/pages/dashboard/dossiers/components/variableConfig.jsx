import React, {useState} from 'react'
import { TemplateApi, FoldersApi, ClientApi } from "@/api/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { useDialogueStore } from '@/store/dialogue.store';
import AsyncSelect from 'react-select/async';
import { useNavigate, useLocation } from "react-router-dom";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import extractAndMergeVariables from '@/utils/utils'
import ReviewActe from './reviewActe';

const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
};

export default function VariableConfig() {

    const { setDialogue } = useDialogueStore()
    const {state} = useLocation();
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(0);

    const [mergeAllData, setMergeAllData] = useState(null)

    const [geneationDraftActe, setGeneationDraftActe] = useState(false)

    const { control, handleSubmit, setValue, formState: { errors }} = useForm();
  
    const { data: listVariable } = useQuery({
        queryKey: ["getMinuteVariableConfig", state?.template_id],
        queryFn: async ({ queryKey }) => {
            return TemplateApi.getTemplateVariable(queryKey[1])
        },
        enabled: true,
        staleTime: 0,
        refetchOnWindowFocus: false
    })

    const onSubmit = async (data) => {
        setGeneationDraftActe(true)
        const mergedData = await extractAndMergeVariables(listVariable, data);
        setMergeAllData(mergedData);
        setGeneationDraftActe(false)
    };

    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    const getCient = async (inputValue) => {
        const res = await ClientApi.getClient(1, 12, inputValue)
        return res.data.map((data) => { return { label: data?.civility !== 'Structure' ? data.firstname + ' ' + data.lastname : data.denomination, value: data.id, otherData: data} })
    };

    const loadOptionsClient = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCient(inputValue))
        });

  return (

    <div className=" w-[95%] px-6 self-center flex flex-col bg-white rounded-lg mt-8 items-center justify-center " >
        
        <div className=" w-full self-center flex flex-wrap gap-y-5 gap-x-[4%] mb-[30px] mt-[50px] " >

            <div className=" w-full md:w-[90%] flex flex-col font-medium flex-wrap text-[16px] " >
                Renseigner des informations pour la génération de l’acte notarié<br/>
                <br/>
                <span className=' text-[13px] font-normal ' >Veuillez renseigner les informations suivantes pour compléter la rédaction de l’acte notarié.</span>
            </div>

            <div className=" w-full md:w-[100%] flex font-medium flex-wrap " >
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {Array.isArray(listVariable?.group) && listVariable?.group?.map((item, key) => {
                        // Vérification si tous les champs du groupe sont remplis
                        const isGroupInvalid = item?.variables?.some(variable => errors[variable.id]);
                        return (
                            <Accordion key={item?.id+"groupeVariable"} open={open === key+1} animate={CUSTOM_ANIMATION}>
                                <AccordionHeader className=" text-[15px] " onClick={() => handleOpen(key+1)}>
                                    {item?.name}
                                    {isGroupInvalid && (
                                        <p className="text-red-500 text-[10px] mt-1">
                                            Veuillez remplir tous les champs de ce groupe.
                                        </p>
                                    )}
                                </AccordionHeader>
                                <AccordionBody className=" flex flex-col min-h-[80px] flex-wrap gap-y-4 gap-x-5 ">
                                    {item.isClientGroup &&
                                        <AsyncSelect
                                            cacheOptions
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
                                            placeholder={item?.name}
                                            onChange={(val) => {
                                                if (val?.otherData) {
                                                    item.variables.forEach(variable => {
                                                        const newValue = val.otherData[variable.valueInTable] ?? "N/A";
                                                        setValue(variable.id.toString(), newValue);
                                                    });
                                                }
                                            }}
                                        />
                                    }
                                    <div className=" flex flex-row min-h-[80px] flex-wrap gap-y-4 gap-x-5 " >
                                        {item?.variables?.map((variable) => (
                                            <div key={variable.id} className=" w-[90%] md:w-[30%] flex flex-col gap-y-1 " >
                                                <Controller
                                                    name={variable.id.toString()}
                                                    control={control}
                                                    defaultValue={variable.defaultValue || ""}
                                                    rules={{ required: "Ce champ est requis" }}
                                                    render={({ field }) => (
                                                        <div>
                                                            <label className=" text-[13px] font-semibold " >{variable?.name}</label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                className=" p-2 mt-1 border rounded w-full"
                                                                error={errors[variable.id]}
                                                                // disabled={ item.isClientGroup ? field.value !== "N/A" ?  true : false : false}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </AccordionBody>
                            </Accordion>
                        )
                    })}

                    <button
                        type="submit"
                        disabled={geneationDraftActe}
                        className="bg-primary disabled:bg-blue-gray-700 text-[13px] text-white !mt-4 px-4 py-2 rounded-lg "
                    >
                        { geneationDraftActe ? "Génération..." : "Générer un nouvel acte brouillon"}
                    </button>

                </form>

            </div>

        </div>

        {mergeAllData &&
            <div className=' flex flex-1 pb-4 w-full lg:w-[calc(100vw-1050px)] ' >
                <ReviewActe mergeAllData={mergeAllData} url={listVariable?.url} />
            </div>
        }

    </div>

  )
}
