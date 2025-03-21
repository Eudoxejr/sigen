import React, { useState, useEffect } from 'react';
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
import { FiLoader } from 'react-icons/fi';
import { BsCaretRightFill } from 'react-icons/bs';
import { Rules } from '@/utils';
import Select from 'react-select';
import { Switch } from '@mui/material';
import { AdminsApi, RolesApi } from '@/api/api';
import { toast } from 'react-toastify';
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';


const CreateAdmin = () => {
  const navigate = useNavigate();

  const [createData, setCreateData] = useState({
    isSuperAdmin: false
  })
  const [defaultRole, setDefaultRole] = useState(null);
  const [dataError, setDataError] = useState({
    lastName: { value: false, message: "" },
    firstName: { value: false, message: "" },
    email: { value: false, message: "" },
    telephone: { value: false, message: "" },
    rolesId: { value: false, message: "" }
  })

  const [RolesList, setRolesList] = useState([]);
  const [pageIsLoading, setPageIsLoading] = useState(true);


  const setupPage = async () => {
    RolesApi.fetchAllRoles(1, 100)
      .then(({ data: response }) => {
        if (response) {
          if (Array.isArray(response)) {
            setRolesList(response.map((role) => {
              return { value: role.id, label: role.name, "permissions": (role.permissions ? role.permissions : []) }
            }));
          }
          else {
            setRolesList([]);
          }
        }
        else {
          setRolesList([]);
        }
      })
      .catch(err => {
        setRolesList([]);
      })
      .finally(() => setPageIsLoading(false));
  };

  useEffect(() => {
    setupPage();
  }, []);

  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  /**
   * Called when all the form is well validated
   */
  const handleSubmit = async () => {
    setLoading(true);

    let data = createData;

    if (!data.lastName) {
      setDataError({ ...dataError, lastName: { value: true, message: "Veuillez renseigner le nom de l'utilisateur" } })
      setLoading(false);
      return;
    }

    if (!data.firstName) {
      setDataError({ ...dataError, firstName: { value: true, message: "Veuillez renseigner le prénom de l'utilisateur" } })
      setLoading(false);
      return;
    }

    if (!data.email) {
      setDataError({ ...dataError, email: { value: true, message: "Veuillez renseigner l'email de l'utilisateur" } })
      setLoading(false);
      return;
    }
    else {
      let emailIsValid = await Rules.validateEmail(data.email);
      if (typeof (emailIsValid) !== 'boolean' || emailIsValid === false) {
        setDataError({ ...dataError, email: { value: true, message: "L'email n'est pas valide" } })
        setLoading(false);
        return;
      }
    }

    if (!data.telephone) {
      setDataError({ ...dataError, telephone: { value: true, message: "Veuillez renseigner le numéro de téléphone de l'utilisateur" } })
      setLoading(false);
      return;
    }


    if (!data.isSuperAdmin && !data.rolesId) {
      setDataError({ ...dataError, rolesId: { value: true, message: "Veuillez renseigner le rôle de l'utilisateur" } })
      setLoading(false);
      return;
    }

    if (data.isSuperAdmin) {
      data.role = "SUPERADMIN"
      data.rolesId = undefined
    }
    else {
      data.role = "ADMIN"
    }

    await AdminsApi.postAdmin(data)
      .then(({ data: response }) => {
        if (response?.success) {
          toast.success(`L'administrateur ${data?.lastName} ${data?.firstName} a été ajouté avec succès !`);
          navigate(-1);
        } else {
          if (response?.msg) {
            toast.error(response?.msg);
          }
          else {
            toast.error(`Une erreur est survenue lors de l'ajout de l'administrateur ${data?.lastName} ${data?.firstName}`);
          }

        }
      })
      .catch(err => {

        if (err?.response?.data?.msg) {
          if (err?.response?.data?.msg?.indexOf("Unique constraint failed on the fields: (`email`)") !== -1) {
            setDataError({ ...dataError, email: { value: true, message: "Un compte avec le même email existe déjà" } })
          }
          else if (err?.response?.data?.msg?.indexOf("Unique constraint failed on the fields: (`telephone`)") !== -1) {
            setDataError({ ...dataError, telephone: { value: true, message: "Un compte avec le même numéro de téléphone existe déjà" } })
          }
          else {
            toast.error(err?.response?.data?.msg);
          }
        }
        else {
          toast.error(`Une erreur est survenue lors de l'ajout de l'administrateur ${data?.lastName} ${data?.firstName}`);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <RenderIf allowedTo={Permissions.ADD_ADMIN}>
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
                Ajouter un administrateur
              </Typography>
            </div>
          </CardHeader>
          {pageIsLoading ?
            <div className="h-[calc(100vh-210px)] w-full flex items-center justify-center">
              <AiOutlineLoading className="animate-spin" size={40} />
            </div>
            :
            <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none flex flex-col text-black text-[14px]">
              <div className="w-full flex flex-col">
                <p
                  className="text-center w-[600px] leading-[30px] self-center mb-5"
                >Veuillez remplir convenablement les différents champs présentés sur cette page puis cliquez sur le bouton <span className="font-bold text-black">[ Enregistrer ]</span></p>
                <div className="w-[80%] self-center grid grid-cols-2 gap-[15px]">
                  <div className="mt-5">
                    <Input
                      label="Entrez le nom"
                      type="text" color="blue-gray" size="lg"
                      error={dataError.lastName.value}
                      onChange={e => {
                        setCreateData({ ...createData, lastName: e?.target?.value })
                        setDataError({ ...dataError, lastName: { value: false, message: "" } })
                      }}
                    />
                    {dataError.lastName.value && <span className="text-[#FF0000] text-[12px]">{dataError.lastName.message}</span>}
                  </div>
                  <div className="mt-5">
                    <Input
                      label="Entrez le prénom"
                      type="text" color="blue-gray" size="lg"
                      error={dataError.firstName.value}
                      onChange={e => {
                        setCreateData({ ...createData, firstName: e?.target?.value })
                        setDataError({ ...dataError, firstName: { value: false, message: "" } })
                      }}
                    />
                    {dataError.firstName.value && <span className="text-[#FF0000] text-[12px]">{dataError.firstName.message}</span>}
                  </div>
                  <div className="mt-5">
                    <Input
                      label="Entrez l'email"
                      type="text" color="blue-gray" size="lg"
                      error={dataError.email.value}
                      onChange={e => {
                        setCreateData({ ...createData, email: e?.target?.value })
                        setDataError({ ...dataError, email: { value: false, message: "" } })
                      }}
                    />
                    {dataError.email.value && <span className="text-[#FF0000] text-[12px]">{dataError.email.message}</span>}
                  </div>
                  <div className="mt-5">
                    <Input
                      label="Numéro de téléphone"
                      type="tel" color="blue-gray" size="lg"
                      error={dataError.telephone.value}
                      onChange={e => {
                        setCreateData({ ...createData, telephone: e?.target?.value })
                        setDataError({ ...dataError, telephone: { value: false, message: "" } })
                      }}
                    />
                    {dataError.telephone.value && <span className="text-[#FF0000] text-[12px]">{dataError.telephone.message}</span>}
                  </div>
                </div>
                <div className="w-[80%] self-center">
                  <p className="mt-[40px]">S'agit-il d'un super administrateur ? </p>
                  <div className="flex w-full items-center gap-[30px]">
                    Non
                    <Switch
                      defaultChecked={false}
                      onChange={(_, status) => {
                        setCreateData({ ...createData, isSuperAdmin: status })
                        if (!status) {
                          let roleFounded = RolesList.find((role) => role?.value === createData.rolesId)
                          setDefaultRole(roleFounded ? roleFounded : null)
                          setPermissions(roleFounded ? roleFounded.permissions : [])
                        }
                      }}
                    />
                    Oui
                  </div>
                  {!createData.isSuperAdmin &&
                    <>
                      <p className="mt-[40px]">Choisissez un rôle pour cet administrateur </p>
                      <div className="mt-2 w-full md:w-[400px]">
                        <Select
                          isClearable
                          defaultValue={defaultRole}
                          onChange={e => {
                            setCreateData({ ...createData, rolesId: e?.value })
                            if (e?.value) {
                              setPermissions(e.permissions)
                            }
                            else {
                              setPermissions([]);
                            }
                            setDataError({ ...dataError, rolesId: { value: false, message: "" } })
                          }}
                          options={RolesList}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              border: dataError.rolesId.value ? '1px solid red' : undefined,
                              height: 44,
                              fontSize: 13,
                              color: "red",
                              zIndex: 100
                            }),
                          }}
                          placeholder="Choisir un rôle"
                        />
                        {dataError.rolesId.value && <span className="text-[#FF0000] text-[12px]">{dataError.rolesId.message}</span>}
                      </div>
                      <p className="mt-[40px]">Liste des permissions associées : </p>
                      <div className="w-full grid grid-cols-3 gap-[15px] mt-5">
                        {permissions.map((permission) => {
                          return (
                            <div key={"permission-" + permission.id} className="flex items-center gap-[15px]">
                              <BsCaretRightFill size={15} className="text-[#0F123E]" />
                              <span>{permission.description}</span>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  }
                  <div className="w-full flex flex-col items-center text-[14px] mt-[100px]">
                    <SubmitButton
                      className={loading ? "loading" : ""}
                      onClick={handleSubmit}
                    >
                      Enregistrer
                      {loading && <FiLoader size={20} className="ml-4 animate-spin" />}
                    </SubmitButton>
                  </div>
                </div>
              </div>
            </CardBody>
          }
        </Card>
      </div>
    </RenderIf>
  );
};

export default CreateAdmin;

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