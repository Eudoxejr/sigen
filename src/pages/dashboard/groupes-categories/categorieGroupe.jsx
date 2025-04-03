import React, {useState, useMemo, useEffect} from 'react'
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip } from "@material-tailwind/react";
import { useDialogueStore } from '@/store/dialogue.store';
import { CategorieGroupeApi, CategoriesApi } from '@/api/api';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash.debounce';
import { useQueryClient } from "@tanstack/react-query";


export default function CategoriesGroup() {

    const { isLoading, data:groupeCategorie } = useQuery({
		queryKey: ["getAllCategorieGroups"],
		queryFn: async () => {
			return CategorieGroupeApi.getCategorieGroups()
		},
		enabled: true,
        staleTime: 40*60*1000  
	});

    const { setDialogue } = useDialogueStore()

  return (

    <div className=" flex flex-col" >
        
        <div className=" w-full flex flex-col mt-5 items-start gap-x-3 " >
            <span className="font-bold capitalize text-blue-gray-800" >Groupes de catégories</span>
            <Tooltip placement="bottom" content="Ajouter un groupe de catégorie">
                <button 
                    onClick={() => setDialogue({
                        size: "sm",
                        open: true,
                        view: "create-group-categorie",
                        data: null
                    })} 
                    class=' bg-primary text-white px-4 mt-3 py-2 rounded-md text-[13px] font-semibold '
                >
                    Nouveau Groupe
                </button>
            </Tooltip>
        </div>

        <div className=" w-full mt-5 flex flex-row gap-x-6 gap-y-6 flex-wrap " > 
               
            {isLoading &&
                Array.from({ length: 3 }).map((_, key) => (
                    <div key={"groupcategoryskelton"+key} className=" animate-pulse w-[350px] sm:w-[300px] flex  flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-gray-100 to-blue-gray-200 h-[140px] " />
                ))
            }

            {groupeCategorie?.data?.length == 0 ?
                    // <div>Il n'existe aucun groupe de catégorie</div>
                    null
                :
                groupeCategorie?.data?.map((group, key) => (

                    <div key={"groupcategory"+key} className='border border-[#ddd] p-2 min-w-[250px] max-w-[300px] bg-gradient-to-br from-gray-100 to-gray-100 min-h-[150px] rounded-lg'>
            
                        <div className='flex items-center'>
                            {/* <ControlPointDuplicateIcon style={{fontSize:40, color:'#636e72'}} /> */}
                            <div className=''>
                                <h3 className='font-semibold text-[14px] '>{group.group_name}</h3>
                                <h4 className='mt-3 text-[13px] '> <span className='bg-secondary rounded-sm px-3 py-1 font-medium text-primary'>{group.meta.totalCategories} Categorie(s)</span></h4>
            
                                <div className='flex justify-start mt-5 gap-x-[12px]'>
                                    <Tooltip content="Modifier">   
                                        <div 
                                            onClick={() => {
                                                setDialogue({
                                                    size: "sm",
                                                    open: true,
                                                    view: "update-group-categorie",
                                                    data: group
                                                })
                                            }}
                                            className="cursor-pointer" 
                                        >
                                            <CiEdit color='gray' size={23} />
                                        </div>  
                                    </Tooltip>
                                    <Tooltip content="Supprimer">   
                                        <div 
                                            onClick={() => {
                                                setDialogue({
                                                    size: "sm",
                                                    open: true,
                                                    view: "delete-group-categorie",
                                                    data: group
                                                })
                                            }}
                                            className="cursor-pointer " 
                                        >
                                            <MdDeleteForever color='gray' size={23} />
                                        </div>   
                                    </Tooltip>     
                                </div>
            
                            </div>
                        </div>
                    
                    </div>
                ))
            }
            
        </div>

    </div>

  )

}
