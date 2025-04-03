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
import { toast } from 'react-toastify';
import { useDialogueStore } from '@/store/dialogue.store';
import { handleBackendErrors } from "@/utils/handleHandler";
import { FoldersApi } from '@/api/api';
import { useNavigate, useLocation } from "react-router-dom";

function ArchivedFolderDialog() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {state} = useLocation();
    const params = dialogue?.data


    const { mutate, isLoading } = useMutation({
        mutationFn: async (data) => {
            return FoldersApi.updateFolders(params?.id, {
                isArchived: !params?.is_archived
            })
        },
        gcTime: 0,
        onSuccess: (response) => {

            setDialogue({
                size: "sm",
                open: false,
                view: null,
                data: null
            })

            toast.success('Dossier archivé avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            })

            queryClient.setQueriesData(["getDossier"], (dataDossier) => {
              const indexUpdateDossier = dataDossier.data.findIndex((data) => data.id == params?.id)
              const nextData = produce(dataDossier, draftData => {
                draftData.data[indexUpdateDossier].is_archived = response.data.is_archived
              });
              return nextData;
            });

            navigate("/dashboard/dossiers/view", {
                replace: true,
                state: { ...state, ...response.data },
            });

        },
        onError: ({ response }) => {
            const errorTraited = handleBackendErrors(response.data)
            toast.error(errorTraited || "Une erreur s'est produite", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            })
        }
    })

    const handleClick = async () => {
        mutate()
    };


    return (

        <>

            <DialogHeader className='text-sm ' >{params?.is_archived ? "Désarchiver le dossier" : "Archiver le dossier"}</DialogHeader>

            <DialogBody className=" flex flex-col" divider>
              <div>
                {params?.is_archived ? "Voulez vous désarchiver le dossier " : "Voulez vous archiver le dossier "}
                <span className="font-bold mx-1">{params?.folder_name}</span> ?
              </div>
            </DialogBody>
            <DialogFooter>

                <Button
                    variant="text"
                    color={params?.is_archived ? 'red' : 'green'}
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
                    color={!params?.is_archived ? 'red' : 'green'}
                    onClick={handleClick}
                    disabled={isLoading}
                >

                    {isLoading ?
                        <BeatLoader color="#fff" size={8} />
                        :
                        <span>{!params?.is_archived ? "Archiver" : "Désarchiver"}</span>
                    }

                </Button>

            </DialogFooter>

        </>

    )

}

export default ArchivedFolderDialog