import React from 'react';
import {useFieldArray, Controller} from "react-hook-form";
import {
    Button,
    Input
} from "@material-tailwind/react";
import Select from 'react-select';
import { AiFillEuroCircle } from "react-icons/ai";
import { toast } from 'react-toastify';
import { ClientApi } from "@/api/api";
import AsyncSelect from 'react-select/async';

const NextedInformationDone2 = ({nextIndex1, nextIndex, control, isCustomer}) => {

    const { fields:fieldsInfoDone } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `subCategories[${nextIndex1}].partyInvolved[${nextIndex}].informationDone` // unique name for your Field Array
    });

    const getCient = async (inputValue) => {
        const res = await ClientApi.getClient(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.firstname+' '+data.lastname, value: data.id } })
    };
    const loadOptionsClient = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCient(inputValue))
        }
    );

    return (

        <div className=" w-full flex flex-col gap-y-5 mt-1 " >

            {fieldsInfoDone.map((field, index) => (
                
                <fieldset key={field.id} className=" flex flex-row gap-x-4 gap-y-5 w-[95%] flex-wrap " >

                    <legend className="text-[12px] mb-2 font-semibold justify-between" >
                        {field.key}
                    </legend>

                    <Controller
                        render={({
                            field: { ref, onChange, value, ...field },
                            fieldState: { invalid, error },
                        }) => (
                            <div className="w-full" >
                                {isCustomer ? 
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
                                                zIndex: 9999
                                            }),
                                        }}
                                        placeholder="Client"
                                        onChange={(val) => onChange(val.value) }
                                    />      
                                : 
                                    <input ref={ref} defaultValue={value} className=" w-full text-[12px] h-[40px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 " onChange={(e) => onChange(e.target.value)} type="text" color="blue-gray" size="lg" />
                                }

                                { error && 
                                    <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                }  
                            </div>
                        )}
                        name={`subCategories[${nextIndex1}].partyInvolved[${nextIndex}].informationDone[${index}].value`}
                        control={control}
                    />

                </fieldset>
                
            ))}

        </div>

    );
}

export default NextedInformationDone2;
