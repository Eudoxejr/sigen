import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineLoading } from 'react-icons/ai';
import styled from '@emotion/styled';
import { FaKey } from 'react-icons/fa';
import { TbPhotoPlus } from 'react-icons/tb';
import { Checkbox } from '@mui/material';
import { BsTrash3 } from 'react-icons/bs';
import { useDialogController } from '@/context/dialogueProvider';
import { RolesApi } from '@/api/api';
import { toast } from 'react-toastify';
import { FiLoader } from 'react-icons/fi';
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';
import { isAllowedTo } from '@/utils';

const sxStyle = {
  color: "#0F123E",
  '&.Mui-checked': {
    color: "#0F123E",
  },
};

const RoleDetails = () => {
  const inputRef = React.useRef();

  const navigate = useNavigate();

  const [PermissionsList, setPermissionsList] = useState([]);

  const { state: params } = useLocation();

  const { id: roleId } = useParams();

  const [roleData, setRoleData] = useState(params?.role);

  const [_, dispatch] = useDialogController();

  const [fields, setFields] = useState({
    title: "",
    icon: "",
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
   * Delete a role
   */
  const handleDelete = () => {
    typeof dispatch === 'function' && dispatch({
      type: "SET_DIALOG",
      value: {
        active: true,
        view: "confirmAction",
        value: {
          title: "Suppression de rôle",
          message: `Voulez-vous vraiment supprimer le rôle "${params?.role?.name ?? "-"}" ? Notez que cette action est irréversible.`,
          onConfirm: async () => {
            if (!!roleId) {
              setPageIsLoading(true);
              await RolesApi.deleteRole(roleId)
                .then(({ data: response }) => {
                  if (response?.success) {
                    toast.success(`Le rôle ${roleData?.name} a été supprimé avec succès !`);
                    navigate(-1);
                  } else {
                    toast.error("Une erreur est survenue lors de la suppression du rôle");
                  }
                })
                .catch(err => {
                  toast.error("Une erreur est survenue lors de la suppression du rôle");
                })
                .finally(() => setPageIsLoading(false));
            } else {
              toast.warn("Impossible de supprimer le rôle. Veuillez recharger la page.")
            }
          }
        }
      }
    });
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
   * Logic for page setup on page load, fetching of needed permissions and role data
   */
  const [pageIsLoading, setPageIsLoading] = useState(true);

  const handleRedirect = (withMessage = "") => {
    typeof dispatch === 'function' && dispatch({
      type: "SET_DIALOG",
      value: {
        active: true,
        view: "messageAlert",
        value: {
          title: "Oops !",
          message: withMessage,
          actionTitle: "Retour",
          onClose: async () => {
            navigate(-1);
          }
        }
      }
    });
  };

  const fetchPermissions = async (onFinished = (() => { })) => {
    await RolesApi.fetchAllPermissions()
      .then(({ data: response }) => {
        if (response?.success) {
          onFinished({
            success: true,
            data: Array.isArray(response?.data) ? response?.data : [],
            message: ""
          });
        } else {
          onFinished({ success: false, data: [], message: response?.msg });
        }
      })
      .catch(err => {
        onFinished({ success: false, data: [], message: err?.response?.data?.msg });
      })
  };

  const fetchRole = async (onFinished = (() => { })) => {
    await RolesApi.fetchRoleByID(roleId)
      .then(({ data: response }) => {
        if (response?.success) {
          onFinished({ success: true, data: response?.data, message: "" });
        } else {
          onFinished({ success: false, data: null, message: response?.msg });
        }
      })
      .catch(err => {
        onFinished({ success: false, data: null, message: err?.response?.data?.msg });
      })
  };

  useEffect(() => {
    setPageIsLoading(true);
    fetchRole(roleResponse => {
      if (roleResponse?.success) {
        setRoleData(roleResponse?.data);

        setFields(old => ({
          ...old,
          title: roleResponse?.data?.name,
          icon: null,
          access: roleResponse?.data?.permissions
        }));

        fetchPermissions(permsResponse => {
          setPageIsLoading(false);
          if (permsResponse?.success) {
            setPermissionsList(permsResponse?.data);
          } else {
            setPermissionsList([]);
            handleRedirect(`Une erreur est survenue au chargement de la page`);
          }
        });
      } else {
        setPageIsLoading(false);
        handleRedirect(`Une erreur est survenue au chargement de la page`);
      }
    });
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

    await RolesApi.updateRole(roleData?.id, {
      name: fields?.title,
      permissionsIds: fields?.access?.map(el => el?.id)
    })
      .then(({ data: response }) => {
        if (response?.success) {
          toast.success(response?.msg);
          navigate(-1);
        } else {
          toast.error(`Une erreur est survenue à la mise à jour du rôle`);
        }
      })
      .catch(err => {
        toast.error(`Une erreur est survenue à la mise à jour du rôle`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <RenderIf allowedTo={Permissions.EDIT_ROLE}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <input
          ref={inputRef}
          type="file"
          onChange={handleIconPicked}
          accept=".png,.jpg,.jpeg"
          style={{ display: "none" }}
        />
        <Card>
          <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between">
            <div className='flex items-center' >
              <Tooltip content="Retour">
                <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                  <AiOutlineArrowLeft color='white' size={18} />
                </button>
              </Tooltip>
              <Typography variant="h6" color="blue-gray">
                Configurations du rôle : {roleData?.name ?? "-"}
              </Typography>
            </div>
            {isAllowedTo(Permissions.DELETE_ROLE) &&
              <button
                className="h-[40px] px-4 rounded-[5px] flex items-center gap-[5px] bg-white text-[#D95A4C] text-[14px]"
                onClick={handleDelete}
              >
                Supprimer
                <BsTrash3 size={17} />
              </button>
            }
          </CardHeader>
          {pageIsLoading ?
            <div className="h-[calc(100vh-210px)] w-full flex items-center justify-center">
              <AiOutlineLoading className="animate-spin" size={40} />
            </div>
            :
            <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none">
              <div className="w-[400px] mt-5">
                <Input
                  label="Titre du rôle"
                  value={fields?.title}
                  onChange={e => setFields(old => ({ ...old, title: e?.target?.value }))}
                  type="text" color="blue-gray" size="lg"
                />
              </div>
              <p className="mt-[50px]">Veuillez choisir une icône si vous ne voulez pas utiliser l'icône par défaut (Facultatif)</p>
              {/* TODO: Display next text only when a custom icon was set on the role  */}
              <p className="mt-2">Pour changer l'icône actuelle, vous pouvez cliquer la dessus pour choisir une autre.</p>
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
              <div className="w-full flex items-center justify-center mt-[30px] relative">
                <p className="px-5 h-[35px] text-[13px] bg-white z-10 border-[1px] border-[#AAAAAA] rounded-[5px] flex items-center justify-center">Liste des accès configurés sur ce rôle</p>
                <div className="h-[1px] w-[90%] bg-[#AAAAAA] absolute" />
              </div>
              <p className="mt-5">Cochez les accès auquels à droit un utilisateur ayant ce rôle </p>
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
                  Enregistrer les modifications
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

export default RoleDetails;

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