import React from 'react'
import { FaFolderMinus, FaFolder } from "react-icons/fa";
import { FoldersApi } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { MdMoreVert } from "react-icons/md";
import { useDialogueStore } from '@/store/dialogue.store';
import { FaFileImage } from "react-icons/fa";
import { TbFileTypePdf } from "react-icons/tb";
import { PhotoView } from 'react-photo-view';

export default function ListFolder({currentFolder, setCurrentFolder}) {

    const { isError, data: list,  isLoading } = useQuery({
		queryKey: ["getFolder", currentFolder],
		queryFn: async ({ queryKey }) => {
			return FoldersApi.getFolder(queryKey[1])
		},
		enabled: true,
		staleTime: 10*60*100
	})

    const { setDialogue } = useDialogueStore()

  return (
    <div className="my-1 flex flex-wrap">

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
                                    <div key={"subfolder"+key} onClick={() => setCurrentFolder(item.id)} className="m-4 pt-2 cursor-pointer bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] ">
                                        <div className="w-full flex justify-end items-end " >
                                            <MdMoreVert className="text-gray-500" />
                                        </div>
                                        <FaFolder size={50} color="#FFC312" />
                                        <h4 className="text-center text-[12px] text-blue-gray-700 font-medium line-clamp-1 ">{item.folder_name}</h4>
                                    </div>
                                ))
                            }
                        </>

                        <>
                            {
                                list?.files.map((item, key) => (

                                    item.type === "application/pdf" ?

                                        <div key={"file"+key} 
                                            onClick={() => setDialogue({
                                                size: "xl",
                                                open: true,
                                                view: "view-pdf",
                                                data: {
                                                  fileLocation: item?.file_location
                                                }
                                             })} 
                                            className="m-4 pt-2 cursor-pointer bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] "
                                        >
                                            <div className="w-full flex justify-end items-end " >
                                                <MdMoreVert className="text-gray-500" />
                                            </div>
                                            <TbFileTypePdf size={50} className=" text-gray-500 " />
                                            <h4 className="text-center text-[12px] text-blue-gray-700 font-medium line-clamp-1 ">{item.file_name}</h4>
                                        </div>

                                    :

                                        ["image/jpeg", "image/jpg", "image/png"].includes(item.type) ?

                                            <PhotoView key={"file"+key} src={item?.file_location}>

                                                <div className="m-4 pt-2 cursor-pointer bg-gray-100 shadow-sm hover:shadow-md flex flex-col items-center justify-between rounded-md w-[100px] h-[120px] ">
                                                    <div className="w-full flex justify-end items-end " >
                                                        <MdMoreVert className="text-gray-500" />
                                                    </div>
                                                    <FaFileImage  size={50} className=" text-gray-500 " />
                                                    <h4 className="text-center text-[12px] text-blue-gray-700 font-medium line-clamp-1 ">{item.file_name}</h4>
                                                </div>

                                            </PhotoView>

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
