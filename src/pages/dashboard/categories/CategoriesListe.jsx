import React, {useState, useMemo, useEffect} from 'react'
import { FaLayerGroup } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip } from "@material-tailwind/react";
import { GiBookPile } from "react-icons/gi";
import { useDialogueStore } from '@/store/dialogue.store';
import { CategorieGroupeApi, CategoriesApi } from '@/api/api';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaFolderMinus } from "react-icons/fa";
import debounce from 'lodash.debounce';
import { useQueryClient } from "@tanstack/react-query";
import AsyncSelect from 'react-select/async'
import Pagination from '@mui/material/Pagination';

export default function CategoriesListe() {

    const queryClient = useQueryClient();
    const allQuery = queryClient.getQueriesData(["getAllCategories"])
    const categoriesMeta = allQuery?.[allQuery.length - 1]?.[1]?.meta

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(categoriesMeta?.keyword || null);
    const [groupeCat, setGroupeCat] = useState(null);
    const [pagination, setPagination] = useState({
        page: (categoriesMeta?.current_page - 1) || 0, 
        pageSize: categoriesMeta?.per_page || 25
    })

    const { isLoading, data:groupeCategorie } = useQuery({
		queryKey: ["getAllCategorieGroups"],
		queryFn: async ({ queryKey }) => {
			return CategorieGroupeApi.getCategorieGroups()
		},
		enabled: true,
        staleTime: 40*60*1000  
	});

    const { isLoading:isLoadingCat, data:categories } = useQuery({
		queryKey: ["getAllCategories",  pagination.page+1, pagination.pageSize, searchTerm, groupeCat],
		queryFn: async ({ queryKey }) => {
			return CategoriesApi.getCategories(queryKey[1], queryKey[2], queryKey[3], queryKey[4])
		},
		enabled: true,
        staleTime: 40*60*1000  
	});
    
    const getGroup = async (inputValue) => {
        const res = await CategorieGroupeApi.getCategorieGroups(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.group_name, value: data.id } })
    };

    const loadOptionsGroupCategorie = (inputValue) => 
        new Promise((resolve) => {
            resolve(getGroup(inputValue))
        });

    const { setDialogue } = useDialogueStore()


    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const debouncedResults = useMemo(() => {
        return debounce(handleChange, 600);
    }, []);

    useEffect(() => {
        return () => {
          debouncedResults.cancel();
        };
    }, []);


  return (

    <div className=" flex flex-col" >
        
        <div className=" w-full flex flex-row mt-5 items-center gap-x-3 " >
            <span className="font-bold capitalize text-blue-gray-800" >Groupes de catégories</span>
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
                    <div key={"groupcategoryskelton"+key} className=" animate-pulse w-[350px] sm:w-[300px] flex  flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-gray-100 to-blue-gray-200 h-[140px] " />
                ))
            }

            {groupeCategorie?.data?.length == 0 ?
                    // <div>Il n'existe aucun groupe de catégorie</div>
                    null
                :
                groupeCategorie?.data?.map((group, key) => (

                    <div key={"groupcategory"+key} className='border border-[#ddd] p-2 min-w-[250px] max-w-[300px] rounded-lg'>
            
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


        <div className="w-full flex flex-row mt-10 flex-wrap gap-y-4 items-center justify-between gap-x-3 " >

            <div className="gap-x-3" >
                <span className="font-bold mr-3" >Catégories</span>
                <Tooltip content="Ajouter une catégorie">   
                    <button 
                        onClick={() => navigate("add")}
                        className="px-3 py-[5px] text-white rounded-md bg-primary" >+</button>
                </Tooltip>
            </div>

            <AsyncSelect 
                cacheOptions 
                defaultOptions 
                loadOptions={loadOptionsGroupCategorie} 
                isMulti
                styles={{
                    control: (baseStyles, state) => ({
                    ...baseStyles,
                        minHeight: 42,
                        fontSize: 13,
                        width: 300,
                        fontWeight: "400",
                        color: "red"
                    }),
                }}
                placeholder="Filtrer par proupe de catégorie"
                onChange={(val) => {val.length > 0 ? setGroupeCat(val.map((item) => {return item.value})) : setGroupeCat(null) } }
            />

            <div class='w-[250px]'>

                <div className="relative flex items-center w-full h-[42px] rounded-lg focus-within:shadow-md bg-blue-gray-800 overflow-hidden">

                <div className="grid place-items-center h-full w-12 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <input
                    className="peer bg-blue-gray-800 h-full w-full outline-none text-[12.5px] text-white pr-2"
                    type="search"
                    id="search"
                    defaultValue={searchTerm}
                    placeholder="Recherche..."
                    onChange={debouncedResults}
                />

                </div>

            </div>
            
        </div>
        

        <div className=" w-full mt-9 flex flex-row gap-x-8 gap-y-6 flex-wrap " > 

            { isLoadingCat &&
                Array.from({ length: 3 }).map((_, key) => (
                    <div key={"categoryskelton"+key} className=" animate-pulse w-[350px] sm:w-[45%] flex h-[240px] flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-gray-100 to-blue-gray-200 " />
                ))
            }

            {categories?.data?.length == 0 ?
                    // <div>Il n'existe aucun groupe de catégorie</div>
                    null
                :
                categories?.data?.map((category, key) => (

                    <div key={"category"+key} className="border border-[#ddd] w-[280px] sm:w-[30%] flex flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-gray-100 to-gray-100 min-h-[150px] ">
            
                        <div className=" flex gap-x-4 justify-start items-center" >     
                            <FaLayerGroup className="text-gray-800" size={16} />
                            <span className=" font-medium text-[14px] leading-[20px] text-gray-800 opacity-90 " >{category.category_name}</span>
                        </div>

                        <div className=" flex mt-4 gap-x-3 justify-start " >     
                            <GiBookPile className="text-gray-800" size={16} />
                            <span className=" font-semibold text-[13px] leading-[20px] text-gray-800 opacity-90 " >0 Template(s) de minute </span>
                        </div>

                        <div className=" w-full flex flex-row justify-between " >
                            <div className=" flex mt-4 gap-x-3 justify-start items-center " >     
                                {/* <BiSolidCategoryAlt className="text-gray-800" size={20} /> */}
                                <span className=" font-semibold text-[13px] leading-[20px] text-gray-800 opacity-90 " >Slug: <span className=" uppercase " >{category?.category_slug}</span></span>
                            </div>
                            {/* <div className=" flex mt-4 gap-x-3 justify-start items-center " >     
                                <span className=" font-semibold text-[13px] leading-[20px] text-gray-800 opacity-90 " >Couleur: </span>
                                <span style={{ backgroundColor: category?.category_color }} className={" rounded-md w-[40px] h-[30px] " } />
                            </div> */}
                        </div>

                        <div style={{ backgroundColor: category?.category_color }} className=" h-[40px] w-[97%] overflow-x-auto items-start px-4 self-center flex flex-row gap-x-6 rounded-md mt-4 " >

                            {/* {category?.subCategories?.map((subCat, key) => (
                                <div key={'subcat'+key} className=" flex flex-col justify-center items-center w-[100px] ">
                                    <FaFolderMinus size={80} color={subCat?.is_minutier ? "#2C93EB" : "#FFC312"} />
                                    <span className="text-center text-[12px] line-clamp-2 ">{subCat.sub_category_name}</span>
                                </div>
                            ))} */}

                        </div>

                            <div className='flex justify-start mt-5 gap-x-[5px]'>
                                <Tooltip content="Modifier">   
                                    <div 
                                        onClick={() => navigate("/dashboard/categories/edit", { state: category }) }
                                        className="cursor-pointer px-2 gap-x-2 flex flex-row "
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
                                                view: "delete-categorie",
                                                // data: group
                                            })
                                        }}
                                        className="cursor-pointer px-2 gap-x-2 flex flex-row" 
                                    >
                                        <MdDeleteForever color='gray' size={23} />
                                    </div>   
                                </Tooltip>     
                            </div>
                    
                    </div>

                ))
            }
            
            

        </div>

        <div className="w-full flex justify-end !mt-8 items-end" >
            <Pagination count={categoriesMeta?.last_page || 1} page={pagination.page+1} onChange={(_, value) => { setPagination(pag => ({ ...pag, page: value-1 }))} } variant="outlined" color='primary' size="small" />
        </div>

    </div>

  )

}
