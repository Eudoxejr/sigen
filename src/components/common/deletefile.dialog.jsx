import React from 'react'
import {
    Button,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from 'react-toastify';
import { useDialogueStore } from '@/store/dialogue.store';
import { handleBackendErrors } from "@/utils/handleHandler";
import { FoldersApi } from '@/api/api';


function DeleteFileDialog() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();
    const params = dialogue?.data
    

    const { mutate, isLoading } = useMutation({
        mutationFn: async (data) => {
            return FoldersApi.deleteFile(params?.id)
        },
        gcTime: 0,
        onSuccess: (response) => {

            setDialogue({
                size: "sm",
                open: false,
                view: null,
                data: null
            })

            toast.success('fichier supprimé avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            })
               
            queryClient.invalidateQueries(["getFolder"])

        },
        onError: ({ response }) => {
            setDialogue({
                size: "sm",
                open: false,
                view: null,
                data: null
            })
            toast.error(handleBackendErrors(response.data, "une erreur s'est produite lors de la suppression"), {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }

    })

    const handleClick = async () => {
        //console.log(params?.id)
        mutate()
    };


    return (

        <>

            <DialogHeader className='text-sm ' >Supprimer le fichier</DialogHeader>

            <DialogBody className=" flex flex-col" divider>
              <div>
                {"Voulez vous supprimer le Fichier "}
                <span className="font-bold mx-1">{params?.file_name}</span> ?
              </div>
            </DialogBody>
            <DialogFooter>

                <Button
                    variant="text"
                    color={'green'}
                    onClick={() => setDialogue({
                        size: "sm",
                        open: false,
                        view: null,
                        data: null
                    })
                    }
                    className="mr-1"
                    disabled={isLoading}
                >
                    <span>Annuler</span>
                </Button>

                <Button
                    variant="gradient"
                    color='red'
                    onClick={handleClick}
                    disabled={isLoading}
                >

                    {isLoading ?
                        <BeatLoader color="#fff" size={8} />
                        :
                        <span>Supprimer</span>
                    }

                </Button>

            </DialogFooter>

        </>

    )

}

export default DeleteFileDialog