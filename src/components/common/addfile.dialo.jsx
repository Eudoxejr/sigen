import React, {useState} from 'react'
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
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '@/utils/uploadS3';
import { UploadFilesToS3 } from "@/utils/uploadS3V3";

function AddFile() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();

    const [loading2, setloading2] = useState();

    const schema = yup.object({
        fileName: yup.string().required('Le nom du fichier est requis'),
        fileDescription: yup.string(),
        file: yup.mixed().required("Vous n'avez selectionner le fichier")
      }).required();

    const {control, watch, handleSubmit, setError, setValue, formState:{ errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const watchFileAdd = watch("file");

    const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
      multiple: false,
      // noClick: true,
      // maxSize: 5000,
      accept: {
        'image/jpeg': [],
        'image/jpg': [],
        'image/png': [],
        'application/pdf': []
        // 'image/svg': []
      },
      onDropAccepted: result => {
        setValue('file', result[0], { shouldDirty: true })
      }
    })

    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
          return FoldersApi.addFolders(data, dialogue.data.currentFolder)
        },
        gcTime:0,
        onSuccess: (response) => {
  
          setDialogue({
            size: "sm",
            open: false,
            view: null,
            data: null
          })
  
          toast.success('Fichier ajouté avec succès', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
  
        //   queryClient.invalidateQueries(["getFolderTree"])
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
      setloading2(true)
      await UploadFilesToS3([
        {
          preview: data.file,
          fileName: data.fileName,
          isSfdt: false,
        }  
      ])
      .then((s3Link) => {
        console.log(s3Link[0]);
        
        data.fileLocation = s3Link[0]?.url
        data.type = s3Link[0]?.type
        // data.folderId = dialogue.data.currentFolder
        delete data.file
        mutate(data)
      })
      .catch((err) => {

        toast.error("Une erreur s'est produite lors de l'upload du fichier", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });

      })
    };


  return (

    <>

      <DialogHeader className='text-sm ' >Ajouter un fichier</DialogHeader>

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
              <Input onChange={onChange} value={value} type="text" color="blue-gray" label="Nom du fichier" size="lg" error={invalid} />
              {error && 
                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
              }
            </>
          )}
          name="fileName"
          control={control}
        />

        
        <Controller
          render={({
            field: { onChange, value },
            fieldState: { invalid, error}
          }) => (
            <div className="mt-4" >
              <Input onChange={onChange} value={value} type="text" color="blue-gray" label="Description" size="lg" error={invalid} />
              {error && 
                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
              }
            </div>
          )}
          name="fileDescription"
          control={control}
        />

        <Controller
          render={({
            field: { onChange, value },
            fieldState: { invalid, error}
          }) => (
            <>
              <div {...getRootProps({ className: 'dropzone cursor-pointer overflow-hidden mt-5 bg-gray-200 w-full h-[130px] mb-2 rounded-[5px] ' })}>
                <input {...getInputProps()} />
                <div className=' flex-1 flex h-full text-[12px] justify-center items-center '>

                  {!isDragActive &&

                    <>

                      {watchFileAdd ?

                        <div className="render_albums justify-center items-center flex text-[16px] font-medium relative w-full h-full" >
                          {value.path}
                        </div>

                        :

                        <div className="flex flex-col relative text-center text-[12px] justify-center items-center gap-y-1" >
                          Cliquez ici pour selectionner un fichier<br/>
                          <em>(seulement *.jpeg, *.png, *pdf sont acceptés)</em>
                        </div>

                      }

                    </>

                  }

                  {isDragActive && !isDragReject && "Drop it like it's hot!"}
                  {isDragReject && "File type not accepted, sorry!"}

                </div>
              </div>
              {error && 
                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
              }
            </>
          )}
          name="file"
          control={control}
        />

      </DialogBody>

      <DialogFooter>

        <Button
          variant="text"
          color="red"
          disabled={loading2}
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
          disabled={loading2}
          onClick={handleSubmit(handleClick)}
        >
          {loading2 ?
            <span>Chargement</span>
          :
            <span>Ajouter</span>
          }
        </Button>

      </DialogFooter>

    </>

  )

}

export default AddFile