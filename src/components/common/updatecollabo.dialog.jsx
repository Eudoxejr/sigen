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


function UpdateCollaborateur() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();

    const schema = yup.object({
        firstname: yup.string().required('Le prénom est requis'),
        lastname: yup.string().required('Le nom de famille est requis'),
        roleId: yup.number().required('Le rôle est requis').positive('Le rôle doit être un nombre positif'),
        email: yup.string().email('L\'adresse email doit être valide').required('L\'adresse email est requise'),
        phoneNumber: yup.string()
          .matches(/^\+?\d+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres et peut commencer par un signe +')
          .required('Le numéro de téléphone est requis'),
    }).required();

    const { control, handleSubmit, setError, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstname: dialogue?.data?.firstname,
            lastname: dialogue?.data?.lastname,
            roleId: dialogue?.data?.role_id,
            phoneNumber: dialogue?.data?.phone_number,
            email: dialogue?.data?.email
        }
    });

    const { mutate, isLoading } = useMutation({

        mutationFn: async (data) => {
            return CollaboApi.updateCollabo(data, dialogue?.data?.id)
        },
        gcTime: 0,
        onSuccess: (response) => {

            setDialogue({
                size: "sm",
                open: false,
                view: null,
                data: null
            })

            toast.success('Collaborateur Modifié avec succès', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            console.log(response);

            queryClient.setQueriesData(["getCollabo"], (dataCollabo) => {
                const indexUpdateCollabo = dataCollabo.data.findIndex((collabo) => collabo.id == response?.data?.id )
                const nextData = produce(dataCollabo, draftData => {
                    draftData.data[indexUpdateCollabo] = response?.data
                })

                return nextData;

            })

        },
        onError: ({ response }) => {
            const errorTraited = handleBackendErrors(response.data)
            setError('root.serverError', {
                message: errorTraited || "Une erreur s'est produite"
            })
        }

    })

    const handleClick = async (data) => {
        mutate(data)
    };

    const getRole = async (inputValue) => {
        const res = await RoleApi.getRole(1, 12, inputValue)
        // res.data.unshift({ id: null, role_name: 'Tout les roles' })
        return res.data.map((data) => { return { label: data.role_name, value: data.id } })
      };
    
      const loadRoleOptions = (inputValue) =>
        new Promise((resolve) => {
          resolve(getRole(inputValue))
        }
      );


    return (

        <>

            <DialogHeader className='text-sm ' >Modifier un collaborateur</DialogHeader>


            <DialogBody className=" flex flex-col" divider>

                {errors.root?.serverError &&
                    <span className=" text-[11px] text-center mb-3 text-red-400" >{errors.root?.serverError.message}</span>
                }

                <div className=' w-full flex flex-row flex-wrap justify-center gap-y-[20px] gap-x-[30px]' >
                    <Controller
                        render={({
                            field: { onChange, value, ref },
                            fieldState: { invalid, error }
                        }) => (
                            <div className=" w-full sm:w-[70%] bg-red-[500px] " >

                                <AsyncSelect 
                                    cacheOptions 
                                    ref={ref}
                                    defaultOptions 
                                    loadOptions={loadRoleOptions} 
                                    defaultValue={{
                                        label: dialogue?.data?.role?.role_name,
                                        value: dialogue?.data?.role?.id
                                    }}
                                    styles={{
                                        control: (baseStyles, state) => ({
                                        ...baseStyles,
                                            height: 45,
                                            fontSize: 13,
                                            fontWeight: "400",
                                            color: "red"
                                        }),
                                    }}
                                    placeholder="Sélectionner le rôle"
                                    onChange={(val) => onChange(val.value)}
                                />
                                {error && 
                                    <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                }
                            </div>
                        )}
                        name="roleId"
                        control={control}
                    />

                </div>

                <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >

                    <Controller
                        render={({
                            field: { onChange, value },
                            fieldState: { invalid, error }
                        }) => (
                            <div className=" min-w-[280px] w-[300px] " >
                                <Input onChange={onChange} value={value} type="text" color="blue-gray" label="Nom du collaborateur" size="lg" error={invalid} />
                                {error &&
                                    <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                }
                            </div>
                        )}
                        name="lastname"
                        control={control}
                    />

                    <Controller
                        render={({
                            field: { onChange, value },
                            fieldState: { invalid, error }
                        }) => (
                            <div className=" min-w-[280px] w-[300px] " >
                                <Input onChange={onChange} value={value} type="text" color="blue-gray" label="Prenom du collaborateur" size="lg" error={invalid} />
                                {error &&
                                    <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                }
                            </div>
                        )}
                        name="firstname"
                        control={control}
                    />

                </div>

                <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >

                    <Controller
                        render={({
                            field: { onChange, value },
                            fieldState: { invalid, error }
                        }) => (
                            <div className=" min-w-[280px] w-[300px] " >
                                <Input disabled={true} onChange={onChange} value={value} type="tel" color="blue-gray" label="Email" size="lg" error={invalid} />
                                {error &&
                                    <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                }
                            </div>
                        )}
                        name="email"
                        control={control}
                    />

                    <Controller
                        render={({
                            field: { onChange, value },
                            fieldState: { invalid, error }
                        }) => (
                            <div className=" min-w-[280px] w-[300px] " >
                                <Input onChange={onChange} value={value} placeholder='+229 xxxxxxxx' type="tel" color="blue-gray" label="Téléphone" size="lg" error={invalid} />
                                {error &&
                                    <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                }
                            </div>
                        )}
                        name="phoneNumber"
                        control={control}
                    />

                </div>

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
                    disabled={isLoading || !isDirty}
                >

                    {isLoading ?
                        <BeatLoader color="#fff" size={8} />
                        :
                        <span>Modifier</span>
                    }

                </Button>

            </DialogFooter>

        </>

    )

}

export default UpdateCollaborateur