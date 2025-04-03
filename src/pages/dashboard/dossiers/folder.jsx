import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import {
	Chip,
	Avatar,
	Typography,
} from "@material-tailwind/react";
import {Avatar as AvatarMui} from '@mui/material';
import { FaFolderMinus, FaFolder } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { Box } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { FaFolderPlus } from "react-icons/fa6";
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useLocation } from "react-router-dom";
import { PhotoView } from 'react-photo-view';
import { useQuery } from "@tanstack/react-query";
import { FoldersApi } from "@/api/api";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import ListFolder from "./components/listFolder";
import { useDialogueStore } from '@/store/dialogue.store';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks/useTreeViewApiRef';



const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.25)
        : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default function Folder() {

  const {state} = useLocation();
  const apiRef = useTreeViewApiRef();

  const [currentFolder, setCurrentFolder] = React.useState(state.id);
  const [selectedFolder, setSelectedFolder] = React.useState(null);
  const { setDialogue } = useDialogueStore()


  const { isError, data: folderList,  isLoading } = useQuery({
		queryKey: ["getFolderTree"],
		queryFn: async ({ queryKey }) => {
			return FoldersApi.getFolderTree(state.id)
		},
		enabled: true,
		staleTime: 0
	})

  const handleOnClickFolder = (event, id) => { 
    apiRef.current?.focusItem(event, id);
  };

  return (
    
    <div className="w-full">
 
      <div className="w-full  my-6 flex flex-col lg:flex-row">

        <div className="w-full rounded-t-md border overflow-scroll no-scrollbar bg-white border-[#ddd] pb-7 md:w-auto lg:min-h-[80vh] lg:min-w-[300px] ">
          <div className=" h-[40px] bg-blue-gray-500 flex items-center rounded-t-md " >
            <span className="font-medium text-white px-1 text-[13px] " color="inherit" >
              Le Dossier
            </span>
          </div>

            {isLoading &&
              <div className=" flex flex-1 flex-col items-center justify-center gap-y-2 mt-2 " >
                {Array.from({ length: 6 }).map((_, key) => (
                  <div key={"folderskelton"+key} className=" animate-pulse bg-gradient-to-br from-gray-100 to-blue-gray-200  rounded-[8px] bg-white p-[2%] h-[40px] w-[95%] " />
                ))}
              </div>
            }

            {folderList && folderList?.length > 0 &&
              <RichTreeView
                aria-label="customized"
                defaultExpandedItems={[currentFolder]}
                sx={{ marginTop: 2 }}
                slots={{ item: StyledTreeItem }}
                items={folderList}
                apiRef={apiRef}
                onItemClick={(item,itemId) => { setCurrentFolder(itemId)}}
                experimentalFeatures={{ labelEditing: true }}
                isItemEditable={() => false}
                expansionTrigger="iconContainer"
              />
            }

          
        </div>

        <div className="w-full p-3 flex flex-col flex-1">
            
          <Breadcrumbs aria-label="breadcrumb">
            {selectedFolder?.upFolder?.up_folder_id &&
              <span
                underline="hover"
                color="inherit"
                className=" cursor-pointer "
                onClick={() => setCurrentFolder(selectedFolder?.upFolder?.up_folder_id)}
              >
                ...
              </span>
            }
            {selectedFolder?.up_folder_id &&
              <span
                underline="hover"
                color="inherit"
                className=" cursor-pointer font-semibold "
                onClick={() => setCurrentFolder(selectedFolder?.up_folder_id)}
              >
                {selectedFolder?.upFolder?.folder_name} 
              </span>
            }
            <span
              underline="hover"
              color="inherit"
              className="font-semibold"
            >
              {selectedFolder?.folder_name}
            </span>
          </Breadcrumbs>

          {!selectedFolder?.is_minute_folder &&
            <div className=" w-full flex mt-2 rounded-md border gap-x-3 bg-white border-[#ddd] p-3 " >
              
              <button 
                onClick={() => {
                  setDialogue({
                    size: "sm",
                    open: true,
                    view: "create-folder",
                    data: {
                      currentFolder: currentFolder
                    }
                  })
                }}
                className=" bg-primary px-2 py-1 rounded-md text-white text-[12px] " 
              >
                Ajouter un dossier
              </button>
              
              <button 
                onClick={() => {
                  setDialogue({
                    size: "sm",
                    open: true,
                    view: "add-file",
                    data: {
                      currentFolder: currentFolder
                    }
                  })
                }}
                className=" bg-primary px-2 py-1 rounded-md text-white text-[12px] " 
              >
                Ajouter un fichier
              </button>

            </div>
          }

          {(selectedFolder?.is_minute_folder && state?.draft_acte_location && !state?.final_acte_location) ?
              <div className=" w-full flex mt-2 rounded-md border gap-x-3 bg-white border-[#ddd] p-3 " >
                <button 
                  onClick={() => {
                    setDialogue({
                      size: "sm",
                      open: true,
                      view: "add-final-file",
                      data: {
                        currentFolder: currentFolder
                      }
                    })
                  }}
                  className=" bg-green-500 px-2 py-1 rounded-md text-white text-[12px] " 
                >
                  Ajouter l'acte final
                </button>
              </div>
            :
            null
          }

          <div className=" w-full flex justify-center " >
            <ListFolder handleOnClickFolder={handleOnClickFolder} selectedFolder={selectedFolder} currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} setSelectedFolder={setSelectedFolder}/>
          </div>
            
        </div>

        <div className="w-full rounded-md border flex flex-col bg-white border-[#ddd] px-2 py-7 md:w-auto lg:min-h-[80vh] lg:min-w-[300px] ">
          
          <div className="flex w-full items-center">
            <div style={{backgroundColor: state?.category?.category_color}} className="flex h-[60px] w-[60px] items-center justify-center rounded-md">
              <FaFolder size={18} color="white" />
            </div>
            <div className="ml-3">
              <h2 className=" line-clamp-2 font-semibold text-[14px] " >{state?.category?.category_name}</h2>
              <p className="text-gray-700 text-[13px] mt-1 ">{state?.folder_name || "####"}</p>
            </div>
          </div>

          <div className=" flex flex-col px-3 " >

            <h2 className="mb-2 mt-4 font-bold text-[15px]">Statut</h2>
            {state?.is_archived ?
              <Chip
                variant="gradient"
                color={"red"}
                value={ "Archiver"}
                className="py-2 px-2 !text-[12.5px] font-medium"
              />
            :
              <div className="w-full h-full flex items-center" >
                <Chip
                  variant="gradient"
                  color={state?.is_treated_folder ? "green" : "orange"}
                  value={state?.is_treated_folder ? "Traité" : "En Cours"}
                  className="py-2 px-2 !text-[12.5px] font-medium"
                />
              </div>
            }

            <h2 className="my-4 font-bold text-[15px]">Client</h2>

            {state?.client?.civility === "Structure" ?
              <div className="flex items-center gap-2 ">
                <AvatarMui>
                </AvatarMui>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold text-[13.5px] line-clamp-1 "
                >
                  {state?.client?.denomination}
                </Typography>
              </div>
            :
              <div className="flex items-center gap-2 ">
                <AvatarMui>
                </AvatarMui>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold text-[13.5px] line-clamp-1 "
                >
                  {state?.client?.firstname + " " + state?.client?.lastname}
                </Typography>
              </div>
            }

            <h2 className="my-6 font-bold text-[15px] ">Collaborateurs</h2>

            <div className="flex items-center gap-2 ">
              <PhotoView src={state.manager?.profil_pic || '/img/sigen/user128.png'}>
                <AvatarMui src={state?.manager?.profil_pic} sx={{ width: 40, height: 40 }} />
              </PhotoView>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium opacity-85 text-[13px] flex flex-col li capitalize"
                >
                  {state?.manager?.firstname + " " + state?.manager?.lastname}
                </Typography>
                <p className="text-gray-500 text-[13px] ">Titulaire</p>
              </div>
            </div>

            {state?.subManager && 
              <div className="flex items-center mt-5 gap-2 ">
                <PhotoView key={state.id} src={state.subManager?.profil_pic || '/img/sigen/user128.png'}>
                  <AvatarMui src={state?.subManager?.profil_pic} sx={{ width: 40, height: 40 }} />
                </PhotoView>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium opacity-60 text-[13px] line-clamp-1 capitalize"
                  >
                    {state?.subManager?.firstname + " " + state?.subManager?.lastname}
                  </Typography>
                  <p className="text-gray-500 text-[13px] ">Suppléant</p>
                </div>
              </div>
            }

            {selectedFolder?.is_minute_folder && !state?.final_acte_location &&
              <button 
                onClick={() => {
                  setDialogue({
                    size: "md",
                    open: true,
                    view: "select-template-for-folder",
                  })
                }}
                className=" bg-primary mt-7 px-2 py-2 rounded-md text-white text-[12px] " 
              >
                { state?.template_id ? "Choisir un autre exemplaire de minute" : "Choisir un exemplaire de minute" }
              </button>
            }

            {!state?.is_archived ?
              <button 
                onClick={() => {
                  setDialogue({
                    size: "sm",
                    open: true,
                    view: "archiver-folder",
                    data: state
                  })
                }}
                className=" bg-red-400 mt-7 px-2 py-2 rounded-md font-medium text-white text-[12px] " 
              >
                Archiver ce dossier
              </button>
              :
              <button 
                onClick={() => {
                  setDialogue({
                    size: "sm",
                    open: true,
                    view: "archiver-folder",
                    data: state
                  })
                }}
                className=" bg-green-400 mt-7 px-2 py-2 rounded-md font-medium text-white text-[12px] " 
              >
                Désarchiver ce dossier
              </button>
            }

          </div>

        </div>
        
      </div>

    </div>
  );
}
