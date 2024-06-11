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


function CreateVariable() {

    const { setDialogue, dialogue } = useDialogueStore()

    const schema = yup.object({
        name: yup.string().required("Le nom est requis").min(2, "le nom doit être au moins de 2 caractères" ).max(250, "le nom doit être au plus de 250 caractères" ),
    }).required();

    const {control, handleSubmit, setError, formState:{ errors } } = useForm({
        resolver: yupResolver(schema),
    });


    const handleClick = async (data) => {
      dialogue.functionAppendVariable(data)
      setDialogue({
        size: "sm",
        open: false,
        view: null,
        data: null
      })
    };


  return (

    <>

      <DialogHeader className='text-sm ' >Créer une variable</DialogHeader>

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
              <Input onChange={onChange} value={value} type="text" color="blue-gray" label="Nom de la variable" size="lg" error={invalid} />
              {error && 
                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
              }
            </>
          )}
          name="name"
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

export default CreateVariable