import React from 'react'
import { produce } from "immer"
import {
    Button,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input
} from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import { useDialogueStore } from "@/store/dialogue.store";
import MinuteSelection from '@/pages/dashboard/dossiers/components/minuteSelection';


function SelectTemplateForFolder() {

    const { setDialogue } = useDialogueStore();

    return (

        <>

            <DialogHeader className='text-sm ' >Sélectionner un template de minute</DialogHeader>

            <DialogBody className=" flex flex-col" divider>
                <MinuteSelection modal={true} />
            </DialogBody>
            <DialogFooter>

                <Button
                    variant="text"
                    color={'red'}
                    onClick={() => setDialogue({
                        size: "sm",
                        open: false,
                        view: null,
                        data: null
                    })
                    }
                    className="mr-1"
                    // disabled={isLoading}
                >
                    <span>Annuler</span>
                </Button>

            </DialogFooter>

        </>

    )

}

export default SelectTemplateForFolder