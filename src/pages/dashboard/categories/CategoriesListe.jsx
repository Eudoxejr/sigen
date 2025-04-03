import React, {useState, useMemo, useEffect} from 'react'
import { FaLayerGroup } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip } from "@material-tailwind/react";
import { GiBookPile } from "react-icons/gi";
import { useDialogueStore } from '@/store/dialogue.store';
import { CategorieGroupeApi, CategoriesApi } from '@/api/api';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash.debounce';
import { useQueryClient } from "@tanstack/react-query";
import AsyncSelect from 'react-select/async'
import Pagination from '@mui/material/Pagination';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import { BiCategoryAlt } from "react-icons/bi";

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
        
        <div className="my-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

            { isLoadingCat &&
                Array.from({ length: 3 }).map((_, key) => (
                    <div key={"categoryskelton"+key} className=" animate-pulse w-[350px] sm:w-[45%] flex h-[240px] flex-col px-3 py-4 rounded-lg bg-gradient-to-br from-gray-100 to-blue-gray-200 " />
                ))
            }

            {categories?.data?.length == 0 ?
                    null
                :
                categories?.data?.map((category, key) => (

                    <Card key={"category"+key}>
                        <CardHeader
                            className="absolute -mt-4 grid h-16 w-16 place-items-center"
                        >
                            <div style={{backgroundColor: category?.category_color}} className={`w-full flex justify-center items-center h-full`} >
                                <BiCategoryAlt size={20} color='white' />
                            </div>
                        </CardHeader>
                        <CardBody className="p-4 text-right">
                            <Typography variant="small" className=" font-medium text-[14px] line-clamp-2 text-blue-gray-600">
                                {category.category_name}
                            </Typography>
                            <Typography variant="h5" color="blue-gray">
                                {category?.category_slug}
                            </Typography>
                            <div className=" flex mt-2 gap-x-3 justify-end " >     
                                {/* <GiBookPile className="text-gray-800" size={20} /> */}
                                <Typography variant="small" className=" font-medium text-[14px] line-clamp-2 text-blue-gray-600">{category?.meta?.folders_count} Dossiers</Typography>
                            </div>
                            <div className=" flex mt-2 gap-x-3 justify-end " >     
                                {/* <GiBookPile className="text-gray-800" size={20} /> */}
                                <Typography variant="small" className=" font-medium text-[14px] line-clamp-2 text-blue-gray-600">{category?.meta?.templates_count} Exemplaire(s) de minute </Typography>
                            </div>
                            <Typography variant="small" color="blue-gray" className=" font-medium mt-3 text-[14px] line-clamp-2 text-blue-gray-600">
                                Groupe: {category?.categoryGroup?.group_name}
                            </Typography>
                            <div className='flex justify-end mt-5 gap-x-[5px]'>
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
                        </CardBody>
                        {/* {footer && (
                            <CardFooter className="border-t border-blue-gray-50 p-4">
                            {footer}
                            </CardFooter>
                        )} */}
                    </Card>

                ))
            }
            
            

        </div>

        <div className="w-full flex justify-end !mt-8 items-end" >
            <Pagination count={categoriesMeta?.last_page || 1} page={pagination.page+1} onChange={(_, value) => { setPagination(pag => ({ ...pag, page: value-1 }))} } variant="outlined" color='primary' size="small" />
        </div>

    </div>

  )

}
