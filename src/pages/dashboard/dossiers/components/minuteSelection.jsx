import React, {useState} from 'react'
import { FaFolderMinus, FaFolder } from "react-icons/fa";
import { TemplateApi, FoldersApi } from "@/api/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { useDialogueStore } from '@/store/dialogue.store';
import { FaEye } from "react-icons/fa";
import { FaRegFileWord } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function MinuteSelection({modal}) {

    const { setDialogue } = useDialogueStore()
    const {state} = useLocation();
    const navigate = useNavigate();

    const [templateSelected, settemplateSelected] = useState(null)

    const { data: templateList, isFetching } = useQuery({
        queryKey: [
            "getMinuteSelection", 
            1,
            30,
            undefined,
            [state?.category_id]
        ],
        queryFn: async ({ queryKey }) => {
            return TemplateApi.getTemplate(queryKey[1], queryKey[2], queryKey[3], queryKey[4] )
        },
        enabled: true,
        staleTime: 15 * 60 * 1000
    })

    const { mutate, isLoading } = useMutation({

        mutationFn: async (data) => {
            return FoldersApi.updateFolders(state?.id, {templateId: templateSelected})
        },
        gcTime: 0,
        onSuccess: (response) => {

            toast.success('Exemplaire de minute Ajouté avec succès', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            navigate("/dashboard/dossiers/view", {
                replace: true,
                state: { ...state, ...response.data },
            });

            if (modal) {
                setDialogue({
                    size: "sm",
                    open: false,
                    view: null,
                    data: null
                })
            }

        },
        onError: ({ response }) => {
            toast.error('Une erreur s\'est produite lors du choix du template', {
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

  return (
    <div className=" w-[95%] px-6 self-center flex flex-col bg-white rounded-lg mt-8 items-center justify-center " >
        <div className=" w-full self-center flex flex-wrap gap-y-5 gap-x-[4%] mb-[30px] mt-[50px] " >

            <div className=" w-full md:w-[90%] flex flex-col font-medium flex-wrap text-[16px] " >
                Liste des Exemplaires de Minute Disponibles pour cette catégorie<br/>
                <br/>
                <span className=' text-[13px] font-normal ' >Sélectionnez un exemplaire dans la liste ci-dessous pour poursuivre la génération de la minute. Vous pourrez prévisualiser son contenu avant validation.</span>
            </div>

            <div className=" w-full md:w-[90%] flex font-medium flex-wrap " >
                {isFetching && [1,2,3].map(() => 
                    <div 
                        // key={"minuteForSelected"+key}
                        className={` m-4 pt-1 animate-pulse bg-gray-100 border flex flex-col items-center justify-between rounded-md w-[200px] h-[120px] border-gray-300`}
                    />
                )}
                {templateList?.data?.map((item, key) => (
                    <div 
                        key={"minuteForSelected"+key}
                        className={` m-4 pt-1 bg-gray-100 border flex flex-col items-center justify-between rounded-md w-[200px] h-[120px] ${templateSelected === item?.id ? "border-green-500 border-2 shadow-sm" : "border-gray-300 "} `}
                    >
                        <div className="w-full flex justify-end items-center gap-x-3 " >
                            <FaEye
                                onClick={() => setDialogue({
                                    size: "lg",
                                    open: true,
                                    view: "view-template",
                                    data: {
                                        url: item?.url,
                                        isUpdate: false
                                    }
                                })} 
                                size={22} 
                                className="text-gray-600 mr-2 cursor-pointer " 
                            />
                            {/* <MdMoreVert size={22} className="text-gray-600 " /> */}
                        </div>
                        <div  
                            onClick={() => settemplateSelected(item?.id)}
                            className='cursor-pointer flex flex-1 w-full flex-col justify-center items-center ' 
                        >
                            <FaRegFileWord size={50} className=" text-gray-600 " />
                            <h4 className="text-center text-[12px] line-clamp-2 mt-2 mb-2 px-2 text-blue-gray-700 font-medium ">{item?.template_name}</h4>
                        </div>
                    </div>
                ))}
            </div>

        </div>
        <div className=" w-full mb-5 self-center flex flex-row justify-end gap-x-5 " >
            <button    
                onClick={() => mutate()} 
                disabled={!templateSelected || isLoading}
                className=" bg-primary disabled:bg-blue-gray-400 font-medium text-[14px] text-white px-4 py-2 rounded-md  " 
            >
                {isLoading ? "Loading" :"Valider le choix"}
            </button>
        </div>
    </div>
  )
}
