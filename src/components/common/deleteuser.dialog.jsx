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
import { useLocation, useNavigate, useParams } from 'react-router-dom';


function DeleteUserDialog() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();
    const params = dialogue?.data
    const navigate = useNavigate();

    const { mutate, isLoading } = useMutation({
        mutationFn: async (data) => {
            return CollaboApi.deleteUser(params?.id)
        },
        gcTime: 0,
        onSuccess: (response) => {

            setDialogue({
                size: "sm",
                open: false,
                view: null,
                data: null
            })

            toast.success('Collaborateur supprimé avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            })
               
            queryClient.setQueriesData(["getCollabo"], (dataUser) => {

              const indexDeleteUser = dataUser.data.findIndex((user) => user.id == params?.id)
      
              const nextData = produce(dataUser, draftData => {
                draftData.data.splice(indexDeleteUser, 1)
              });
      
              return nextData;
            });  

            if(params?.goBack) {
                navigate(-1)
            }


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

            <DialogHeader className='text-sm ' >Supprimer le collaborateur</DialogHeader>

            <DialogBody className=" flex flex-col" divider>
              <div>
                {"Voulez vous supprimer le collaborateur "}
                <span className="font-bold mx-1">{params?.firstname + ' ' + params?.lastname}</span> ?
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

export default DeleteUserDialog