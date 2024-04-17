import styled from "@emotion/styled";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  CardHeader,
  Tooltip,
  Chip,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import { BsCardImage } from "react-icons/bs";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user.store";
import { useDropzone } from 'react-dropzone'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useDialogueStore } from '@/store/dialogue.store';
import { uploadFile } from '@/utils/uploadS3';
import { toast } from 'react-toastify';
import {CollaboApi} from '@/api/api'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UpdatePsw from "@/components/profil/updatePsw";

export function Profile() {

  const { user, updateUser } = useUserStore()
  const navigate = useNavigate();

  const { setBackdrop } = useDialogueStore()

  const queryClient = useQueryClient();

  const schema = yup.object({

    firstname: yup.string().required('Le prénom est requis'),
    lastname: yup.string().required('Le nom de famille est requis'),
    email: yup.string().email('L\'adresse email doit être valide').required('L\'adresse email est requise'),
    phoneNumber: yup.string()
      .matches(/^\+?\d+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres et peut commencer par un signe +')
      .required('Le numéro de téléphone est requis'),
    profilPic: yup.mixed().nullable()
    
  }).required();

  const {control, watch, setValue, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      lastname: user?.user?.lastname,
      firstname: user?.user?.firstname,
      email: user?.user?.email,
      phoneNumber: user?.user?.phone_number
    }
  });

  const watchPhotoAdd = watch("profilPic", user?.user?.profil_pic);
  const [file, setfile] = useState(user?.user?.profil_pic);
  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    multiple: false,
    noClick: true,
    // maxSize: 5000,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      // 'image/svg': []
    },
    onDropAccepted: result => {
      setValue('profilPic', result[0], { shouldDirty: true })
      setfile(URL.createObjectURL(result[0]))
    }
  })


  const {mutate, isLoading} = useMutation({

    mutationFn: async (data) => {
      return CollaboApi.updateMe(data)
    },
    gcTime:0,
    onSuccess: (response) => {

      toast.success('Utilisateur modifié avec succès', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      updateUser(response.data)

      setBackdrop({active: false})

    },
    onError: ({response}) => {
        
      setError('root.serverError', { 
        message: response.data.msg || "Une erreur s'est produite lors de la modification"
        // message: "Une erreur s'est produite lors de la connexion"
      })
      toast.error('Une Erreur s\'est produite', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
      setBackdrop({active: false})

    }

})


const handleClick = async (data) => {

  setBackdrop({active: true})

  if( data?.profilPic && data?.profilPic !== user?.user?.profil_pic )
  { 

      await uploadFile(data.profilPic)
      .then((s3Link) => {
          data.profilPic = s3Link.Location
          mutate(data)
      })
      .catch((err) => {

        toast.error("Une erreur s'est produite lors de l'upload de l'image", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });

        setBackdrop({active: false})

      })
  
  }
  else{
    mutate(data)
  }

};

  return (

    <>

      <Card className="mx-3 mt-6 mb-6 lg:mx-4">

        {/* <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">
          <div className='flex items-center' >
            <Tooltip content="Retour">
              <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                <AiOutlineArrowLeft color='white' size={18} />
              </button>
            </Tooltip>
            <Typography variant="h6" color="blue-gray">
              Mon compte
            </Typography>
          </div>
        </CardHeader> */}

        <div className="p-4 flex flex-col ">

          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div {...getRootProps({ className: 'dropzone overflow-hidden bg-blue-gray-200 w-[140px] h-[130px] mb-2 rounded-[5px] ' })}>
                <input {...getInputProps()} />
                <div className=' flex-1 flex h-full text-[12px] justify-center items-center '>

                  {!isDragActive &&

                    <>

                      {watchPhotoAdd ?

                        <div className="render_albums relative w-full h-full" >

                          <img
                            src={file}
                            className="object-cover w-full h-full "
                            // style={img}
                            // Revoke data uri after image is loaded
                            // onLoad={() => { URL.revokeObjectURL(file.preview) }}
                          />

                          <div className="transition-all gap-x-6 duration-500 items-center view-shadow px-2 absolute flex flex-row h-[35px] w-full bottom-0 bg-[rgba(9,28,43,0.6)] " >

                            <button 
                              // disabled={isLoading} 
                              onClick={() => { setValue('profilPic', null, { shouldDirty: true }), setfile(null) }} className="full gap-x-1 flex flex-row justify-center items-center text-white " >
                              <AiFillCloseCircle size={18} />
                              {/* Supprimer */}
                            </button>

                            <button 
                              // disabled={isLoading}
                              onClick={open} className="full gap-x-1 flex flex-row justify-center items-center text-white " >
                              <AiFillEdit size={18} />
                              {/* Modifier */}
                            </button>

                          </div>

                        </div>

                        :

                        <div className="flex flex-col relative text-center text-[9px] justify-center items-center gap-y-1" >

                          {/* Cliquez ici pour ajouter une image du moyen de transport ! <br/>
                                                                    <em>(Only *.jpeg and *.png images will be accepted)</em> */}
                          <button onClick={open} className=" bottom-0 absolute px-4 py-2 rounded-md mt-2 bg-white cursor-pointer" >Selectionner</button>
                          <BsCardImage size={100} />

                        </div>

                      }

                    </>

                  }

                  {isDragActive && !isDragReject && "Drop it like it's hot!"}
                  {isDragReject && "File type not accepted, sorry!"}

                </div>
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {user?.user?.lastname ?? "-"} {user?.user?.firstname ?? ""}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {user?.user?.role?.role_name ?? "-"}
                </Typography>

                <Chip
                  variant="gradient"
                  color={user?.user?.is_suspend ? "red" : "green"}
                  value={user?.user?.is_suspend ? "Suspendu" : "Activé"}
                  className="py-2 px-2 text-[12.5px] font-medium mt-2 "
                /> 

              </div>
            </div>
          </div>

          <div className=" w-full md:w-[50%] flex-col flex gap-[20px]">

            <div className="col-span-2 flex flex-col ">
              <h5 className="col-span-2 font-bold text-black mb-3">Informations générales</h5>
              <div className="flex flex-col w-full mt-3 gap-y-[20px] " >

                <Controller
                  render={({
                  field: { onChange, value, ref},
                  fieldState: { invalid, error}
                  }) => (
                    <div>
                      <Input
                        label="Nom"
                        type="text" color="blue-gray"
                        onChange={onChange}
                        value={value}
                        ref={ref}
                      />
                      {error && <span className=" text-[12px] text-red-500 " >{error?.message}</span>}
                    </div>
                  )}
                  name="lastname"
                  control={control}
                />

                <Controller
                  render={({
                  field: { onChange, value, ref},
                  fieldState: { invalid, error}
                  }) => (
                    <div>
                      <Input
                        label="Prénom"
                        type="text" color="blue-gray"
                        onChange={onChange}
                        value={value}
                        ref={ref}
                      />
                      {error && <span className=" text-[12px] text-red-500 " >{error?.message}</span>}
                    </div>
                  )}
                  name="firstname"
                  control={control}
                />

                <Controller
                  render={({
                  field: { onChange, value, ref},
                  fieldState: { invalid, error}
                  }) => (
                    <div>
                      <Input
                        label="Email"
                        type="email" color="blue-gray"
                        onChange={onChange}
                        value={value}
                        ref={ref}
                      />
                      {error && <span className=" text-[12px] text-red-500 " >{error?.message}</span>}
                    </div>
                    )}
                  name="email"
                  control={control}
                />
                  

                <Controller
                  render={({
                    field: { onChange, value, ref},
                    fieldState: { invalid, error}
                  }) => (
                    <div>
                      <Input
                        label="Téléphone"
                        type="tel" color="blue-gray"
                        onChange={onChange}
                        value={value}
                        ref={ref}
                      />
                      {error && <span className=" text-[12px] text-red-500 " >{error?.message}</span>}
                    </div>
                  )}
                  name="phoneNumber"
                  control={control}
                />


                <div className="self-start flex items-center justify-center pt-4">
                    <button onClick={handleSubmit(handleClick)} disabled={!isDirty} className=" bg-primary disabled:bg-blue-gray-400 text-[14px] text-white px-4 py-2 rounded-md  ">
                      Mettre à jour
                    </button>
                </div>

              </div>
            </div>

            <UpdatePsw/>

          </div>

        </div>

      </Card>

    </>

  );
}

export default Profile;

const SubmitButton = styled.button`
  height: 45px;
  background: #0F123E;
  color: white;
  border: 2px solid #0000;
  border-radius: 7px;
  transition: all 0.2s ease-in-out;
  &.loading {
    background: white !important;
    color: #0F123E !important;
    border: 2px solid #0F123E !important;;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    background: #0F123EEE;
    color: white;
    border: 2px solid #0000;
    transition: all 0.2s ease-in-out;
  }
`;