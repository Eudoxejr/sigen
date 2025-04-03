import React from 'react'
import {produce} from "immer"
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
import BeatLoader from "react-spinners/BeatLoader";
import { useDialogueStore } from '@/store/dialogue.store';
import Switch from '@mui/material/Switch';
import { FoldersApi } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { handleBackendErrors } from "@/utils/handleHandler";

function CreateSubfolder2() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();

    const schema = yup.object({
        folderName: yup.string().required("Le nom est requis").min(2, "le nom doit être au moins de 2 caractères" ).max(250, "le nom doit être au plus de 250 caractères" ).notOneOf(["Minute"], "Entrez un nom de dossier autre que Minute"),
    }).required();

    const {control, handleSubmit, setError, formState:{ errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // console.log(dialogue);

    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
          return FoldersApi.createSubFolders(data, dialogue.data.currentFolder)
        },
        gcTime:0,
        onSuccess: (response) => {
  
          setDialogue({
            size: "sm",
            open: false,
            view: null,
            data: null
          })
  
          toast.success('Sous dossier créé avec succès', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
  
          queryClient.invalidateQueries(["getFolderTree"])
          queryClient.invalidateQueries(["getFolder"])
  
        },
        onError: ({response}) => {
          toast.error(handleBackendErrors(response.data, "Une erreur s'est produite"), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
        }
  
    })

    const handleClick = async (data) => {
        mutate(data)
    };


  return (

    <>

      <DialogHeader className='text-sm ' >Créer un sous dossier</DialogHeader>

      <DialogBody className=" flex flex-col" divider>

        {errors.root?.serverError && 
          <span className=" text-[11px] text-center mb-3 text-red-400" >{errors.root?.serverError.message}</span>
        }
      
        <Controller
          render={({
            field: { onChange, value },
            fieldState: { invalid, error}
          }) => (
            <>
              <Input onChange={onChange} value={value} type="text" color="blue-gray" label="Nom du sous-dossier" size="lg" error={invalid} />
              {error && 
                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
              }
            </>
          )}
          name="folderName"
          control={control}
        />

      </DialogBody>

      <DialogFooter>

        <Button
          variant="text"
          color="red"
          onClick={() => setDialogue({
            size: "sm",
            open: false,
            view: null,
            data: null
          })
          }
          className="mr-1"
        >
          <span>Annuler</span>
        </Button>

        <Button
          variant="gradient"
          color="green"
          onClick={handleSubmit(handleClick)}
        >
            <span>Créer</span>
        </Button>

      </DialogFooter>

    </>

  )

}

export default CreateSubfolder2