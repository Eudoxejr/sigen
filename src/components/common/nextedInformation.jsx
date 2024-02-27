import React from 'react';
import {useFieldArray, Controller} from "react-hook-form";
import {
    Button,
    Input
} from "@material-tailwind/react";
import Select from 'react-select';
import { AiFillEuroCircle } from "react-icons/ai";
import { toast } from 'react-toastify';

const NextedInformation = ({nextIndex, control, disabled}) => {

    const { fields:fieldsInformation, append:appendInformation, remove:removeInformation } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `subCategories[${nextIndex}].informationRequested` // unique name for your Field Array
    });

    return (

        <div className="flex flex-col gap-y-5 mt-4 " >

            {fieldsInformation.map((field, index) => (
                
                <fieldset key={field.id} className=" flex flex-row gap-x-4 gap-y-5 w-[95%] flex-wrap " >

                    <Controller
                        render={({
                            field: { ref, onChange, value, ...field },
                            fieldState: { invalid, error },
                        }) => (
                            <div className="w-full" >
                                <div className=" flex flex-row gap-x-2 " >
                                    <input ref={ref} disabled={disabled} defaultValue={value} className=" w-full text-[12px] h-[40px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 " onChange={(e) => onChange(e.target.value)} type="text" color="blue-gray" placeholder="Information (Ex: Situation matrimoniale)" size="lg" />
                                    <button 
                                        disabled={disabled}
                                        onClick={() => removeInformation(index)}
                                        className=" w-[40px] h-[40px] rounded-md bg-red-500 justify-center items-center text-white " 
                                    >x</button>
                                </div>
                                { error && 
                                    <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                }  
                            </div>
                        )}
                        name={`subCategories[${nextIndex}].informationRequested[${index}].question`}
                        control={control}
                    />

                </fieldset>
                
            ))}

            <button 
                disabled={disabled}
                onClick={() => { 
                    appendInformation(
                        {
                            question: `Information ${fieldsInformation.length+1}`
                        }
                    )
                }} 
                className='rounded-md px-[15px] py-[7px] text-[13px] justify-center items-center bg-green-500 text-[#fff] ' 
            >
                Ajouter
            </button> 

        </div>

    );
}

export default NextedInformation;
