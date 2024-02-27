import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineLoading } from 'react-icons/ai';
import styled from '@emotion/styled';
import { FaKey } from 'react-icons/fa';
import { TbPhotoPlus } from 'react-icons/tb';
import { Checkbox } from '@mui/material';
import { toast } from 'react-toastify';
import { RolesApi } from '@/api/api';
import { BsTrash3 } from 'react-icons/bs';
import { FiLoader } from 'react-icons/fi';
import { RenderIf } from '@/components/common';
import { Permissions } from '@/data/role-access-data';

const sxStyle = {
  color: "#0F123E",
  '&.Mui-checked': {
    color: "#0F123E",
  },
};

const AddRole = () => {
  const inputRef = React.useRef();

  const navigate = useNavigate();

  const [PermissionsList, setPermissionsList] = useState([]);

  const [fields, setFields] = useState({
    title: "",
    icon: null,
    access: []
  });

  /**
   * Listener for when access checked changes
   */
  const onAccessChanged = (access, toStatus) => {
    if (toStatus) {
      setFields(old => ({
        ...old,
        access: [...old.access, access]
      }));
    } else {
      setFields(old => ({
        ...old,
        access: old.access.filter(el => el?.name !== access?.name)
      }));
    }
  };

  /**
   * Listener for when user choose an icon file
   */
  const handleIconPicked = (e) => {
    if (e?.target?.files[0]?.size > 2097152) {
      toast.error("Taille de l'icône trop élevée (2 Mo maximum) !");
      return;
    }

    if (!!e?.target?.files[0]) {
      setFields(old => ({ ...old, icon: e?.target?.files[0] }));
    }
  };

  /**
   * Logic for page setup on page load, fetching of needed permissions
   */
  const [pageIsLoading, setPageIsLoading] = useState(true);

  const setupPage = async () => {
    await RolesApi.fetchAllPermissions()
      .then(({ data: response }) => {
        if (response?.success) {
          setPermissionsList(Array.isArray(response?.data) ? response?.data : []);
        } else {
          setPermissionsList([]);
        }
      })
      .catch(err => {
        setPermissionsList([]);
      })
      .finally(() => setPageIsLoading(false));
  };

  useEffect(() => {
    setupPage();
  }, []);

  /**
   * Logic of submission when user click on Validate button
   */
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!!!fields?.title) {
      toast.warn("Veuillez renseigner le titre du rôle");
      return;
    }
    if (fields?.access?.length === 0) {
      toast.warn("Veuillez cocher au moins un accès pour ce rôle");
      return;
    }

    setLoading(true);

    await RolesApi.postRole({
      name: fields?.title,
      permissionsIds: fields?.access?.map(el => el?.id)
    })
      .then(({ data: response }) => {
        if (response?.success) {
          toast.success(`Le role ${fields?.title} a été ajouté avec succès !`);
          navigate(-1);
        } else {
          toast.error(`Une erreur est survenue lors de l'ajout du rôle ${fields?.title}`);
        }
      })
      .catch(err => {
        toast.error(`Une erreur est survenue lors de l'ajout du rôle ${fields?.title}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <RenderIf allowedTo={Permissions.ADD_ROLE}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <input
          ref={inputRef}
          type="file"
          onChange={handleIconPicked}
          accept=".png,.jpg,.jpeg"
          style={{ display: "none" }}
        />
        <Card>
          <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">
            <div className='flex items-center' >
              <Tooltip content="Retour">
                <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                  <AiOutlineArrowLeft color='white' size={18} />
                </button>
              </Tooltip>
              <Typography variant="h6" color="blue-gray">
                Ajout d'un rôle
              </Typography>
            </div>
          </CardHeader>
          {pageIsLoading ?
            <div className="h-[calc(100vh-210px)] w-full flex items-center justify-center">
              <AiOutlineLoading className="animate-spin" size={40} />
            </div>
            :
            <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none flex flex-col text-black text-[14px]">
              <p
                className="text-center w-[600px] leading-[30px] self-center mb-5"
              >Veuillez remplir convenablement les différents champs présentés sur cette page, et cocher les accès à activer pour ce rôle. Puis cliquez sur le bouton <span className="font-bold text-black">[ Enregistrer ]</span></p>
              <div className="w-[400px] mt-5">
                <Input
                  label="Entrez le titre du rôle"
                  value={fields?.title}
                  onChange={e => setFields(old => ({ ...old, title: e?.target?.value }))}
                  type="text" color="blue-gray" size="lg"
                />
              </div>
              <p className="mt-[50px]">Veuillez choisir une icône si vous ne voulez pas utiliser l'icône par défaut (Facultatif)</p>
              <div className="flex items-center mt-4 gap-[20px]">
                <div className="flex flex-col items-center gap-[10px]">
                  <div className="h-[60px] w-[60px] rounded-full text-[#0F123E] bg-[#0F123E15] flex items-center justify-center">
                    <FaKey size={20} />
                  </div>
                  <span className="text-[12px]">Icône par défaut</span>
                </div>
                <div className="flex flex-col items-center gap-[10px]">
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="h-[60px] w-[60px] rounded-full overflow-hidden text-[#0F123E] bg-[#0F123E15] border-[#0F123E77] border-[2px] p-[1px] flex items-center justify-center"
                  >
                    {!!fields?.icon ?
                      <img
                        src={URL.createObjectURL(fields?.icon)}
                        className="h-full w-full rounded-full object-cover"
                      />
                      :
                      <TbPhotoPlus size={20} />
                    }
                  </button>
                  <span className="text-[12px]">Choisir une icône</span>
                </div>
                {!!fields?.icon &&
                  <BsTrash3
                    size={20} className="mb-[25px] ml-5 cursor-pointer"
                    onClick={() => setFields(old => ({ ...old, icon: null }))}
                  />
                }
              </div>
              <p className="mt-[50px]">Cochez les accès auquels à droit un utilisateur ayant ce rôle </p>
              <div className="w-full flex flex-wrap items-center mt-4">
                {PermissionsList.map(el => {
                  const isChecked = fields?.access?.some(acc => acc?.name === el?.name);

                  return (
                    <div key={el?.id} className="w-1/2 flex items-center px-3 py-1">
                      <Checkbox
                        checked={isChecked}
                        color="success"
                        size="small"
                        sx={sxStyle}
                        onChange={() => onAccessChanged(el, !isChecked)}
                      />
                      <p
                        className="leading-[30px] cursor-pointer"
                        onClick={() => onAccessChanged(el, !isChecked)}
                      >{el?.description ?? ""}</p>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex flex-col items-center text-[14px] my-[50px]">
                <SubmitButton
                  className={loading ? "loading" : ""}
                  onClick={handleSubmit}
                >
                  Enregistrer
                  {loading && <FiLoader size={20} className="ml-4 animate-spin" />}
                </SubmitButton>
              </div>
            </CardBody>
          }
        </Card>
      </div>
    </RenderIf>
  );
};

export default AddRole;

const SubmitButton = styled.button`
  height: 50px;
  width: 350px;
  background: #0F123E;
  color: white;
  border: 2px solid #0000;
  border-radius: 7px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
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