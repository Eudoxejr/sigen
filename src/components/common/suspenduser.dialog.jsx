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
import AsyncSelect from 'react-select/async';
import { CollaboApi, RoleApi } from '@/api/api';


function SuspendUserDialog() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();
    const params = dialogue?.data


    const { mutate, isLoading } = useMutation({
        mutationFn: async (data) => {
            return CollaboApi.suspendUser(params?.id, {isSuspend: params?.wasActive})
        },
        gcTime: 0,
        onSuccess: (response) => {

            setDialogue({
                size: "sm",
                open: false,
                view: null,
                data: null
            })

            {
              !params?.wasActive ?
                toast.success('Collaborateur activé avec succès', {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                  theme: "colored",
                })
                :
                toast.success('Collaborateur suspendu avec succès', {
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

            queryClient.setQueriesData(["getCollabo"], (dataUser) => {

              const indexUpdateUser = dataUser.data.findIndex((user) => user.id == params?.id)
      
              const nextData = produce(dataUser, draftData => {
                draftData.data[indexUpdateUser].is_suspend = response.data.is_suspend
              });
      
              return nextData;
            });

        },
        onError: ({ response }) => {
            const errorTraited = handleBackendErrors(response.data)
            setError('root.serverError', {
                message: errorTraited || "Une erreur s'est produite"
            })
        }

    })

    const handleClick = async () => {
      // console.log(params?.id)
        mutate()
    };


    return (

        <>

            <DialogHeader className='text-sm ' >{params?.wasActive ? "Suspendre le collaborateur" : "Activer le collaborateur"}</DialogHeader>

            <DialogBody className=" flex flex-col" divider>
              <div>
                {params?.wasActive ? "Voulez vous suspendre le collaborateur " : "Voulez vous activer le collaborateur "}
                <span className="font-bold mx-1">{params?.firstname + ' ' + params?.lastname}</span> ?
              </div>
            </DialogBody>
            <DialogFooter>

                <Button
                    variant="text"
                    color={!params?.wasActive ? 'red' : 'green'}
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
                    color={params?.wasActive ? 'red' : 'green'}
                    onClick={handleClick}
                    disabled={isLoading}
                >

                    {isLoading ?
                        <BeatLoader color="#fff" size={8} />
                        :
                        <span>{params?.wasActive ? "Suspendre" : "Activer"}</span>
                    }

                </Button>

            </DialogFooter>

        </>

    )

}

export default SuspendUserDialog