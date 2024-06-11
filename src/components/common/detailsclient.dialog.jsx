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
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"


function DetailsClient() {

    const { setDialogue, dialogue } = useDialogueStore()
    const queryClient = useQueryClient();

    const schema = yup.object({
        civility: yup.string().required('La civilité est requise').oneOf(["Monsieur", "Madame", "Structure"], "Selectionner une civilité"),
        firstname: yup.string().when(['civility'], ([civility], schema) => {
            if (civility !== 'Structure') 
            {
                return schema.required("Le prenom est requis").max(45, "45 caractères maximum")
            }
            else {
                return schema.nullable()
            }
        }),
        lastname: yup.string().when(['civility'], ([civility], schema) => {
            if (civility !== 'Structure') 
            {
                return schema.required("Le nom est requis").max(45, "45 caractères maximum")
            }
            else {
                return schema.nullable()
            }
        }),
        adressePhysique: yup.string().when(['civility'], ([civility], schema) => {
            if (civility !== 'Structure') 
            {
                return schema.required("L'addresse physique est requise").max(180, "180 caractères maximum")
            }
            else {
                return schema.nullable()
            }
        }),
        phoneNumber: yup.string('Entrez le numéro de téléphone').required().test("tel", "Télephone Invalide" , (value) => {
            if (isValidPhoneNumber(value)) {  
              return true;
            }
            return false;
        }),
        email: yup.string().email('Format email invalide'),
        numeroUfu: yup.string().when(['civility'], ([civility], schema) => {
            if (civility == 'Structure') 
            {
                return schema.trim().required('Le numéro UFU est requis').max(14)
            }
            else {
                return schema.nullable()
            }
        }),
        profession: yup.string().trim().max(45).nullable(),
        fullnameFather: yup.string().trim().max(180).nullable(),
        fullnameMonther: yup.string().trim().max(180).nullable(),
        maritalStatus: yup.string().when(['civility'], ([civility], schema) => {
            if (civility !== 'Structure') 
            {
                return schema.trim().required('Le statut matrimonial est requis').oneOf(["Single", "Maried", "Divorced"])
            }
            else {
                return schema.nullable()
            }
        }),
        fullnameConjoint:yup.string().when(['maritalStatus'], ([maritalStatus], schema) => {
            if (maritalStatus == 'Maried') 
            {
                return schema.trim().required('Le nom complet conjoint(e) est requis').max(180)
            }
            else {
                return schema.nullable()
            }
        }),
        formeStructure: yup.string().when(['civility'], ([civility], schema) => {

            if (civility == 'Structure') 
            {
                return schema.trim().required('La forme de la structure est requise').oneOf([
                    "Société Anonyme (SA)", 
                    "Société A Responsabilité Limitée (SARL)", 
                    "Société par Action Simplifiée (SAS)",
                   "Société Civile Immobilière (SCI)",
                   "Société Civile Professionnelle (SCP)" ,
                   "Association (Ass)",
                   "Organisation Non Gouvernementale (ONG)",
                   "Autre"
                ], 'La forme de la structure est requise')
            }
            else {
                return schema.nullable()
            }
        }),
        denomination: yup.string().when(['civility'], ([civility], schema) => {
            if (civility == 'Structure') 
            {
                return schema.trim().required("La denomination de la société est requise")
            }
            else {
                return schema.nullable()
            }
        }),
        adresseSiege: yup.string().when(['civility'], ([civility], schema) => {
            if (civility == 'Structure') 
            {
                return schema.trim().required("L'addresse physique du siège est requise")
            }
            else {
                return schema.nullable()
            }
        }),
        numeroRcc: yup.string().when(['civility'], ([civility], schema) => {
            if (civility == 'Structure') 
            {
                return schema.trim().required('Le numéro RCC est requis').max(45)
            }
            else {
                return schema.nullable()
            }
        }),
    }).required();

    const { control, handleSubmit, setError, watch, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstname: dialogue?.data?.firstname,
            lastname: dialogue?.data?.lastname,
            adressePhysique: dialogue?.data?.adresse_physique,
            denomination: dialogue?.data?.denomination,
            phoneNumber: dialogue?.data?.phone_number,
            email: dialogue?.data?.email,
            civility: dialogue?.data?.civility,
            profession: dialogue?.data?.profession,
            maritalStatus: dialogue?.data?.marital_status,
            numeroUfu: dialogue?.data?.numero_ufu,
            numeroRcc: dialogue?.data?.numero_rcc,
            fullnameFather: dialogue?.data?.fullname_father,
            fullnameMonther: dialogue?.data?.fullname_monther,
            fullnameConjoint: dialogue?.data?.fullname_conjoint,
            formeStructure: dialogue?.data?.forme_structure,
            adresseSiege: dialogue?.data?.adresse_siege,
        }
    });

    const civilityWatch = watch('civility')

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

            <DialogHeader className='text-sm ' >Modifier un client</DialogHeader>


            <DialogBody className=" flex flex-col" divider>

                {errors.root?.serverError &&
                    <span className=" text-[11px] text-center mb-3 text-red-400" >{errors.root?.serverError.message}</span>
                }

                <div className=' w-full flex flex-row flex-wrap justify-center px-5 md:px-8 mt-[20px] gap-y-[20px] gap-x-[30px]' >

                    <div className="min-w-[280px] flex flex-col flex-1 " >
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
                                        <option value=""></option>
                                        <option value="Monsieur">Monsieur</option>
                                        <option value="Madame">Madame</option>
                                        <option value="Structure">Structure</option>
                                    </select>
                                    { error && 
                                        <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                    }  
                                </div>
                            }
                        />
                    </div>

                </div>

                <div className=' w-full flex flex-row flex-wrap justify-center mt-[20px] px-5 md:px-8 gap-y-[20px] gap-x-[30px]' >

                    {civilityWatch !== 'Structure' &&

                        <>
                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Nom du client (*)</label>
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

                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Prenom du client (*)</label>
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

                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Adresse Physique (*)</label>
                                <Controller
                                    name="adressePhysique"
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
                        </>

                    }

                    <div className="min-w-[280px] flex flex-col flex-1" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Numéro de téléphone (*)</label>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ 
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error }, 
                            }) => 
                                <div className=" w-full " >
                                    {/* <Input onChange={onChange} value={value} placeholder='+229 xxxxxxxx' type="tel" color="blue-gray" label="Téléphone" size="lg" error={invalid} /> */}
                                    <PhoneInput
                                        country={"bj"}
                                        value={value}
                                        containerClass="h-[42px] w-full !bg-transparent"
                                        inputClass=" !h-full !w-full !text-[13px] !font-normal !bg-transparent"
                                        enableLongNumbers={true}
                                        onChange={(val) => {
                                            const parsedNumber = parsePhoneNumber("+" + val)
                                            if (parsePhoneNumber("+" + val)?.number && parsedNumber?.number) {
                                                onChange(parsedNumber.number)
                                            } else {
                                                onChange("+" + val)
                                            }
                                        }}
                                    />
                                    {error &&
                                        <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                                    }
                                </div>
                            }
                        />
                    </div>

                    <div className="min-w-[280px] flex flex-col flex-1 " >
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


                    {civilityWatch !== 'Structure' &&

                        <>
                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Nom complet du père</label>
                                <Controller
                                    name="fullnameFather"
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

                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Nom complet de la mère</label>
                                <Controller
                                    name="fullnameMonther"
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

                            <div className="min-w-[280px] flex flex-col flex-1" >
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

                            
                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Status Matrimonial (*)</label>
                                <Controller
                                    name="maritalStatus"
                                    control={control}
                                    render={({ 
                                        field: { ref, onChange, value, ...field },
                                        fieldState: { invalid, error }, 
                                    }) => 
                                        <div className="w-full" >
                                            <select disabled={true} ref={ref} onChange={onChange} value={value} className=" w-full text-[14px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 " {...field}>
                                                <option value=""></option>
                                                <option value="Single">Célibataire</option>
                                                <option value="Maried">Marié</option>
                                                <option value="Divorced">Divorcé</option>
                                            </select>
                                            { error && 
                                                <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                            }  
                                        </div>
                                    }
                                />
                            </div>

                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Nom complet conjoint(e)</label>
                                <Controller
                                    name="fullnameConjoint"
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
                        </>
                    }
                    

                    <div className="min-w-[280px] flex flex-col flex-1" >
                        <label className=" text-[14px] text-gray-800 font-semibold " >Numéro IFU (*)</label>
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

                    
                    {civilityWatch == 'Structure' &&

                        <>

                            <div className="min-w-[280px] flex flex-col flex-1" >   
                                <label className=" text-[14px] text-gray-800 font-semibold " >Forme de la structure (*)</label>
                                <Controller
                                    name="formeStructure"
                                    control={control}
                                    render={({ 
                                        field: { ref, onChange, value, ...field },
                                        fieldState: { invalid, error }, 
                                    }) => 
                                        <div className="w-full" >
                                            <select disabled={true} ref={ref} onChange={onChange} value={value} className=" w-full text-[14px] h-[45px] border-[1.5px] border-gray-400 !placeholder:text-[12px] rounded-md px-2 " {...field}>
                                                <option value=""></option>
                                                <option value="Société Anonyme (SA)">Société Anonyme (SA)</option>
                                                <option value="Société A Responsabilité Limitée (SARL)">Société A Responsabilité Limitée (SARL)</option>
                                                <option value="Société par Action Simplifiée (SAS)">Société par Action Simplifiée (SAS)</option>
                                                <option value="Société Civile Immobilière (SCI)">Société Civile Immobilière (SCI)</option>
                                                <option value="Société Civile Professionnelle (SCP)">Société Civile Professionnelle (SCP)</option>
                                                <option value="Association (Ass)">Association (Ass)</option>
                                                <option value="Association (Ass)">Organisation Non Gouvernementale (ONG)</option>
                                                <option value="Autres">Autres</option>
                                            </select>
                                            { error && 
                                                <span className=" text-[10px] text-red-400 mt-1" >{error.message}</span>
                                            }  
                                        </div>
                                    }
                                />
                            </div>

                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Adresse Siège (*)</label>
                                <Controller
                                    name="adresseSiege"
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

                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Dénomination de la société (*)</label>
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

                            <div className="min-w-[280px] flex flex-col flex-1" >
                                <label className=" text-[14px] text-gray-800 font-semibold " >Numero RCC (*)</label>
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

                        </>

                    }

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