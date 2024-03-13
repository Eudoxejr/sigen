import React from 'react';
import {useFieldArray, Controller} from "react-hook-form";
import {
    Button,
    Input
} from "@material-tailwind/react";
import Select from 'react-select';
import { AiFillEuroCircle } from "react-icons/ai";
import { toast } from 'react-toastify';
import NextedInformationDone2 from '@/components/common/nestedInformationDone2'
import AsyncSelect from 'react-select/async';

const NextedParty = ({nextIndex, control, isCustomer}) => {

    const { fields:fieldsParty, append:appendParty, remove:removeParty } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `subCategories[${nextIndex}].partyInvolved` // unique name for your Field Array
    });

    return (

        <div className="flex flex-col gap-y-5 mt-1 " >

            {fieldsParty.map((field, index) => (
                
                <fieldset key={field.id} className=" flex flex-row gap-x-4 gap-y-5 w-[95%] flex-wrap " >

                    {/* subCategories[${nextIndex}].partyInvolved[${index}].partyTitle */}
                    <NextedInformationDone2 isCustomer={isCustomer} nextIndex1={nextIndex} nextIndex={index} control={control}/>

                </fieldset>
                
            ))}

        </div>

    );
}

export default NextedParty;
