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
import { ClientApi } from '@/api/api';


function DetailsClient() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();

    const schema = yup.object({
        firstname: yup.string().when(['civility'], ([civility], schema) => {
            if (civility !== 'Societe') 
            {
                return schema.required("Le prenom est requis")
            }
            else {
                return schema.nullable()
            }
        }),
        lastname: yup.string().when(['civility'], ([civility], schema) => {
            if (civility !== 'Societe') 
            {
                return schema.required("Le nom est requis")
            }
            else {
                return schema.nullable()
            }
        }),
        denomination: yup.string().when(['civility'], ([civility], schema) => {
            if (civility == 'Societe') 
            {
                return schema.required("La denomination de la société est requise")
            }
            else {
                return schema.nullable()
            }
        }),
        phoneNumber: yup.string().trim().required('Le numéro de téléphone est requis'),
        email: yup.string().email('Format email invalide').nullable(),
        civility: yup.string().required('La civilité est requise').oneOf(["Monsieur", "Madame", "Societe"]),
        profession: yup.string().trim().required('La profession est requise').max(45),
        maritalStatus: yup.string().trim().required('Le statut marital est requis').oneOf(["Single", "Maried", "Divorced"]),
        numeroUfu: yup.string().trim().required('Le numéro UFU est requis').max(14),
        numeroRcc: yup.string().trim().required('Le numéro RCC est requis').max(45),
    }).required();

    const { control, handleSubmit, setError, watch, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstname: dialogue?.data?.firstname,
            lastname: dialogue?.data?.lastname,
            denomination: dialogue?.data?.denomination,
            phoneNumber: dialogue?.data?.phone_number,
            email: dialogue?.data?.email,
            civility: dialogue?.data?.civility,
            profession: dialogue?.data?.profession,
            maritalStatus: dialogue?.data?.marital_status,
            numeroUfu: dialogue?.data?.numero_ufu,
            numeroRcc: dialogue?.data?.numero_rcc,
        }
    });

    const watchCivility = watch("civility");


    const { mutate, isLoading } = useMutation({

        mutationFn: async (data) => {
            return ClientApi.updateClient(data, dialogue?.data?.id)
        },
        gcTime: 0,
        onSuccess: (response) => {

            setDialogue({
                size: "sm",
                open: false,
                view: null,
                data: null
            })

            toast.success('Client Modifié avec succès', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            queryClient.setQueriesData(["getClient"], (dataClient) => {
                const indexUpdateCollabo = dataClient.data.findIndex((client) => client.id == response?.data?.id )
                const nextData = produce(dataClient, draftData => {
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
        // console.log(data)
    };


    return (

        <>

            <DialogHeader className='text-sm ' >Ajouter un nouveau client</DialogHeader>


            <DialogBody className=" flex flex-col" divider>

                {errors.root?.serverError &&
                    <span className=" text-[11px] text-center mb-3 text-red-400" >{errors.root?.serverError.message}</span>
                }

                
                <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >

                    <div className="min-w-[280px] w-[300px] md:w-[620px]" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Civilité</label>
                        <Controller
                            name="civility"
                            control={control}
                            render={({ 
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error }, 
                            }) => 
                                <div className="w-full" >
                                    <select disabled={true} ref={ref} onChange={onChange} value={value} className=" w-full text-[14px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 " {...field}>
                                        <option disabled value="Monsieur">Monsieur</option>
                                        <option disabled value="Madame">Madame</option>
                                        <option disabled value="Societe">Societé</option>
                                    </select>
                                    { error && 
                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                    }  
                                </div>
                            }
                        />
                    </div>

                </div>

                { watchCivility !== 'Societe' &&
                    <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >


                        <div className="min-w-[280px] w-[300px]" >
                            <label className=" text-[14px] text-gray-800 font-semibold " >Nom du client</label>
                            <Controller
                                name="lastname"
                                control={control}
                                render={({ 
                                    field: { ref, onChange, value, ...field },
                                    fieldState: { invalid, error }, 
                                }) => 
                                    <div className="w-full" >
                                        <input 
                                            disabled={true} ref={ref} onChange={onChange} value={value}
                                            className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                        />
                                        { error && 
                                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                        }  
                                    </div>
                                }
                            />
                        </div>


                        <div className="min-w-[280px] w-[300px]" >
                            <label className=" text-[14px] text-gray-800 font-semibold " >Prenom du client</label>
                            <Controller
                                name="firstname"
                                control={control}
                                render={({ 
                                    field: { ref, onChange, value, ...field },
                                    fieldState: { invalid, error }, 
                                }) => 
                                    <div className="w-full" >
                                        <input 
                                            disabled={true} ref={ref} onChange={onChange} value={value}
                                            className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                        />
                                        { error && 
                                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                        }  
                                    </div>
                                }
                            />
                        </div>

                    </div>
                }

                {watchCivility === 'Societe' &&
                    <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >

                        <div className="min-w-[280px] w-[300px]" >
                            <label className=" text-[14px] text-gray-800 font-semibold " >Dénomination de la société</label>
                            <Controller
                                name="denomination"
                                control={control}
                                render={({ 
                                    field: { ref, onChange, value, ...field },
                                    fieldState: { invalid, error }, 
                                }) => 
                                    <div className="w-full" >
                                        <input 
                                            disabled={true} ref={ref} onChange={onChange} value={value}
                                            className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                        />
                                        { error && 
                                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                        }  
                                    </div>
                                }
                            />
                        </div>

                        <div className="min-w-[280px] w-[300px]" >
                            <label className=" text-[14px] text-gray-800 font-semibold " >Numéro de téléphone</label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ 
                                    field: { ref, onChange, value, ...field },
                                    fieldState: { invalid, error }, 
                                }) => 
                                    <div className="w-full" >
                                        <input 
                                            type="tel"
                                            disabled={true} ref={ref} onChange={onChange} value={value}
                                            className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                        />
                                        { error && 
                                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                        }  
                                    </div>
                                }
                            />
                        </div>

                    </div>
                }

                { watchCivility !== 'Societe' &&
                    <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >

                        <div className="min-w-[280px] w-[300px] md:w-[620px]" >
                            <label className=" text-[14px] text-gray-800 font-semibold " >Numéro de téléphone</label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ 
                                    field: { ref, onChange, value, ...field },
                                    fieldState: { invalid, error }, 
                                }) => 
                                    <div className="w-full" >
                                        <input 
                                            type="tel"
                                            disabled={true} ref={ref} onChange={onChange} value={value}
                                            className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                        />
                                        { error && 
                                            <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                        }  
                                    </div>
                                }
                            />
                        </div>

                    </div>
                }


                <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >


                    <div className="min-w-[280px] w-[300px] md:w-[620px]" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Adresse e-mail</label>
                        <Controller
                            name="email"
                            control={control}
                            render={({ 
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error }, 
                            }) =>
                                <div className="w-full" >
                                    <input 
                                        type='email'
                                        disabled={true} ref={ref} onChange={onChange} value={value}
                                        className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                    />
                                    { error && 
                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                    }  
                                </div>
                            }
                        />
                    </div>

                </div>


                <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >


                    <div className="min-w-[280px] w-[300px]" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Profession</label>
                        <Controller
                            name="profession"
                            control={control}
                            render={({ 
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error }, 
                            }) => 
                                <div className="w-full" >
                                    <input 
                                        disabled={true} ref={ref} onChange={onChange} value={value}
                                        className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                    />
                                    { error && 
                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                    }  
                                </div>
                            }
                        />
                    </div>


                    <div className="min-w-[280px] w-[300px]" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Status Matrimonial</label>
                        <Controller
                            name="maritalStatus"
                            control={control}
                            render={({ 
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error }, 
                            }) => 
                                <div className="w-full" >
                                    <select disabled ref={ref} onChange={onChange} value={value} className=" w-full text-[14px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 " {...field}>
                                        <option disabled value="Single">Célibataire</option>
                                        <option disabled value="Maried">Marié</option>
                                        <option disabled value="Divorced">Divorcé</option>
                                    </select>
                                    { error && 
                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                    }  
                                </div>
                            }
                        />
                    </div>

                </div>


                <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] gap-y-[20px] gap-x-[30px]' >


                    <div className="min-w-[280px] w-[300px]" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Numéro IFU</label>
                        <Controller
                            name="numeroUfu"
                            control={control}
                            render={({ 
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error }, 
                            }) => 
                                <div className="w-full" >
                                    <input 
                                        disabled={true} ref={ref} onChange={onChange} value={value}
                                        className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                    />
                                    { error && 
                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                    }  
                                </div>
                            }
                        />
                    </div>


                    <div className="min-w-[280px] w-[300px]" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Numero RCC</label>
                        <Controller
                            name="numeroRcc"
                            control={control}
                            render={({ 
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error }, 
                            }) => 
                                <div className="w-full" >
                                    <input 
                                        disabled={true} ref={ref} onChange={onChange} value={value}
                                        className=" w-full text-[12px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 "
                                    />
                                    { error && 
                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                    }  
                                </div>
                            }
                        />
                    </div>

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
                >
                    <span>Fermer</span>
                </Button>

            </DialogFooter>

        </>

    )

}

export default DetailsClient