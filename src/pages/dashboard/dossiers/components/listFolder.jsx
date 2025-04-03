import React, {useEffect} from 'react'
import { FaFolder } from "react-icons/fa";
import { FoldersApi } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { MdMoreVert } from "react-icons/md";
import { useDialogueStore } from '@/store/dialogue.store';
import { FaFileImage } from "react-icons/fa";
import { TbFileTypePdf } from "react-icons/tb";
import { PhotoView } from 'react-photo-view';
import MinuteSelection from './minuteSelection';
import VariableConfig from './variableConfig'
import { useLocation } from "react-router-dom";
import { FaRegFileWord } from "react-icons/fa";
import {
	IconButton,
	Menu,
	MenuHandler,
	MenuList,
	MenuItem,
} from "@material-tailwind/react";

export default function ListFolder({selectedFolder, handleOnClickFolder, currentFolder, setCurrentFolder, setSelectedFolder}) {

    const {state} = useLocation();

    const { isError, data: list,  isLoading } = useQuery({
		queryKey: ["getFolder", currentFolder],
		queryFn: async ({ queryKey }) => {
			return FoldersApi.getFolder(queryKey[1])
		},
		enabled: true,
		staleTime: 3*60*1000
	})

    useEffect(() => {
        if(list)
        setSelectedFolder(list)
    }, [list])
    
    const { setDialogue } = useDialogueStore()

    if (!selectedFolder?.is_minute_folder)
    {
        return (
            <div className="my-1 w-full flex flex-wrap">

                {isLoading ?
                    <div className="m-4 animate-pulse bg-gradient-to-br from-gray-100 to-blue-gray-200 cursor-pointer bg-gray-100 flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] "/>
                :

                    isError ?

                        <div className=" flex h-[300px] text-[13px] flex-1 justify-center items-center " >
                            Une erreur s'est produite lors de la recupération des datas
                        </div>

                    :
                        (list?.subFolders?.length > 0 || list?.files?.length > 0 ) ?
                            <>
                                <>
                                    {
                                        list?.subFolders.map((item, key) => (
                                            // <div key={"subfolder"+key} onClick={(e) => {setCurrentFolder(item.id), handleOnClickFolder(e, item.id) }} className="m-4 pt-2 cursor-pointer bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] ">
                                            //     <div className="w-full flex justify-end items-end " >
                                            //         <MdMoreVert className="text-gray-500" />
                                            //     </div>
                                            //     <FaFolder size={50} color="#FFC312" />
                                            //     <h4 className="text-center text-[11px] text-blue-gray-700 font-medium line-clamp-2 ">{item.folder_name}</h4>
                                            // </div>

                                            <div
                                                key={"subfolder"+key}
                                                className="m-4 pt-0 border-1 border-gray-400 bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] "
                                            >
                                                <div className="w-full flex justify-end items-end " >
                                                    <Menu placement="bottom-end">
                                                        <MenuHandler>
                                                            <IconButton size="sm" className='size-[20px]' variant="text" color="blue-gray">
                                                                <MdMoreVert size={17} className="text-gray-800" />
                                                            </IconButton>
                                                        </MenuHandler>

                                                        <MenuList className="p-1 rounded-[5px]">

                                                            {/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
                                                            <MenuItem
                                                                onClick={() => setDialogue({
                                                                    size: "xl",
                                                                    open: true,
                                                                    view: "view-pdf",
                                                                    data: {
                                                                        fileLocation: state?.final_acte_location
                                                                    }
                                                                })}
                                                                className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
                                                            >
                                                                Déplacer
                                                            </MenuItem>
                                                            {/* } */}

                                                            <MenuItem
                                                                onClick={() => setDialogue({
                                                                    size: "xl",
                                                                    open: true,
                                                                    view: "view-pdf",
                                                                    data: {
                                                                        fileLocation: state?.final_acte_location
                                                                    }
                                                                })}
                                                                className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
                                                            >
                                                                Supprimer
                                                            </MenuItem>

                                                        </MenuList>
                                                    </Menu>
                                                </div>
                                                <div
                                                    onClick={(e) => {setCurrentFolder(item.id), handleOnClickFolder(e, item.id) }} 
                                                    className='flex cursor-pointer flex-1 flex-col w-full justify-between items-center ' 
                                                >
                                                    <FaFolder size={50} color="#FFC312" />
                                                    <h4 className="text-center leading-3 text-[11px] pb-2 px-1 text-blue-gray-900 font-medium line-clamp-2 ">{item.folder_name}</h4>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>

                                <>
                                    {
                                        list?.files.map((item, key) => (

                                            item.type === "application/pdf" ?

                                                <div
                                                    key={"file"+key} 
                                                    className="m-4 pt-0 border-1 border-gray-400 bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] "
                                                >
                                                    <div className="w-full flex justify-end items-end " >
                                                        <Menu placement="bottom-end">
                                                            <MenuHandler>
                                                                <IconButton size="sm" className='size-[20px]' variant="text" color="blue-gray">
                                                                    <MdMoreVert size={17} className="text-gray-800" />
                                                                </IconButton>
                                                            </MenuHandler>

                                                            <MenuList className="p-1 rounded-[5px]">

                                                                {/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
                                                                <MenuItem
                                                                    onClick={() => setDialogue({
                                                                        size: "xl",
                                                                        open: true,
                                                                        view: "view-pdf",
                                                                        data: {
                                                                            fileLocation: state?.final_acte_location
                                                                        }
                                                                    })}
                                                                    className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
                                                                >
                                                                    Déplacer
                                                                </MenuItem>
                                                                {/* } */}

                                                                <MenuItem
                                                                    onClick={() => setDialogue({
                                                                        size: "sm",
                                                                        open: true,
                                                                        view: "delete-file",
                                                                        data: item
                                                                    })}
                                                                    className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
                                                                >
                                                                    Supprimer
                                                                </MenuItem>

                                                            </MenuList>
                                                        </Menu>
                                                    </div>
                                                    <div
                                                        onClick={() => setDialogue({
                                                            size: "xl",
                                                            open: true,
                                                            view: "view-pdf",
                                                            data: {
                                                                fileLocation: item?.file_location
                                                            }
                                                        })} 
                                                        className='flex cursor-pointer flex-1 flex-col w-full justify-between items-center ' 
                                                    >
                                                        <TbFileTypePdf size={50} className=" text-gray-500 " />
                                                        <h4 className="text-center leading-3 text-[11px] pb-2 px-1 text-blue-gray-900 font-medium line-clamp-2 ">{item.file_name}</h4>
                                                    </div>
                                                </div>

                                            :

                                                ["image/jpeg", "image/jpg", "image/png"].includes(item.type) ?

                                                    <div
                                                        className="m-4 pt-0 border-1 border-gray-400 bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] "
                                                    >
                                                        <div className="w-full flex justify-end items-end " >
                                                            <Menu placement="bottom-end">
                                                                <MenuHandler>
                                                                    <IconButton size="sm" className='size-[20px]' variant="text" color="blue-gray">
                                                                        <MdMoreVert size={17} className="text-gray-800" />
                                                                    </IconButton>
                                                                </MenuHandler>

                                                                <MenuList className="p-1 rounded-[5px]">

                                                                    {/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
                                                                    <MenuItem
                                                                        onClick={() => setDialogue({
                                                                            size: "xl",
                                                                            open: true,
                                                                            view: "view-pdf",
                                                                            data: {
                                                                                fileLocation: state?.final_acte_location
                                                                            }
                                                                        })}
                                                                        className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
                                                                    >
                                                                        Déplacer
                                                                    </MenuItem>
                                                                    {/* } */}

                                                                    <MenuItem
                                                                        onClick={() => setDialogue({
                                                                            size: "sm",
                                                                            open: true,
                                                                            view: "delete-file",
                                                                            data: item
                                                                        })}
                                                                        className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
                                                                    >
                                                                        Supprimer
                                                                    </MenuItem>

                                                                </MenuList>
                                                            </Menu>
                                                        </div>
                                                        <PhotoView key={"file"+key} src={item?.file_location}>
                                                            <div
                                                                className='flex cursor-pointer flex-1 flex-col w-full justify-between items-center ' 
                                                            >
                                                                <FaFileImage  size={50} className=" text-gray-500 " />
                                                                <h4 className="text-center leading-3 text-[11px] pb-2 px-1 text-blue-gray-900 font-medium line-clamp-2 ">{item.file_name}</h4>
                                                            </div>
                                                        </PhotoView>
                                                    </div>

                                                :

                                                <div key={"file"+key}  className="m-4 pt-2 cursor-pointer bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] ">
                                                    <div className="w-full flex justify-end items-end " >
                                                        <MdMoreVert className="text-gray-500" />
                                                    </div>
                                                    <FaFileImage  size={50} className=" text-gray-500 " />
                                                    <h4 className="text-center text-[12px] text-blue-gray-700 font-medium line-clamp-1 ">{item.file_name}</h4>
                                                </div>
                                        ))
                                    }
                                </>

                            </>
                        :
                        <div className=" flex h-[300px] text-[13px] flex-1 justify-center items-center " >
                            Aucune donnée à afficher
                        </div>
                }

            </div>
        )
    }

    return (
        state?.draft_acte_location || state?.final_acte_location ?

            <div className="my-1 w-full flex flex-wrap">

                {state?.draft_acte_location &&
                    <div
                        className="m-4 pt-0 border-2 border-orange-400 bg-orange-200 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] "
                    >
                        <div className="w-full flex justify-end items-end " >
                            <Menu placement="bottom-end">
                                <MenuHandler>
                                    <IconButton size="sm" className='size-[20px]' variant="text" color="blue-gray">
                                        <MdMoreVert size={17} className="text-gray-800" />
                                    </IconButton>
                                </MenuHandler>

                                <MenuList className="p-1 rounded-[5px]">

                                    {/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
                                    <MenuItem
                                        onClick={() => setDialogue({
                                            size: "lg",
                                            open: true,
                                            view: "view-template",
                                            data: {
                                                url: state?.draft_acte_location,
                                                isUpdate: false,
                                                isPrint: true,
                                            }
                                        })}
                                        className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
                                    >
                                        Aperçu
                                    </MenuItem>
                                    {/* } */}

                                    {/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
                                        <MenuItem
                                            onClick={() => setDialogue({
                                                size: "xl",
                                                open: true,
                                                view: "edit-draft-acte",
                                                data: {
                                                    url: state?.draft_acte_location,
                                                    isUpdate: false,
                                                    isPrint: true,
                                                }
                                            })}
                                            className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
                                        >
                                            Editer le brouillon
                                        </MenuItem>
                                    {/* } */}

                                </MenuList>
                            </Menu>
                        </div>
                        <div className='flex flex-1 flex-col justify-between items-center ' >
                            <FaRegFileWord size={42} className=" text-gray-800 " />
                            <h4 className="text-center text-[12px] pb-2 px-1 text-blue-gray-900 font-medium line-clamp-1 ">Acte brouillon</h4>
                        </div>
                    </div>
                }

                {state?.final_acte_location &&
                    <div
                        className="m-4 pt-0 border-2 border-green-400 bg-green-200 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] "
                    >
                        <div className="w-full flex justify-end items-end " >
                            <Menu placement="bottom-end">
                                <MenuHandler>
                                    <IconButton size="sm" className='size-[20px]' variant="text" color="blue-gray">
                                        <MdMoreVert size={17} className="text-gray-800" />
                                    </IconButton>
                                </MenuHandler>

                                <MenuList className="p-1 rounded-[5px]">

                                    {/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
                                    <MenuItem
                                        onClick={() => setDialogue({
                                            size: "xl",
                                            open: true,
                                            view: "view-pdf",
                                            data: {
                                                fileLocation: state?.final_acte_location
                                            }
                                        })}
                                        className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
                                    >
                                        Aperçu
                                    </MenuItem>
                                    {/* } */}

                                    <MenuItem
                                        onClick={() => setDialogue({
                                            size: "sm",
                                            open: true,
                                            view: "add-final-file",
                                            data: {
                                                currentFolder: currentFolder
                                            }
                                        })}
                                        className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-500 hover:!text-white font-medium flex items-center justify-between mt-1"
                                    >
                                        Remplacer
                                    </MenuItem>

                                </MenuList>
                            </Menu>
                        </div>
                        <div className='flex flex-1 flex-col justify-between items-center ' >
                            <TbFileTypePdf size={42} className=" text-gray-800 " />
                            <h4 className="text-center text-[12px] pb-2 px-1 text-blue-gray-900 font-medium line-clamp-1 ">Acte</h4>
                        </div>
                    </div>
                }
            </div>

        :
            !state?.template_id ?
                <MinuteSelection/>
            : <VariableConfig/>
    )
}
