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


function CreateVariableGroup() {

  const { setDialogue, dialogue } = useDialogueStore()

  const schema = yup.object({
    name: yup.string().required("Le nom du groupe est requis").notOneOf(["Autres"], "Entrez un nom de groupe autre que << Autres >>").min(2, "le title du groupe doit être au moins de 2 caractères" ).max(250, "le title du groupe doit être au plus de 250 caractères" ),
    isClientGroup: yup.boolean(),
    variables: yup.array().required()
  }).required();

  const {control, handleSubmit, setError, formState:{ errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      variables: [],
      isClientGroup: false
    }
  });

  const handleClick = async (data) => {
    if(data.isClientGroup){
      dialogue.functionPrependGroupVariable({
        ...data,
        variables: [
          { name: data.name+'_prenom', valueInTable: 'firstname' },
          { name: data.name+'_nom', valueInTable: 'lastname' },
          { name: data.name+'_matricule', valueInTable: 'matricule' },
          { name: data.name+'_denomination', valueInTable: 'denomination' },
          { name: data.name+'_numeroDeTelephone', valueInTable: 'phone_number' },
          { name: data.name+'_email', valueInTable: 'email' },
          { name: data.name+'_adressePhysique', valueInTable: 'adresse_physique' },
          { name: data.name+'_adresseDuSiege', valueInTable: 'adresse_siege' },
          { name: data.name+'_nomCompletDuPere', valueInTable: 'fullname_father' },
          { name: data.name+'_nomCompletDeLaMere', valueInTable: 'fullname_monther' },
          { name: data.name+'_nomCompletDuConjoint', valueInTable: 'fullname_conjoint' },
          { name: data.name+'_civilité', valueInTable: 'civility' },
          { name: data.name+'_formeDeLaStructure', valueInTable: 'forme_structure' },
          { name: data.name+'_profession', valueInTable: 'profession' },
          { name: data.name+'_statutMatrimonial', valueInTable: 'marital_status' },
          { name: data.name+'_numeroUFU', valueInTable: 'numero_ufu' },
          { name: data.name+'_numeroRCC', valueInTable: 'numero_rcc' }
        ]
      })
    }
    else {
      dialogue.functionPrependGroupVariable(data)
    }
    setDialogue({
      size: "sm",
      open: false,
      view: null,
      data: null
    })
  };


  return (

    <>

      <DialogHeader className='text-sm ' >Créer un groupe de variable</DialogHeader>

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
          name="name"
          control={control}
        />

        <Controller
            render={({
                field: { onChange, value },
                fieldState: { invalid, error }
            }) => (
                <div className="flex flex-row w-full items-center justify-between mt-[10px]">
                    <span className=" text-[15px] font-medium text-blue-gray-600" >Regroupe les variables(informations) d'un client</span>
                    <Switch checked={value} onChange={(e) => { onChange(e.target.checked) }} />
                </div>
            )}
            name="isClientGroup"
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

export default CreateVariableGroup