import React from 'react';
import {useFieldArray, Controller} from "react-hook-form";
import {
    Button,
    Input
} from "@material-tailwind/react";
import Select from 'react-select';
import { AiFillEuroCircle } from "react-icons/ai";
import { toast } from 'react-toastify';

const NextedParty = ({nextIndex, control, disabled}) => {

    const { fields:fieldsParty, append:appendParty, remove:removeParty } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `subCategories[${nextIndex}].partyInvolved` // unique name for your Field Array
    });

    return (

        <div className="flex flex-col gap-y-5 mt-4 " >

            <div className=" w-full flex items-center justify-between " >
                <span className=" text-blue-gray-500 text-[13px] font-medium " >Partie(s) Prenante(s)</span> 
            </div>

            {fieldsParty.map((field, index) => (
                
                <fieldset key={field.id} className=" flex flex-row gap-x-4 gap-y-5 w-[95%] flex-wrap " >

                    <legend className="text-[12px] mb-2 font-semibold justify-between" >
                        Partie {index+1}
                        <button 
                            disabled={disabled}
                            onClick={() => removeParty(index)}
                            className='rounded-full w-[20px] h-[20px] ml-3 text-[12px] justify-center items-center bg-red-400 text-[#fff] ' 
                        >
                            x
                        </button>
                    </legend>


                    <Controller
                        render={({
                            field: { ref, onChange, value, ...field },
                            fieldState: { invalid, error },
                        }) => (
                            <div className="w-full" >
                                <input ref={ref} defaultValue={value} disabled={disabled} className=" w-full text-[12px] h-[40px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 " onChange={(e) => onChange(e.target.value)} type="text" color="blue-gray" placeholder="Nom de la partie (Ex: Vendeur)" size="lg" />
                                { error && 
                                    <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                }  
                            </div>
                        )}
                        name={`subCategories[${nextIndex}].partyInvolved[${index}].partyTitle`}
                        control={control}
                    />

                </fieldset>
                
            ))}


            <button 
                disabled={disabled}
                onClick={() => { 
                    appendParty(
                        {
                            partyTitle: `Partie ${fieldsParty.length+1}`
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

export default NextedParty;
