import useAuth from "@/hooks/useAuth";
import styled from "@emotion/styled";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  CardHeader,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


export function Profile() {
  const navigate = useNavigate();

  const { auth: currentUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">
          <div className='flex items-center' >
            <Tooltip content="Retour">
              <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                <AiOutlineArrowLeft color='white' size={18} />
              </button>
            </Tooltip>
            <Typography variant="h6" color="blue-gray">
              Mon compte
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {currentUser?.lastName ?? "-"} {currentUser?.firstName ?? ""}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {currentUser?.role ?? "-"}
                </Typography>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-3 gap-[20px]">
            <div className="col-span-2 flex flex-col border-r-[1px] border-[#0002]">
              <h5 className="col-span-2 font-bold text-black mb-3">Informations générales</h5>
              <div className="w-full grid grid-cols-2 gap-[20px] pr-[20px]">
                <Input
                  label="Nom"
                  type="text" color="blue-gray" size="lg"
                  value={currentUser?.lastName ?? ""}
                  readOnly
                />
                <Input
                  label="Prénom"
                  type="text" color="blue-gray" size="lg"
                  value={currentUser?.firstName ?? ""}
                  readOnly
                />
                <Input
                  label="Email"
                  type="email" color="blue-gray" size="lg"
                  value={currentUser?.email ?? ""}
                  readOnly
                />
                <Input
                  label="Téléphone"
                  type="text" color="blue-gray" size="lg"
                  value={currentUser?.telephone ?? ""}
                  readOnly
                />
                <Input
                  label="Genre"
                  type="text" color="blue-gray" size="lg"
                  value={currentUser?.sexe ?? ""}
                  readOnly
                />
                <div className="col-span-2 flex items-center justify-center pt-4">
                  <SubmitButton
                    className={`w-[200px]`}
                  >
                    Mettre à jour
                  </SubmitButton>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h5 className="col-span-2 font-bold text-black mb-3">Changer mon mot de passe</h5>
              <div className="w-full flex flex-col gap-[20px] pr-[20px]">
                <Input
                  label="Ancien mot de passe"
                  type={showPassword ? "text" : "password"} color="blue-gray" size="lg"
                  icon={showPassword ? <BsEye onClick={() => setShowPassword(old => !old)} className="cursor-pointer" /> : <BsEyeSlash onClick={() => setShowPassword(old => !old)} className="cursor-pointer" />}
                />
                <Input
                  label="Nouveau mot de passe"
                  type={showPassword ? "text" : "password"} color="blue-gray" size="lg"
                  icon={showPassword ? <BsEye onClick={() => setShowPassword(old => !old)} className="cursor-pointer" /> : <BsEyeSlash onClick={() => setShowPassword(old => !old)} className="cursor-pointer" />}
                />
                <Input
                  label="Confirmation du nouveau mot de passe"
                  type={showPassword ? "text" : "password"} color="blue-gray" size="lg"
                  icon={showPassword ? <BsEye onClick={() => setShowPassword(old => !old)} className="cursor-pointer" /> : <BsEyeSlash onClick={() => setShowPassword(old => !old)} className="cursor-pointer" />}
                />
                <SubmitButton
                  className={`w-[200px] self-center mt-4`}
                >
                  Valider
                </SubmitButton>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;

const SubmitButton = styled.button`
  height: 45px;
  background: #0F123E;
  color: white;
  border: 2px solid #0000;
  border-radius: 7px;
  transition: all 0.2s ease-in-out;
  &.loading {
    background: white !important;
    color: #0F123E !important;
    border: 2px solid #0F123E !important;;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    background: #0F123EEE;
    color: white;
    border: 2px solid #0000;
    transition: all 0.2s ease-in-out;
  }
`;