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
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from "dayjs";
import { AiOutlineArrowLeft, AiFillEye, AiFillCalendar, AiOutlineOrderedList } from "react-icons/ai";
import { MdOutlineModeOfTravel } from "react-icons/md";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DriverApi } from "@/api/api";
import { RenderIf } from "@/components/common";
import { Permissions } from "@/data/role-access-data";
  import BeatLoader from "react-spinners/BeatLoader";
  import { PhotoView } from 'react-photo-view';
//   import Calendar from "components/commons/calendar";
//   import CatalogList from "components/commons/catalogue";
//   import PrestationList from "components/commons/prestationList";


export function DriverView() {

    const navigate = useNavigate()
    const { id } = useParams();

  const queryClient = useQueryClient();
  const [tabvalue, settabvalue] = useState('general');


  const { isLoading: loadingSpecifiqDriver, refetch: refetchSpecifiqDriver, data: dataSpecifiqDriver } = useQuery({

    queryKey: ["getPrestataireSpecifiq", id ],
    queryFn: async ({ queryKey }) => {
      return DriverApi.getSpecifiqDriver(queryKey[1])
    },     
    onSuccess: (data) => {
    },
    enabled: true,
    staleTime: 0

  })

    const {isLoading:loadingReservStats, refetch:refetchReservStats, data:dataReservStats } = useQuery({
      queryKey: ["getPrestataireReservStats", id ],
      queryFn: async ({ queryKey }) => {
        return DriverApi.getDriverStats(queryKey[1])
      },     
      onSuccess: (data) => {
      },
      enabled: true,
      staleTime: 0
    })

    if(loadingSpecifiqDriver && loadingReservStats){
      return <div className=" w-full h-screen flex justify-center items-center " >
        <BeatLoader color="grey" size={8} />
      </div>
    }
  

  return (
    <RenderIf allowedTo={Permissions.VIEW_A_DRIVER_DETAILS}>
      <Card className="mx-3 mt-[40px] mb-6 lg:mx-4">
        <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">

          <div className='flex items-center' >

            <Tooltip content="Retour">
              <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                <AiOutlineArrowLeft color='white' size={18} />
              </button>
            </Tooltip>

            <Typography variant="h6" color="blue-gray" >
              Conducteur
            </Typography>

          </div>

        </CardHeader>

        <CardBody className="py-4">

          <div className="mb-5 flex items-center justify-between gap-6 ">

              <div className="flex items-center gap-6">
                <PhotoView key={dataSpecifiqDriver?.data?.idUser} src={dataSpecifiqDriver?.data?.photoProfil || '/img/sigen/user128.png'}>
                  <Avatar
                    src={dataSpecifiqDriver?.data?.photoProfil || "/img/sigen/user.png"}
                    alt=""
                    size="xl"
                    className="rounded-lg shadow-sm shadow-blue-gray-500/40"
                  />
                </PhotoView>
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-1">
                    {dataSpecifiqDriver?.data?.firstName+" "+dataSpecifiqDriver?.data?.lastName}
                  </Typography>
                  <div className="flex items-center gap-x-3 " >
                    {/* <Chip
                      variant="gradient"
                      color={!dataSpecifiqDriver?.data?.isSuspend ? "green" : "red"}
                      value={!dataSpecifiqDriver?.data?.isSuspend ?  "Actif" : "Suspendu" }
                      className="py-0.5 px-2 text-[11px] font-medium"
                    /> */}
                    {/* <Tooltip content={!dataSpecifiqDriver?.data?.isSuspend ? "Suspendre le compte" : "Activer le compte"}>
                      <PencilIcon
                        className="h-4 w-4 cursor-pointer text-blue-gray-500"
                        onClick={() => dispatch({
                          type: "setDialog",
                          value: {
                            active: true,
                            view: !dataSpecifiqDriver?.data?.isSuspend ? "suspenduser" : "activeuser",
                            value: {...dataSpecifiqDriver?.data, detailPrestataire: true, service: true }
                          }
                        })} 
                      />
                    </Tooltip> */}
                  </div>
                </div>
              </div>

              {/* <div className=" w-[400px] ">

              <Tabs value="general">
                <TabsHeader>
                  <Tab className=" text-[12px]" onClick={() => settabvalue("general")} value="general">
                    <HomeIcon className="-mt-1 mr-1 inline-block h-4 w-4" />
                    General
                  </Tab>
                  <Tab className="text-[12px]" onClick={() => settabvalue("prestation")} value="prestation">
                    <MdOutlineModeOfTravel className="-mt-1 mr-1 inline-block h-4 w-4" />
                    Courses
                  </Tab>
                </TabsHeader>
              </Tabs>

              </div> */}

          </div>

            {/* {tabvalue === "general" && */}

              <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
                
                <div>

                  <Typography variant="h6" color="blue-gray" className="mb-3 mt-4">
                    Moyen de transport
                  </Typography>
                        
                  {dataSpecifiqDriver?.data?.transportMoyens?.map((item, key) => (

                    <Card key={key} color="transparent" className=" mb-5 " shadow={false}>

                      <CardHeader
                        floated={false}
                        color="gray"
                        className="mx-0 mt-0 mb-2 w-[190px] h-[140px]"
                      >
                        <img
                          src={item.transportMoyen?.illustrationPic}
                          alt={item.transportMoyen?.title}
                          className="h-full w-full object-cover"
                        />
                      </CardHeader>

                      <CardBody className="py-0 px-1">

                        <Typography
                          variant="small"
                          className="font-normal text-green-500"
                        >
                          {item.isValidate ? "#inscription validée" : "" }
                        </Typography>

                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="mt-1 mb-2 line-clamp-1"
                        >
                          {item.transportMoyen.title}
                        </Typography>

                        <Typography
                          variant="small"
                          className="font-normal text-blue-gray-500 line-clamp-3 "
                        >
                          {item.transportMoyen.transportMoyenDescription}
                        </Typography>

                      </CardBody>

                          {!item.isValidate &&
                            <CardFooter className="mt-3 flex items-center justify-between py-0 px-1">
                              <Button variant="outlined" color="green" className=" text-white bg-green-500" size="sm">
                                valider l'inscription
                              </Button>
                            </CardFooter>
                          }

                      </Card>
                      
                    ))}

                  <div className="mt-3 flex items-center justify-between py-0 px-1">
                    <Button 
                      onClick={() => {
                        navigate(
                          `../inscription/${dataSpecifiqDriver?.data?.idUser}`
                        )
                      }}
                      variant="outlined" color="green" className=" text-white bg-green-500" size="sm"
                    >
                      voir plus
                    </Button>
                  </div>

                </div>

              <div className=" flex flex-col " >

                  <ProfileInfoCard
                    title="Profile Information"
                    description={dataSpecifiqDriver?.data?.presentation}
                    details={{
                      "Solde dû à TPT": dataSpecifiqDriver?.data?.debts+' Eur' ,
                      "nom complet": dataSpecifiqDriver?.data?.firstName+" "+dataSpecifiqDriver?.data?.lastName,
                      mobile: dataSpecifiqDriver?.data?.telephone || "non défini",
                      email: dataSpecifiqDriver?.data?.email || "non défini",
                      sexe: dataSpecifiqDriver?.data?.sexe || "non défini",
                    }}
                  />

                  {/* {dataSpecifiqDriver?.data?.langue &&
                    <li className="flex items-center mt-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold capitalize"
                      >
                        Langue :
                      </Typography>
                      
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500 ml-1"
                      >
                        {dataSpecifiqDriver?.data?.langue.map((item) => (item+' '))}
                      </Typography>
                      
                    </li>
                  } */}

                  <Typography variant="h6" color="blue-gray" className=" mt-8 mb-1">
                    Statistiques courses
                  </Typography>

                  <div className=" flex flex-col " >

                    {dataReservStats?.data?.map((val) => (
                      <div className=" w-full flex flex-row justify-between items-center mt-2 " >

                        {val?.statusReservation === "ACCEPTED" ?
                          <span className="text-black font-semibold text-[14px] ">Course(s) Acceptée(s): </span>
                          :val?.statusReservation === "ASSIGNED" ?
                          <span className="text-black font-semibold text-[14px] ">Course(s) Assignée(s): </span>
                          :val?.statusReservation === "CANCELED" ?
                          <span className="text-black font-semibold text-[14px] ">Course(s) Annulée(s): </span>
                          :val?.statusReservation === "EXPIRED" ?
                          <span className="text-black font-semibold text-[14px] ">Course(s) Expiée(s): </span>
                          :val?.statusReservation === "INPROGRESS" ?
                          <span className="text-black font-semibold text-[14px] ">Course(s) cours: </span>
                          :val?.statusReservation === "ENDED" ?
                          <span className="text-black font-semibold text-[14px] ">Course(s) finie(s): </span>
                          :val?.statusReservation === "VALIDATED" ?
                          <span className="text-black font-semibold text-[14px] ">Course(s) Validée(s): </span>
                          :
                          null
                        }
                        <span>{val._count}</span>
                      </div>
                    ))}

                    {/* { dataReservStats?.data?.map((item, index) => (
                    <>

                        {item?.statusReservation === "SENT" && 
                        <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                            <span className=" text-[11.5px] " >Non Traité</span>
                            <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="red" />
                        </div>
                        }

                        {item?.statusReservation === "ACCEPTED" && 
                        <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                            <span className=" text-[11.5px] " >Accepté</span>
                            <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="cyan" />
                        </div>
                        }
                                            
                        {item?.statusReservation === "INPROGRESS" && 
                        
                        <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                            <span className=" text-[11.5px] " >En Cours</span>
                            <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="orange" />
                        </div>

                        }

                        
                        {item?.statusReservation === "ENDED" && 
                        
                        <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                            <span className=" text-[11.5px] " >Fini</span>
                            <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="amber" />
                        </div>

                        }


                        {item?.statusReservation === "VALIDATED" && 
                        
                        <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                            <span className=" text-[11.5px] " >Validé</span>
                            <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="green" />
                        </div>

                        }

                    </>
                    ))} */}

                  </div>

              </div>

              <div>

                  <Typography variant="h6" color="blue-gray" className="mb-3">
                    {dataSpecifiqDriver?.data?.vehicules?.length} Véhicules
                  </Typography>

                  <div className=" flex flex-col gap-y-5 " >

                    { dataSpecifiqDriver?.data?.vehicules?.map((vehicule, key) => (

                      <div className=" w-full outline-[0.5px] outline outline-gray-500 px-3 py-3 rounded-md " key={key} >
                        
                        {vehicule?.isValidate &&
                          <Chip value="TPT" variant="gradient" color="blue" className=" mb-2 " />
                        }

                        {
                          vehicule?.infoVehicule?.map((champ, key2) => (
                            <div key={key2} >
                              <span className="text-black font-semibold ">{champ.titleField} : </span>
                              <span>{champ.value}</span>
                            </div>
                          ))
                        }

                        {!vehicule?.isValidate &&
                          <Chip onClick={() => navigate("../../vehicule/"+vehicule?.idVehicule) } value="Voir plus" variant="gradient" color="green" className=" mt-2 " />
                        } 

                      </div>

                    ))}

                  {/* <div className=" mt-4 w-[90%]" >

                      <div className=" w-full flex flex-row justify-between mb-[2px] " >
                        <span className=" text-[11.5px] " >Total</span>
                        <span className=" text-[11.5px] " >{dataReservStats?.total}</span>
                      </div>
                      <Progress value={100} color="amber" />

                    </div> */}

                  {/* { dataReservStats?.data?.map((item, index) => (
                      <>

                        {item?.statusReservation === "SENT" && 
                          <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                              <span className=" text-[11.5px] " >Non Traité</span>
                              <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="red" />
                          </div>
                        }

                        {item?.statusReservation === "ACCEPTED" && 
                          <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                              <span className=" text-[11.5px] " >Accepté</span>
                              <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="cyan" />
                          </div>
                        }
                                            
                        {item?.statusReservation === "INPROGRESS" && 
                          
                          <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                              <span className=" text-[11.5px] " >En Cours</span>
                              <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="orange" />
                          </div>

                        }

                        
                        {item?.statusReservation === "ENDED" && 
                          
                          <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                              <span className=" text-[11.5px] " >Fini</span>
                              <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="amber" />
                          </div>

                        }


                        {item?.statusReservation === "VALIDATED" && 
                          
                          <div key={index} className=" mt-4 w-[90%]" >
                            <div className=" w-full flex flex-row justify-between mb-[2px] " >
                              <span className=" text-[11.5px] " >Validé</span>
                              <span className=" text-[11.5px] " >{item?._count?.idReservation}</span>
                            </div>
                            <Progress value={((item?._count?.idReservation/dataReservStats?.total)*100)} color="green" />
                          </div>

                        }

                      </>
                    ))} */}

                </div>


              </div>

              </div>

            {/* } */}

            {/* {tabvalue === "calendar" &&
              <Calendar datadataSpecifiqDriver?={state} />
            }

            {tabvalue === "prestation" &&
              <PrestationList dataState={state} />
            }

            {tabvalue === "catalogue" &&
              <CatalogList dataState={state} />
            } */}

        </CardBody>

      </Card>
    </RenderIf>
  );
}

export default DriverView;
