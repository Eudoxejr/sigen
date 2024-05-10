import * as React from "react";
import { Link } from "react-router-dom";
import {
	Typography
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

  const [currentFolder, setCurrentFolder] = React.useState(state.id);
  const { setDialogue } = useDialogueStore()


  const { isError, data: folderList,  isLoading } = useQuery({
		queryKey: ["getFolderTree"],
		queryFn: async ({ queryKey }) => {
			return FoldersApi.getFolderTree(state.id)
		},
		enabled: true,
		staleTime: 10*60*1000
	})


  return (
    <div className="">

      <div className="my-6 flex flex-col lg:flex-row">

        <div className="w-full rounded-md border overflow-scroll no-scrollbar border-[#ddd] pb-7 md:w-auto lg:min-h-[80vh] lg:w-[300px] ">
          <div className=" h-[40px] bg-blue-gray-500 flex items-center rounded-md " >
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
                onItemFocus={(_,itemId) => setCurrentFolder(itemId) }
              />
            }

          
        </div>

        <div className="w-full p-3 lg:w-[75%]">

          <div className=" w-full flex mt-2 rounded-md border gap-x-3 border-[#ddd] p-3 " >

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
              Créer un dossier
            </button>

          </div>
          <ListFolder currentFolder={currentFolder} setCurrentFolder={setCurrentFolder}/>
        
        </div>

        <div className="w-full rounded-md border flex flex-col border-[#ddd] px-2 py-7 md:w-auto lg:min-h-[80vh] lg:w-[300px] ">
          
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
              <div className="flex items-center mt-3 gap-2 ">
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

            <button 
              onClick={() => {
                setDialogue({
                  size: "sm",
                  open: true,
                  view: "",
                })
              }}
              className=" bg-green-500 mt-6 px-2 py-1 rounded-md text-white text-[12px] " 
            >
              Générer la minute
            </button>

          </div>

        </div>
        
      </div>

    </div>
  );
}
