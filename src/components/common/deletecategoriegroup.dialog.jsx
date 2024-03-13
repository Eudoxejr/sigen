import React from 'react'
import {produce} from "immer"
import {
    Button,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategorieGroupeApi } from '@/api/api';
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from 'react-toastify';
import { useDialogueStore } from '@/store/dialogue.store';
import { handleBackendErrors } from "@/utils/handleHandler";

function DeleteCategorieGroup() {

    const queryClient = useQueryClient();
    const { setDialogue, dialogue } = useDialogueStore()

    const {mutate, isLoading, error} = useMutation({

        mutationFn: async () => {
          return CategorieGroupeApi.deleteCategorieGroups(dialogue?.data?.id)
        },
        gcTime: 0,
        onSuccess: (res) => {

          setDialogue({
            size: "sm",
            open: false,
            view: null,
            data: null
          })

          toast.success('Groupe de catégorie supprimé avec succès', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });

          queryClient.setQueriesData(["getAllCategorieGroups"], (dataGroup) => {

            const indexUpdateGroup = dataGroup.data.findIndex((group) => group.id == dialogue?.data?.id )
            const nextData = produce(dataGroup, draftData => {
              draftData.data.splice(indexUpdateGroup,1)
              draftData.meta.total = dataGroup.meta.total-1
            })
        
            return nextData;

          })

        },
        onError: ({response}) => {
          
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
        mutate()
    };

  return (

    <>

        <DialogHeader className='text-sm ' >Supprimer le groupe de catégorie</DialogHeader>

        <DialogBody className="font-normal flex justify-center items-center text-[13px]" divider>

          Voulez vous supprimer le groupe de catégorie <span className=" text-[14px] font-semibold mx-1 " >{dialogue?.data?.group_name}</span> ?

        </DialogBody>

        <DialogFooter>

          <Button
            variant="text"
            color="green"
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
            color="red"
            onClick={() => handleClick()}
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

export default DeleteCategorieGroup