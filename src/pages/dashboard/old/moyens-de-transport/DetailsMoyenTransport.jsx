import { useDialogController } from '@/context/dialogueProvider';
import { StatisticsCard } from '@/widgets/cards';
import styled from '@emotion/styled';
import { UserIcon } from '@heroicons/react/24/solid';
import {
  Card, CardBody, CardHeader, Tooltip, Typography, Chip
} from '@material-tailwind/react';
import { AiOutlineArrowLeft, AiOutlinePercentage } from 'react-icons/ai';
import { BsTrash3 } from 'react-icons/bs';
import { MdOutlineModeOfTravel } from 'react-icons/md';
import { PiIdentificationCardBold } from 'react-icons/pi';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdAddCircle } from "react-icons/io";
import { isAllowedTo } from '@/utils';
import { Permissions } from '@/data/role-access-data';
import { RenderIf } from '@/components/common';
import BeatLoader from "react-spinners/BeatLoader";
import { useQuery } from "@tanstack/react-query";
import { MoyenApi } from '@/api/api';
import { CiEdit } from "react-icons/ci";


const DetailsMoyenTransport = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, refetch, data:moyen } = useQuery({
		queryKey: ["getDetailsMoyen", id],
		queryFn: async ({ queryKey, }) => {
			return MoyenApi.getSpecifiqMoyen(queryKey[1])
		},
		enabled: true,
    staleTime: 30 * 60 * 1000
	});

  const [_, dispatch] = useDialogController();

  const handleDelete = () => {
    typeof dispatch === 'function' && dispatch({
      type: "SET_DIALOG",
      value: {
        active: true,
        view: "confirmAction",
        value: {
          title: "Suppression du moyen de transport",
          message: "Voulez-vous vraiment supprimer le moyen de transport: [MoyenTransportName] ? Notez que cette action est irréversible.",
          onConfirm: async () => {
            // TODO: Perform delete here
          }
        }
      }
    });
  };

  // console.log(moyen);

  if (isLoading) {
    return <div className=" w-full h-screen flex justify-center items-center " >
      <BeatLoader color="grey" size={8} />
    </div>
  }

  return (
    <RenderIf allowedTo={Permissions.VIEW_A_TRANSPORT_MEAN_DETAILS}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">
            <div className='flex items-center' >
              <Tooltip content="Retour">
                <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                  <AiOutlineArrowLeft color='white' size={18} />
                </button>
              </Tooltip>
              <Typography variant="h6" color="blue-gray">
                {moyen?.data?.title}
              </Typography>
            </div>
            <div className=' flex flex-row gap-x-2 ' >

              {isAllowedTo(Permissions.EDIT_TRANSPORT_MEAN) &&
                <button
                  className="h-[40px] px-4 rounded-[5px] flex items-center gap-[5px] bg-white text-[green] text-[14px]"
                  onClick={() => navigate(`../edit`, { state: { moyen: moyen } })}
                >
                  Modifier
                  {/* <BsTrash3 size={17} /> */}
                </button>
              }
              
              {isAllowedTo(Permissions.DELETE_TRANSPORT_MEAN) &&
                <button
                  className="h-[40px] px-4 rounded-[5px] flex items-center gap-[5px] bg-white text-[#D95A4C] text-[14px]"
                  onClick={handleDelete}
                >
                  Supprimer
                  <BsTrash3 size={17} />
                </button>
              }

            </div>
          </CardHeader>
          <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none flex flex-col text-black text-[14px]">
            <h5
              className="font-bold pl-3 pb-2 border-b-[1px] border-[#E7E7E7] text-[#0F123E]"
            >Informations générales</h5>
            <div className="w-full flex items-start gap-[15px] mt-3">
              <div className="flex flex-col items-start">
                <img
                  src={moyen?.data?.illustrationPic}
                  className="h-[150px] object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col items-start gap-[15px]">
                <p className="">
                  <span className="font-bold">Intitulé : </span> {moyen?.data?.title}
                </p>
                <p className="">
                  <span className="font-bold">Disponibilité : </span> {moyen?.data?.isAccessible ? "Oui" : "Non"}
                </p>
                <p className="">
                  <span className="font-bold">Sur contact : </span> {moyen?.data?.onContact ? "Oui" : "Non"}
                </p>
                <div className="w-full flex items-center">
                  <span className="font-bold mr-3">Vers le client : </span> {moyen?.data?.comeToMe ? "Oui" : "Non"}
                  {/* <div className="flex flex-wrap items-start gap-[15px]">
                    <TransportMode>Mode 1</TransportMode>
                    <TransportMode>Mode 2</TransportMode>
                    <TransportMode>Mode 3</TransportMode>
                  </div> */}
                </div>
              </div>
              <div className="w-[1px] h-full bg-[#E7E7E7] rounded-full" />
              <div className="flex flex-col w-1/3">
                <span className="font-bold text-black mb-3">Description</span>
                <p
                  className="leading-[30px]"
                >{moyen?.data?.transportMoyenDescription}</p>
              </div>
            </div>

            <div className=" flex flex-row mt-[50px] mb-4 items-center gap-x-3 " >
              <h5
                className="font-bold pl-3 text-[rgb(15,18,62)]"
              >Classes disponibles</h5>

              {isAllowedTo(Permissions.ADD_CLASS) &&
                <button  onClick={() => navigate(`../add-class/`, { state: { moyen: moyen } })}className=" bg-green-500 h-[35px] w-[35px] rounded-md flex justify-center items-center " >
                  <IoMdAddCircle color='#fff' size={20} />
                </button>
              }
            </div>
            
            <div className="flex flex-wrap items-start gap-[15px]">
              
              {moyen?.data?.class?.map((val, id) => (
                <TransportClass key={"transportClass"+id} >
                  <div className="w-full bg-[#0F123E] text-white flex items-center py-[5px] pr-[10px]">
                    <span className="flex-1 px-[10px]">{val.className}</span>
                    <div className="min-w-[60px] text-center text-[13px] p-[5px] bg-white text-[#0F123E] font-bold rounded-[5px] relative bottom-[-20px] flex items-center justify-center gap-[5px]">
                      {val.travelCommissionForPlatformPercent} <AiOutlinePercentage size={15} />
                    </div>
                  </div>
                  <p className="p-[10px] pt-[20px] leading-[18px]">
                    {val.classDescription}
                  </p>
                </TransportClass>
              ))}
            </div>


            <h5
              className="font-bold pl-3 pb-2 mt-[50px] text-[#0F123E]"
            >Quelques statistiques</h5>
            <div className="w-full grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 bg-[#F6F7F8] p-[20px] pt-[35px] rounded-[10px] shadow-[0px_0px_10px_0px_#00000015_inset]">
              <StatisticsCard
                title="Courses"
                icon={<MdOutlineModeOfTravel className="w-6 h-6 text-white" />}
                color="orange"
                value={moyen?.data?._count.reservations}
              />
              <StatisticsCard
                title="Transporteurs"
                icon={<PiIdentificationCardBold className="w-6 h-6 text-white" />}
                color="green"
                value={moyen?.data?._count.drivers}
              />
              <StatisticsCard
                title="Véhicule"
                icon={<UserIcon className="w-6 h-6 text-white" />}
                color="pink"
                value={moyen?.data?._count.AllvehiculesOnTransportMoyen}
              />
            </div>


            <div className=" flex flex-row mt-[50px] mb-4 items-center gap-x-3 " >
              <h5 className="font-bold pl-3 text-[rgb(15,18,62)]">Pièce(s)</h5>
              {isAllowedTo(Permissions.EDIT_TRANSPORT_MEAN) &&
                <button  onClick={() => navigate(`../custom-piece/`, { state: { moyen: moyen } })} className=" bg-green-500 h-[35px] w-[35px] rounded-md flex justify-center items-center " >
                  <CiEdit color='#fff' size={20} />
                </button>
              }
            </div>

            <div className="flex flex-wrap flex-col items-start gap-[15px]">
              <span className="my-2 text-[12px] " >Pièce(s) pour l'inscription d'un conducteur</span>
              <div className=" w-full flex flex-row gap-[15px] " >
                {moyen?.data?.attachmentDriverRegister?.map((val, id) => (
                  <TransportClass key={"attachmentDriverRegister"+id} >
                    <div className="w-full bg-[#0F123E] text-white flex items-center py-[5px] pr-[10px]">
                      <span className="flex-1 px-[10px]">{val.title}</span>
                    </div>
                    <div className="p-[10px] pt-[20px] gap-x-2 flex flex-row flex-wrap leading-[18px]">
                      {val.extension.map((ext) => (
                        <Chip
                          variant="gradient"
                          color="green"
                          value={ext}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      ))}
                    </div>
                  </TransportClass>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap flex-col items-start mt-6 gap-[15px]">
              <span className="my-1 text-[12px] " >Pièce(s) pour l'ajout d'un véhicule</span>
              <div className=" w-full flex flex-row gap-[15px] " >
                {moyen?.data?.attachmentVehiculeRegister?.map((val, id) => (
                  <TransportClass key={"attachmentDriverRegister"+id} >
                    <div className="w-full bg-[#0F123E] text-white flex items-center py-[5px] pr-[10px]">
                      <span className="flex-1 px-[10px]">{val.title}</span>
                    </div>
                    <div className="p-[10px] pt-[20px] gap-x-2 flex flex-row flex-wrap leading-[18px]">
                      {val.extension.map((ext) => (
                        <Chip
                          variant="gradient"
                          color="green"
                          value={ext}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      ))}
                    </div>
                  </TransportClass>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap flex-col mt-6 items-start gap-[15px]">
              <span className="my-1 text-[12px] " >Champs pour l'ajout d'un véhicule</span>
              <div className=" w-full flex flex-row gap-[15px] " >
                {moyen?.data?.fieldVehiculeRegister?.map((val, id) => (
                  <TransportClass key={"attachmentDriverRegister"+id} >
                    <div className="w-full bg-[#0F123E] text-white flex items-center py-[5px] pr-[10px]">
                      <span className="flex-1 px-[10px]">{val.titleField}</span>
                    </div>
                    <div className="p-[10px] pt-[20px] gap-x-2 flex flex-row flex-wrap leading-[18px]">
                      <Chip
                        variant="gradient"
                        color="green"
                        value={val?.typeField}
                        className="py-0.5 px-2 text-[11px] font-medium"
                      />
                    </div>
                  </TransportClass>
                ))}
              </div>
            </div>

          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default DetailsMoyenTransport;

const TransportMode = styled.div`
  height: 30px;
  padding: 0 15px;
  border-radius: 5px;
  color: #0F123E;
  font-size: 12px;
  background: #0F123E10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransportClass = styled.div`
  width: 300px;
  border-radius: 10px;
  color: #0F123E;
  font-size: 12px;
  background: #0F123E10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;