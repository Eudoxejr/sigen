import React from 'react'
import { FaLayerGroup } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip } from "@material-tailwind/react";
import { GiBookPile } from "react-icons/gi";
import { useDialogueStore } from '@/store/dialogue.store';
import { CategorieGroupeApi } from '@/api/api';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function CategoriesListe() {

    const navigate = useNavigate();
    const { isLoading, data:groupeCategorie } = useQuery({
		queryKey: ["getAllCategorieGroups"],
		queryFn: async ({ queryKey }) => {
			return CategorieGroupeApi.getCategorieGroups()
		},
		enabled: true,
        staleTime: 40*60*1000  
	});

    const { setDialogue } = useDialogueStore()

  return (

    <div className=" flex flex-col" >
        
        <div className=" w-full flex flex-row mt-5 items-center gap-x-3 " >
            <span className="font-bold text-blue-gray-800" >Groupes de catégories</span>
        </div>

        <div className=" w-full mt-5 flex flex-row gap-x-6 gap-y-6 flex-wrap " > 

            <Tooltip placement="bottom" content="Ajouter des groupes de catégories">
                <div 
                    onClick={() => setDialogue({
                        size: "sm",
                        open: true,
                        view: "create-group-categorie",
                        data: null
                    })} 
                    key={"groupcategoryadd"} className="border-[0.3px] text-white cursor-pointer text-[30px] border-blue-gray-500 w-[80px] flex justify-center items-center rounded-lg bg-gradient-to-br from-primary to-primary h-[80px] " 
                >
                    +
                </div>
            </Tooltip>
                
            {isLoading &&
                Array.from({ length: 3 }).map((_, key) => (
                    <div key={"groupcategoryskelton"+key} className=" animate-pulse w-[350px] sm:w-[300px] flex  flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-gray-600 to-blue-gray-600 h-[140px] " />
                ))
            }

            {groupeCategorie?.data?.length == 0 ?
                    // <div>Il n'existe aucun groupe de catégorie</div>
                    null
                :
                groupeCategorie?.data?.map((group, key) => (

                    <div key={"groupcategory"+key} className="border-[0.5px] border-blue-gray-500 w-[350px] sm:w-[300px] flex  flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-[#2C93EB] to-[#2C93EB] h-[140px] " >
                        
                        <div className=" flex gap-x-4 justify-start" >     
                            <FaLayerGroup color='white' size={22} />
                            <span className=" font-medium text-[14px] leading-[20px] text-white opacity-90 " >{group.group_name}</span>
                        </div>

                        <div className=" flex mt-2 gap-x-3 justify-start " >     
                            <BiSolidCategoryAlt  color='white' size={20} />
                            <span className=" font-thin text-[13px] leading-[20px] text-white opacity-90 " >{group.meta.totalCategories} Categorie(s)</span>
                        </div>

                        <div className="flex mt-5 gap-x-5 justify-start " >  
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
                                    <CiEdit color='white' size={20} />
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
                                    <MdDeleteForever color='white' size={20} />
                                </div>   
                            </Tooltip>                              
                        </div>

                    </div>   
                ))
            }
            
        </div>


        <div className="w-full flex flex-row mt-10 items-center gap-x-3 " >

            <div className="gap-x-3" >
                <span className="font-bold mr-3" >Catégories</span>
                <Tooltip content="Ajouter une catégorie">   
                    <button 
                        onClick={() => navigate("add")}
                        className="px-3 py-[5px] rounded-md bg-primary" >+</button>
                </Tooltip>
            </div>
            
        </div>

        <div className=" w-full mt-5 flex flex-row gap-x-6 gap-y-6 flex-wrap " > 

            {Array.from({ length: 16 }).map(() => (

                <div className=" w-[350px] sm:w-[45%] flex flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-gray-800 to-blue-gray-800 h-[240px] " >
                    
                    <div className=" flex gap-x-4 justify-start" >     
                        <FaLayerGroup color='white' size={15} />
                        <span className=" font-medium text-[14px] leading-[20px] text-white opacity-90 " >Nom de la catégorie</span>
                    </div>

                    <div className=" flex mt-2 gap-x-3 justify-start " >     
                        <BiSolidCategoryAlt  color='white' size={20} />
                        <span className=" font-semibold text-[13px] leading-[20px] text-white opacity-90 " >8 dossiers(s)</span>
                    </div>

                    <div className=" flex mt-4 gap-x-3 justify-start flex-wrap " >  
                        {["Le Bien", "Etat Civil", "Les Finances"].map((val, index) => (   
                            <span key={index} className=" font-thin text-[13px] leading-[20px] text-white opacity-90 " >{`${val} (1)`}</span>
                        ))}
                    </div>


                    <div className=" flex mt-4 gap-x-3 justify-start " >     
                        <GiBookPile  color='white' size={20} />
                        <span className=" font-semibold text-[13px] leading-[20px] text-white opacity-90 " >2 template(s) de minute </span>
                    </div>

                    <div className="flex mt-5 gap-x-5 justify-start " >  
                        <Tooltip content="Modifier">   
                            <div className="cursor-pointer " >
                                <CiEdit color='white' size={20} />
                            </div>  
                        </Tooltip>
                        <Tooltip content="Supprimer">   
                            <div className="cursor-pointer " >
                                <MdDeleteForever color='white' size={20} />
                            </div>   
                        </Tooltip>                              
                    </div>

                </div>   
                
            ))}  

        </div>

    </div>

  )

}
