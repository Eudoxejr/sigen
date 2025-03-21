import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Button,
  Chip,
  Progress,
  TabsBody,
  TabPanel
} from "@material-tailwind/react";
import {
  HomeIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import DataGridComponent from '@/components/common/datatable';
import { columnDossierCollabo, columnDossier } from '@/utils/columsDatatable';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import dayjs from "dayjs";
import { AiOutlineArrowLeft, AiFillEye, AiFillCalendar, AiOutlineOrderedList } from "react-icons/ai";
import { MdOutlineModeOfTravel } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CollaboApi } from "@/api/api";

import BeatLoader from "react-spinners/BeatLoader";
import { PhotoView } from 'react-photo-view';
import { useDialogueStore } from '@/store/dialogue.store';
import { FoldersApi } from '@/api/api';
//   import Calendar from "components/commons/calendar";
//   import CatalogList from "components/commons/catalogue";
//   import PrestationList from "components/commons/prestationList";


export function CollaboView() {

  const navigate = useNavigate()
  const { id } = useParams();
  const { setDialogue } = useDialogueStore()

  const [total, setTotal] = useState(0);

  const [pagination, setPagination] = useState({
    page: 0, 
    pageSize: 25
  })


  const { isLoading: loadingSpecifiqDriver, data: dataSpecificCollabo } = useQuery({
    queryKey: ["getCollaboSpecific", id ],
    queryFn: async ({ queryKey }) => {
      return CollaboApi.getSpecificCollabo(queryKey[1])
    },     
    enabled: true,
    staleTime: 0
  })
  

  if(loadingSpecifiqDriver){
    return <div className=" w-full h-screen flex justify-center items-center " >
      <BeatLoader color="grey" size={8} />
    </div>
  }
  

  return (
    // <RenderIf allowedTo={Permissions.VIEW_A_DRIVER_DETAILS}>

    <>
      <div className='flex items-center mt-5 ' >

        <Tooltip content="Retour">
          <button onClick={() => navigate(-1)} className=" bg-primary w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
            <AiOutlineArrowLeft color='white' size={18} />
          </button>
        </Tooltip>

        <Typography variant="h6" color="blue-gray" >
          Collaborateur
        </Typography>

      </div>

      <Card className="mx-3 mt-[20px] mb-6 lg:mx-4">

        <CardBody className="py-4 mt-4">

          <div className="mb-5 flex items-center justify-between gap-6 ">

              <div className="flex items-center gap-6">
                <PhotoView key={dataSpecificCollabo?.data?.id} src={dataSpecificCollabo?.data?.profil_pic || '/img/sigen/user128.png'}>
                  <Avatar
                    src={dataSpecificCollabo?.data?.profil_pic || "/img/sigen/user.png"}
                    alt=""
                    size="xl"
                    className="rounded-lg shadow-sm shadow-blue-gray-500/40"
                  />
                </PhotoView>
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-1">
                    {dataSpecificCollabo?.data?.firstname+" "+dataSpecificCollabo?.data?.lastname}
                  </Typography>
                  <div className="flex items-center gap-x-3 " >
                    <Chip
                      variant="gradient"
                      color={!dataSpecificCollabo.data.is_suspend ? "green" : "red"}
                      value={!dataSpecificCollabo.data.is_suspend ? "Actif" : "Suspendu"}
                      className="py-0.5 px-2 text-[11px] font-medium"
                    />
                  </div>
                </div>
              </div>

          </div>

          <div className=" mb-4 w-full flex gap-x-[50px] flex-row flex-wrap ">

            <div className=" min-w-[300px] flex flex-col " >

              <Typography variant="h6" color="blue-gray" className="mb-3 mt-4">
                Informations
              </Typography>
                    
              <div className="w-full h-full py-3 gap-y-3 flex  flex-col" >

                <div className="w-full flex gap-x-3 mb-1" >
                  <span className="font-medium opacity-75 text-[14.5px] capitalize" >Rôle: </span>
                  <span className="font-medium opacity-95 text-[15px] capitalize" >{dataSpecificCollabo.data.role.role_name}</span>
                </div>

                <div className="w-full flex gap-x-3 mb-1" >
                  <span className="font-medium opacity-75 text-[14.5px] capitalize" >Email: </span>
                  <span className="font-medium opacity-95 text-[15px] capitalize" >{dataSpecificCollabo.data.email}</span>
                </div>

                <div className="w-full flex gap-x-3 mb-1" >
                  <span className="font-medium opacity-75 text-[14.5px] capitalize" >Téléphone: </span>
                  <span className="font-medium opacity-95 text-[15px] capitalize" >{dataSpecificCollabo.data.phone_number}</span>
                </div>

              </div>

            </div>
            
            <div className=" min-w-[300px] flex flex-col flex-1 " >

              <Typography variant="h6" color="blue-gray" className="mb-3 mt-4">
                Statistiques
              </Typography>
                    
              <div className="w-full h-full py-3 flex items-center flex-col justify-center" >

                <div className="w-full flex justify-between mb-1" >
                  <span className="font-medium opacity-75 text-[14.5px] capitalize" >Dossiers</span>
                  <span className="font-medium opacity-75 text-[15px] capitalize" >{parseInt(dataSpecificCollabo.data.meta.folderManage_count)+parseInt(dataSpecificCollabo.data.meta.folderSubManage_count)}</span>
                </div>
                <Progress value={100} color="blue" />

                <div className="w-full mt-4 flex justify-between mb-1" >
                  <span className="font-medium opacity-75 text-[14.5px] capitalize">Titulaire</span>
                  <span className="font-medium opacity-75 text-[15px] capitalize">{parseInt(dataSpecificCollabo.data.meta.folderManage_count)}</span>
                </div>
                <Progress value={(parseInt(dataSpecificCollabo.data.meta.folderManage_count)*100)/(parseInt(dataSpecificCollabo.data.meta.folderManage_count)+parseInt(dataSpecificCollabo.data.meta.folderSubManage_count))} color="green" />

                <div className="w-full mt-4 flex justify-between mb-1" >
                  <span className="font-medium opacity-75 text-[14.5px] capitalize">Suppléant</span>
                  <span className="font-medium opacity-75 text-[15px] capitalize">{parseInt(dataSpecificCollabo.data.meta.folderSubManage_count)}</span>
                </div>
                <Progress value={(parseInt(dataSpecificCollabo.data.meta.folderSubManage_count)*100)/(parseInt(dataSpecificCollabo.data.meta.folderManage_count)+parseInt(dataSpecificCollabo.data.meta.folderSubManage_count))} color="deep-orange" />

              </div>

            </div>

            <div className=" w-[300px] " >
              <Typography variant="h6" color="blue-gray" className="mb-3 mt-4">
                Options
              </Typography>
              <div className=" w-full flex flex-row gap-4 flex-wrap " >
                <button
                  onClick={() =>
                    setDialogue({
                      size: "md",
                      open: true,
                      view: "update-collaborateur",
                      data: dataSpecificCollabo.data
                    })
                  }
                  className="text-[13px] py-2 bg-[#00000007] rounded-[3px] px-[15px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
                >
                  Modifier le collaborateur
                </button>

                {
                  // isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) &&
                  !dataSpecificCollabo.data.is_suspend ?
                    <button
                      onClick={() =>
                        setDialogue({
                          size: "xs",
                          open: true,
                          view: "suspend-collaborateur",
                          data: {...dataSpecificCollabo.data, wasActive: true}
                        })
                      }
                      className="text-[13px] py-2 bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
                    >
                      Suspendre le collaborateur
                    </button>
                    :
                    <button
                      onClick={() =>
                        setDialogue({
                          size: "xs",
                          open: true,
                          view: "suspend-collaborateur",
                          data: {...dataSpecificCollabo.data, wasActive: false}
                        })
                      }
                      className="text-[13px] py-2 bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-green-600 hover:!text-white font-medium flex items-center justify-between"
                    >
                      Activer le collaborateur
                    </button>
                  
                }

                <button
                  onClick={() =>
                    setDialogue({
                      size: "xs",
                      open: true,
                      view: "delete-collaborateur",
                      data: {...dataSpecificCollabo.data, goBack: true}
                    })
                  }
                  className="text-[13px] py-2 bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
                >
                  Supprimer le collaborateur
                </button>

              </div>
            </div>

          </div>

          <div className=" mb-12 w-full flex gap-x-[50px] flex-row flex-wrap ">

            <div className=" min-w-[300px] flex flex-col flex-1 " >

              <Typography variant="h6" color="blue-gray" className="mb-3 mt-4">
                Dossier en charge
              </Typography>
                    
              <div className="w-full min-h-[200px] py-3 " >

                  <DataGridComponent
                    idpri="id"
                    hidePagination={false}
                    hideHeader={true}
                    columns={columnDossierCollabo}
                    queryKey={[
                      "getDossierCollabo", 
                      pagination.page+1,
                      pagination.pageSize,
                      null,
                      null,
                      dataSpecificCollabo.data.id
                    ]}
                    fnQuery={({ queryKey }) => FoldersApi.getFolders(queryKey[1], queryKey[2], queryKey[3], queryKey[4], queryKey[5] )}
                    noRow={"Pas de dossier trouvé"}
                    totalInformation={{total, setTotal}}
                    paginationInformation={{pagination, setPagination}}
                    onRowClick={(params) => {
                      navigate(`../../dossiers/view`, { state: params.row })
                    }}
                  />

              </div>

            </div>

          </div>

        </CardBody>

      </Card>
    
      {/* </RenderIf> */}

    </>
  );
}

export default CollaboView;
