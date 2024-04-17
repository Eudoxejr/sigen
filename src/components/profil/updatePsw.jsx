import React, {useState} from 'react'
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
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useUserStore } from "@/store/user.store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useDialogueStore } from '@/store/dialogue.store';
import {CollaboApi} from '@/api/api'
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UpdatePsw() {

    const [showPassword, setShowPassword] = useState(false);
    const { setBackdrop } = useDialogueStore()
    const schema = yup.object({

        oldPassword: yup.string().required('Ancien mot de passe requis'),
        password: yup.string()
          .required('Nouveau mot de passe requis')
          .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
            'Le nouveau mot de passe doit Minimum de huit caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial'
          ),
          password_confirmation: yup.string()
          .required('Confirmation du mot de passe requis')
          .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre'),
    
      }).required();
    
    const {control,reset, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
        resolver: yupResolver(schema)
    });

    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
          return CollaboApi.updatePassword(data)
        },
        gcTime:0,
        onSuccess: (response) => {
    
          toast.success('Mot de passe modifié avec succès', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
    
          setBackdrop({active: false})

          reset({
            'oldPassword': '',
            'password': '',
            'password_confirmation': ''
          })
    
        },
        onError: ({response}) => {
            
          setError('root.serverError', { 
            message: response.data.message || "Une erreur s'est produite lors de la modification"
            // message: "Une erreur s'est produite lors de la connexion"
          })
          toast.error(response.data.message || 'Une Erreur s\'est produite', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
          reset({
            'oldPassword': '',
            'password': '',
            'password_confirmation': ''
          })
          setBackdrop({active: false})
    
        }
    
    })

    const handleClick = async (data) => {
        setBackdrop({active: true})
        mutate(data)
    };

  return (
    <div className="flex flex-col">

        <h5 className="col-span-2 font-bold text-black mt-8 mb-3">Changer mon mot de passe</h5>

        <div className="flex flex-col mt-3 gap-y-[20px]">

            <Controller
                render={({
                    field: { onChange, value },
                    fieldState: { invalid, error }
                }) => (
                    <div>
                        <Input
                            onChange={onChange}
                            value={value}
                            label="Ancien mot de passe"
                            type={showPassword ? "text" : "password"} color="blue-gray" size="lg"
                            icon={showPassword ? <BsEye onClick={() => setShowPassword(old => !old)} className="cursor-pointer" /> : <BsEyeSlash onClick={() => setShowPassword(old => !old)} className="cursor-pointer" />}
                        />
                        {error &&
                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                        }
                    </div>
                )}
                name="oldPassword"
                control={control}
            />


            <Controller
                render={({
                    field: { onChange, value },
                    fieldState: { invalid, error }
                }) => (
                    <div>
                        <Input
                            onChange={onChange}
                            value={value}
                            label="Nouveau mot de passe"
                            type={showPassword ? "text" : "password"} color="blue-gray" size="lg"
                            icon={showPassword ? <BsEye onClick={() => setShowPassword(old => !old)} className="cursor-pointer" /> : <BsEyeSlash onClick={() => setShowPassword(old => !old)} className="cursor-pointer" />}
                        />
                        {error &&
                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                        }
                    </div>
                )}
                name="password"
                control={control}
            />



            <Controller
                render={({
                    field: { onChange, value },
                    fieldState: { invalid, error }
                }) => (
                    <div>
                        <Input
                            onChange={onChange}
                            value={value}
                            label="Confirmation du nouveau mot de passe"
                            type={showPassword ? "text" : "password"} color="blue-gray" size="lg"
                            icon={showPassword ? <BsEye onClick={() => setShowPassword(old => !old)} className="cursor-pointer" /> : <BsEyeSlash onClick={() => setShowPassword(old => !old)} className="cursor-pointer" />}
                        />
                        {error &&
                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                        }
                    </div>
                )}
                name="password_confirmation"
                control={control}
            />


            <div className="self-start flex items-center justify-center pt-4">
                <button onClick={handleSubmit(handleClick)} disabled={!isDirty} className=" bg-primary disabled:bg-blue-gray-400 text-[14px] text-white px-4 py-2 rounded-md  ">
                    Changer
                </button>
            </div>

            {/* <SubmitButton
        className={`w-[200px] mt-4`}
        >
        Valider
        </SubmitButton> */}

        </div>

    </div>
  )
}
