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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategorieGroupeApi } from '@/api/api';
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from 'react-toastify';
import { useDialogueStore } from '@/store/dialogue.store';
import { handleBackendErrors } from "@/utils/handleHandler";


function CreateCategorieGroup() {

  const { setDialogue } = useDialogueStore()
  const queryClient = useQueryClient();

  const schema = yup.object({
    groupName: yup.string().required("Le nom du groupe est requis").min(2, "le title du groupe doit être au moins de 2 caractères" ).max(250, "le title du groupe doit être au plus de 250 caractères" )
  }).required();

  const {control, handleSubmit, setError, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });


  const {mutate, isLoading} = useMutation({

      mutationFn: async (data) => {
        return CategorieGroupeApi.createCategorieGroups(data)
      },
      gcTime:0,
      onSuccess: (response) => {

        setDialogue({
          size: "sm",
          open: false,
          view: null,
          data: null
        })

        toast.success('Groupe de catégorie créé avec succès', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });

        queryClient.setQueriesData(["getAllCategorieGroups"], (dataGroup) => {

          const nextData = produce(dataGroup, draftData => {
            draftData.data.unshift({...response.data[0], meta: {totalCategories: 0}})
            draftData.meta.total = dataGroup.meta.total+1
          })
      
          return nextData;

        })
        // queryClient.invalidateQueries(["getZone"])

      },
      onError: ({response}) => {
        const errorTraited = handleBackendErrors(response.data)
        setError('root.serverError', { 
          message: errorTraited || "Une erreur s'est produite"
        })
      }

  })

  const handleClick = async (data) => {
    let arrayFormat = {data: [data]}
    mutate(arrayFormat)
  };


  return (

    <>

      <DialogHeader className='text-sm ' >Créer un groupe de catégorie</DialogHeader>

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
              <Input onChange={onChange} value={value} type="text" color="blue-gray" label="Nom du groupe de catégorie" size="lg" error={invalid} />
              {error && 
                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
              }
            </>
          )}
          name="groupName"
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
          disabled={isLoading}
        >
          <span>Annuler</span>
        </Button>

        <Button
          variant="gradient"
          color="green"
          onClick={handleSubmit(handleClick)}
          disabled={isLoading}
        >

          {isLoading ?
              <BeatLoader color="#fff" size={8} />
              :
              <span>Créer</span>
          }

        </Button>

      </DialogFooter>

    </>

  )

}

export default CreateCategorieGroup