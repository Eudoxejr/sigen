import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useDialogController } from '@/context/dialogueProvider';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa';
import dummyProfileImg from '/img/sigen/user.png';
import { isAllowedTo } from '@/utils';
import { Permissions } from '@/data/role-access-data';
import { RenderIf } from '@/components/common/render.if';


const DetailsUser = () => {
  const navigate = useNavigate();

  const [_, dispatch] = useDialogController();

  const { state: params } = useLocation();

  const [userData, setuserData] = useState(params?.user);

  const handleDelete = () => {
    typeof dispatch === 'function' && dispatch({
      type: "SET_DIALOG",
      value: {
        active: true,
        view: "suspendUser",
        value: {
          wasActive: !Boolean(userData?.isSuspend),
          user: userData,
          onCompleted: () => {
            setuserData(old => ({ ...old, isSuspend: !Boolean(old?.isSuspend) }));
          }
        },
      },
    });
  };

  return (
    <RenderIf allowedTo={Permissions.VIEW_A_USER_DETAILS}>
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
                {userData?.lastName ?? "-"} {userData?.firstName ?? ""}
              </Typography>
            </div>
            {isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_USER) &&
              <button
                className={`h-[40px] px-4 rounded-[5px] flex items-center gap-[5px] bg-white ${userData?.isSuspend ? "text-green-600" : "text-[#D95A4C]"} text-[14px]`}
                onClick={handleDelete}
              >
                {userData?.isSuspend ? "Activer" : "Suspendre"}
                {userData?.isSuspend ? <FaUserCheck size={17} /> : <FaUserTimes size={17} />}
              </button>
            }
          </CardHeader>
          <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none flex flex-col text-black text-[14px]">
            <div className="w-full flex flex-col items-center">
              <div className="rounded-[10px] overflow-hidden bg-white border-[1px] border-[#0F123E55] flex flex-col mt-[50px] w-[70%] relative">
                <div className="w-full px-[20px] h-[60px] border-b-[4px] font-bold border-[#0F123E] text-[#0F123E] bg-[#0F123E10] flex items-center">
                  Informations de l'utilisateur
                </div>
                <div className="h-[60px] w-[60px] rounded-full overflow-hidden bg-[#0F123E] p-[2px] absolute top-[20px] right-[15px]">
                  <img
                    src={userData?.photoProfil ?? dummyProfileImg}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="p-[12px] grid grid-cols-3 gap-[20px] pt-[20px]">
                  <div className="col-span-3 font-bold text-center">IDENTITÉ</div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Nom</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.lastName ?? "-"}</span>
                  </div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Prénoms</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.firstName ?? "-"}</span>
                  </div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Pseudonyme</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.pseudo ?? "-"}</span>
                  </div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Genre</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.sexe ?? "-"}</span>
                  </div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Date de naissance</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.birthdate ?? "-"}</span>
                  </div>
                  <div />
                  <div className="col-span-3 font-bold text-center">AUTRES INFOS</div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Adresse mail</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.email ?? "-"}</span>
                  </div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Téléphone</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.telephone ?? "-"}</span>
                  </div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Nationalité</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.nationality ?? "-"}</span>
                  </div>
                  <div className="flex flex-col gap-[10px] rounded-[5px] bg-[#00000008] p-[10px]">
                    <span className="font-bold text-[13px]">Pays de résidence</span>
                    <span className="text-black w-full p-2 bg-white border-[1px] border-[#0F123E22] rounded-[3px]">{userData?.country ?? "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default DetailsUser;