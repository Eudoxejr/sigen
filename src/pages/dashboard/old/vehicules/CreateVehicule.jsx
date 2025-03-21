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
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { TfiHandPointLeft } from 'react-icons/tfi';
import { LuFileInput } from 'react-icons/lu';
import styled from '@emotion/styled';
import { VehicleApi } from '@/api/api';
import BeatLoader from "react-spinners/BeatLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Switch from '@mui/material/Switch';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AiFillEuroCircle } from "react-icons/ai";
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { DriverApi } from '@/api/api';
import dayjs from 'dayjs';
import { useDialogController } from '@/context/dialogueProvider';
import { toast } from 'react-toastify';
import { produce } from "immer"
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';
import { uploadFile } from '@/utils/uploadS3';



const CreateVehicule = () => {

  const navigate = useNavigate();
  const [idTransport, setIdTransport] = useState(null);
  const [_, dispatch] = useDialogController();
  const queryClient = useQueryClient();

  const schema = yup.object({
    idTransportMoyen: yup.string().required("Selectionner un moyen de transport"),
    dailyVehiculeLocationCommission: yup.number().required("Entrez le prix journalier de location de la voiture"),
    attachementArray: yup.array().of(
      yup.object({
          idAttachement: yup.string().trim().required(),
          urlAttachement: yup.string().url().required(),
          extension: yup.string().trim().required(),
          expirationDate: yup.string().trim()
      })
    ).min(1, "Entrez un array de licence. si le moyen de transport n'en nécessite pas, ne renseigner pas la clé LicenseArray"),
    AllClassOnVehicule: yup.array().of(
      yup.string().required("L'Id de la classe est requis")
    ),
    infoVehicule: yup.array().of(
      yup.object({
        idField: yup.string().trim().required(),
        titleField: yup.string().trim().required(),
        value: yup.string().trim().required()
      })
    ),
    rental: yup.boolean().required("le champ est requis"),
    driverId: yup.string().when(['rental'], ([rental], schema) => {
      if (rental) {
        return schema.required("L'id du driver est requis")
      }
    }),
    startDate: yup.date().when(['rental'], ([rental], schema) => {
      if (rental) {
        return schema.required("La date de début est requis")
      }
    }),
    endDate: yup.date().when(['rental'], ([rental], schema) => {
      if (rental) {
        return schema.required("La date de fin est requis")
      }
    })
  }).required();

  const { control, watch, setValue, handleSubmit, setError, formState: { errors, isDirty } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rental: false
    }
  });

  const [attachements, setAttachements] = useState([]) 
  const [attachementArray, setAttachementArray] = useState([])

  const [fileErrors, setFileErrors] = useState([])

  const { mutate, isLoading: mutateLoad } = useMutation({

    mutationFn: async (data) => {
      let newErrors = []
      let asyncUploadFiles = []
      attachementArray.forEach((value,index) => {
        if(value.file && (value.extension === "png" || value.extension === "jpeg" || value.extension === "jpg" || value.extension === "pdf"))
        {
          asyncUploadFiles.push(uploadFile(value.file))
        }
        else
        {
          newErrors[index] = "Impossible de télécharger le fichier. Veuillez réessayer."
        }
      })
      let filesUploaded = await Promise.all(asyncUploadFiles)
      filesUploaded.forEach((value,index) => {
        if(value.Location)
        {
          attachementArray[index].urlAttachement = value.Location
        }
        else
        {
          newErrors[index] = "Impossible de télécharger le fichier. Veuillez réessayer."
        }
      })

      if(newErrors.length > 0)
      {
        data.attachementArray = []
      }
      else
      {
        data.attachementArray = attachementArray
      }

      setFileErrors(newErrors)
      
      return VehicleApi.createVehicule(data)
      
    },
    gcTime: 0,
    onSuccess: (response) => {

      // console.log(response);
      navigate(-1)
      toast.success('véhicule ajouté avec succès', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      queryClient.setQueriesData(["getVehicle"], (dataVehicule) => {
        const nextData = produce(dataVehicule, draftData => {
          draftData.data.unshift(response.data)
          draftData.meta.total = dataVehicule.meta.total + 1
        })
        return nextData;
      })

      // setState(response.data)
      dispatch({
        type: "SET_BACKDROP",
        value: false
      })

    },
    onError: ({ response }) => {

      setError('root.serverError', {
        message: response.data.msg || "Une erreur s'est produite lors de l'ajout du véhicule"
        // message: "Une erreur s'est produite lors de la connexion"
      })

      toast.error(response.data.msg || 'Une Erreur s\'est produite', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      dispatch({
        type: "SET_BACKDROP",
        value: false
      })

    }

  })

  const handleClick = async (data) => {
    if (data.rental) {
      data.endDate = dayjs(data.endDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      data.startDate = dayjs(data.startDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    }
    // console.log(data)
    dispatch({
      type: "SET_BACKDROP",
      value: true
    })
    mutate(data)
  };

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "infoVehicule", // unique name for your Field Array
  });

  const watchMoyen = watch("idTransportMoyen");
  const watchClass = watch("AllClassOnVehicule", []);
  const watchInfoVehicule = watch("infoVehicule");
  const watchRental = watch("rental");

  const { isLoading, refetch, data: transportMoyens } = useQuery({
    queryKey: ["getTransportMoyenWhenCreateVehicule", idTransport],
    queryFn: async ({ queryKey, }) => {
      return VehicleApi.getTransportWhenCreateVehicule(queryKey[1])
    },
    enabled: true,
    onSuccess: (data) => {

      if (idTransport == null) {
        setValue("idTransportMoyen", data?.data?.transportMoyen?.[0].idTransportMoyen)
        // setValue("AllClassOnVehicule", data?.data?.other?.class)
      }
      let fields = [];
      data?.data?.other?.fieldVehiculeRegister.map((item) => {
        if (item.typeField === "text") {
          fields.push(item)
        }
      });
      setValue("infoVehicule", fields)

      let attachements = []
      data?.data?.other?.attachmentVehiculeRegister.map((item) => {
        attachements.push(item)
      })
      
      setAttachements(attachements)
    },
  })

  if (isLoading && transportMoyens?.data?.transportMoyen?.length > 0) {
    return <div className=" w-full h-screen flex justify-center items-center " >
      <BeatLoader color="grey" size={8} />
    </div>
  }

  const getDriver = async (inputValue) => {
    const res = await DriverApi.getDriver(1, 15, ["DRIVER"], inputValue, watchMoyen, true)
    // console.log(res.data);
    // res.data.unshift({idTransportMoyen: null, title: 'Tout les moyens de transport'})
    return res.data.map((data) => { return { value: data?.idUser, label: data?.firstName + " " + data?.lastName, photoProfil: data?.photoProfil, email: data?.email, telephone: data?.telephone } })
  };

  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(getDriver(inputValue))
    }
    );

  const CustomOption = (props) => {
    return (
      <components.Option {...props}>
        <div className=" flex flex-1 flex-col " >
          <span>
            {props.label}
          </span>
          <span>
            {props?.data?.email || "" + " " + props?.data?.telephone}
          </span>
        </div>
      </components.Option>
    );
  };

  useEffect(() => {
    
    if(Array.isArray(attachementArray) && attachementArray.length > 0)
    {
      let newAttachementArray = attachementArray.filter((value,index) => {
        return attachements.findIndex(a => a.idAttachement === value.idAttachement) !== -1
      })
      attachements.forEach((value,index) => {
        if(newAttachementArray.findIndex(a => a.idAttachement === value.idAttachement) === -1)
        {
          newAttachementArray.push({
            idAttachement: value.idAttachement,
            urlAttachement: undefined,
            extension: undefined,
            expirationDate: undefined,
            file: undefined
          })
        }
      })
      setAttachementArray(newAttachementArray)
    }
    else
    {
      let newAttachementArray = []
      attachements.map((item) => {
        newAttachementArray.push({
          idAttachement: item.idAttachement,
          urlAttachement: undefined,
          extension: undefined,
          expirationDate: undefined,
          file: undefined
        })
      })
      setAttachementArray(newAttachementArray)
    }
  }, [attachements]);

  return (
    <RenderIf allowedTo={Permissions.ADD_VEHICLE}>
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
                Ajouter un véhicule
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-4 pt-3 pb-[100px] h-[calc(100vh-210px)] overflow-auto shadow-none">

            <div className="w-full flex flex-col text-[14px] gap-[20px]">
              <p className="w-[700px] leading-[30px]">Pour ajouter un nouveau véhicule, veuillez remplir convenablement les différents champs présentés sur cette page puis cliquer sur le bouton <span className="font-bold text-black">[ Enregistrer le véhicule ]</span>. Notez que les véhicules ajoutés dans cette interface <span className="font-bold text-black">appartiennent à l'entreprise TPT973.</span></p>
              <p>Veuillez sélectionner un moyen de transport en cliquant dessus :</p>
              <div className="w-full flex items-center flex-wrap gap-[20px]">

                {transportMoyens?.data?.transportMoyen?.map((item, key) => (
                  <Moyen key={key} onClick={() => { setValue("idTransportMoyen", item.idTransportMoyen), setIdTransport(item.idTransportMoyen) }} className={watchMoyen === item.idTransportMoyen ? "active" : null}>
                    <img alt={`Voiture`} src={item.illustrationPic} />
                    <div className="title">{item.title}</div>
                  </Moyen>
                ))}

              </div>
            </div>

            <div className="w-full flex items-center text-[14px] gap-[20px] mt-[50px]">
              <Controller
                render={({
                  field: { ref, onChange, value, ...field },
                  fieldState: { invalid, error },
                }) => (
                  <div className="flex flex-col gap-[15px]">
                    <Input
                      // onChange={onChange} 
                      className=" h-[40px] w-[500px] "
                      label="Prix journalier de la location à un chaffeur"
                      value={value}
                      onChange={onChange}
                      type="number" step={0.5}
                      icon={<AiFillEuroCircle size={20} color='grey' />} color="blue-gray"
                      size="lg"
                      error={invalid}
                    />
                    {error &&
                      <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                    }
                  </div>
                )}
                name={`dailyVehiculeLocationCommission`}
                control={control}
              />
            </div>

            {isLoading ?
              <BeatLoader color="grey" size={8} />
              :
              <>
                {transportMoyens?.data?.other?.class.length > 0 &&
                  <div className="w-full flex flex-col text-[14px] gap-[20px] mt-[50px]">
                    <p>Veuillez sélectionner le ou les classes disponibles pour ce véhicule :</p>
                    <div className="w-full flex items-center flex-wrap gap-[20px]">
                      {transportMoyens?.data?.other?.class?.map((item, key) => (
                        <VehicleClass
                          key={key}
                          onClick={() => {
                            if ([...watchClass].includes(item.idClass)) {
                              const updatedArray = watchClass.filter(id => id !== item.idClass);
                              setValue("AllClassOnVehicule", updatedArray);
                            }
                            else {
                              // console.log(item.idClass)
                              setValue("AllClassOnVehicule", [...watchClass, item.idClass])
                            }

                          }}
                          className={[...watchClass].includes(item.idClass) ? "active" : null}
                        >
                          {item.className}
                        </VehicleClass>
                      ))}
                    </div>
                  </div>
                }

                {(attachements?.length > 0) &&
                  <div className="w-full flex flex-col text-[14px] gap-[20px] mt-[50px]">
                    <p>Nous avons besoin des pièces du véhicule pour créer ce véhicule. Veuillez remplir les champs ci-dessous :</p>
                    {attachements?.map((attachement, index) => (
                      <div className="w-[600px]" key={attachement.idAttachement}>
                        {(attachementArray[index]?.file && 
                        (attachementArray[index]?.extension === "png" || attachementArray[index]?.extension === "jpeg" || attachementArray[index]?.extension === "jpg")) && 
                          <figure>
                            <img
                              className="h-96 w-full rounded-lg object-cover object-center border-solid border-2 border-green-600"
                              src={URL.createObjectURL(attachementArray[index].file)}
                              alt={attachement.title}
                            />
                            <Typography as="caption" variant="small" className="mt-2 text-center font-normal">
                              {attachement.title}
                            </Typography>
                          </figure>
                        }
                        {(attachementArray[index]?.file && attachementArray[index]?.extension === "pdf") && 
                          <div className="bg-green-600 text-white text-center rounded-lg border-solid border-2 border-green-800">
                            <a href={URL.createObjectURL(attachementArray[index]?.file)} target="_blank">Ouvrir le fichier PDF : {attachement.title}</a>
                          </div>
                        }
                        <br/>
                        <Input
                          label={attachement.title}
                          onChange={(e) => {
                            
                            const newFile = e.target.files[0];
                            let extension = undefined
                            let attachementIndex = attachementArray.findIndex(a => a.idAttachement === attachement.idAttachement)

                            if(newFile.type.startsWith('image/png'))
                            {
                              extension = "png"
                            }
                            else if(newFile.type.startsWith('image/jpeg'))
                            {
                              extension = "jpeg"
                            }
                            else if(newFile.type.startsWith('image/jpg'))
                            {
                              extension = "jpg"
                            }
                            else if(newFile.type.startsWith('application/pdf'))
                            {
                              extension = "pdf"
                            }
                            else
                            {
                              let newErrors = Array.from(fileErrors)
                              newErrors[attachementIndex] = "Le fichier est dans un format invalide. (accepte uniquement pdf, .jpg, .jpeg et .png)"
                              setFileErrors(newErrors)
                            }
                            
                            let newAttachementArray = Array.from(attachementArray);
                            newAttachementArray[attachementIndex] = {...newAttachementArray[attachementIndex],file: newFile,extension}
                            setAttachementArray(newAttachementArray)
                          }}
                          type="file" color="blue-gray" size="lg"
                          accept=".pdf, .jpg, .jpeg, .png"
                          name={attachement.idAttachement}
                        />
                        <br/>
                        <Input 
                          label={"Date d'expiration de : " + attachement.title}
                          type='date' color="blue-gray" size="lg"
                          onChange={(e) => {
                            console.log(e.target.value)
                            let attachementIndex = attachementArray.findIndex(a => a.idAttachement === attachement.idAttachement)
                            let newAttachementArray = Array.from(attachementArray);
                            newAttachementArray[attachementIndex] = {...newAttachementArray[attachementIndex],expirationDate: e.target.value}
                            setAttachementArray(newAttachementArray)
                          }}
                          name={attachement.idAttachement + "#e" +index}
                        />
                        {fileErrors[index] &&
                          <span className=" text-[11px] text-red-400 mt-1" >{fileErrors[index]}</span>
                        }
                    </div>
                    ))}
                  </div>
                }


                {fields.length > 0 &&
                  <div className="w-full flex flex-col text-[14px] gap-[20px] mt-[50px]">
                    <p>Nous avons besoin de quelques informations supplémentaires pour créer ce véhicule. Veuillez remplir les champs ci-dessous :</p>
                    {fields?.map((field, index) => (
                      <Controller
                        key={field.id}
                        render={({
                          field: { ref, onChange, value },
                          fieldState: { invalid, error },
                        }) => (
                          <div className="w-[600px]">
                            <Input
                              label={field.titleField}
                              onChange={onChange}
                              type="text" color="blue-gray" size="lg"
                              value={value}
                            />
                            {error &&
                              <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                            }
                          </div>
                        )}
                        name={`infoVehicule[${index}].value`}
                        control={control}
                      />
                    ))}
                  </div>
                }


                <div className="w-full flex flex-col text-[14px] gap-[20px] mt-[50px]">

                  <p>Vous pouvez louer cette voiture à un chaffeur en remplissant les champs ci-dessous :</p>

                  <Controller
                    render={({
                      field: { onChange, value },
                      fieldState: { invalid, error }
                    }) => (
                      <div className="flex flex-row w-[600px] items-center justify-between mt-[4px]">
                        <span className=" text-[14px] text-blue-gray-600" >Louer cette voiture</span>
                        <Switch checked={value} onChange={(e) => { onChange(e.target.checked) }} />
                      </div>
                    )}
                    name="rental"
                    control={control}
                  />

                  {watchRental &&

                    <>

                      <Controller
                        render={({
                          field: { onChange, value },
                          fieldState: { invalid, error }
                        }) => (
                          <div className="w-[600px]">
                            <AsyncSelect
                              cacheOptions
                              defaultOptions
                              loadOptions={loadOptions}
                              components={{ Option: CustomOption }}
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  height: 42,
                                  fontSize: 13,
                                  fontWeight: "300",
                                  color: "red",
                                  zIndex: 100
                                }),
                              }}
                              placeholder="Choisir un conducteur"
                              onChange={(val) => { onChange(val.value) }}
                            />
                            {error &&
                              <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                            }
                          </div>
                        )}
                        name="driverId"
                        control={control}
                      />

                      <div>Période de location</div>
                      <div className=" w-[600px] flex flex-row justify-between " >

                        <Controller
                          render={({
                            field: { ref, onChange, value },
                            fieldState: { invalid, error },
                          }) => (
                            <div className="w-[270px]">
                              <Input
                                label="Date de début"
                                onChange={onChange}
                                type="date" color="blue-gray" size="lg"
                              />
                              {error &&
                                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                              }
                            </div>
                          )}
                          name={`startDate`}
                          control={control}
                        />

                        <Controller
                          render={({
                            field: { ref, onChange, value },
                            fieldState: { invalid, error },
                          }) => (
                            <div className="w-[270px]">
                              <Input
                                label="Date de fin"
                                onChange={onChange}
                                type="date" color="blue-gray" size="lg"
                              />
                              {error &&
                                <span className=" text-[11px] text-red-400 mt-1" >{error.message}</span>
                              }
                            </div>
                          )}
                          name={`endDate`}
                          control={control}
                        />

                      </div>

                    </>

                  }

                </div>


                <div className="w-full flex flex-col items-center text-[14px] gap-[20px] mt-[50px]">
                  <p>Vérifiez que vous avez correctement rempli les informations nécessaires pour enregister le véhicule avant de procéder à la validation</p>
                  <SubmitButton
                    className={false ? "loading" : ""}
                    onClick={handleSubmit(handleClick)}
                  >
                    Enregistrer le véhicule
                  </SubmitButton>
                </div>
              </>
            }

          </CardBody>

        </Card>

      </div>
    </RenderIf>
  );
};

export default CreateVehicule;

const Moyen = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  padding: 2px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  .title {
    border-radius: 10px;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 2px;
    left: 2px;
    background: #0008;
    height: calc(100% - 4px);
    width: calc(100% - 4px);
    color: white;
    transition: opacity 0.3s ease-in-out;
    padding: 10px;
    text-align: center;
    font-size: 12px;
  }
  &.active {
    border: 2px solid #0F123E;
  }
  &:hover .title {
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }
  img {
    object-fit: cover;
    border-radius: 8px;
    height: 100%;
    width: 100%;
  }
`;

const VehicleClass = styled.button`
  height: 40px;
  min-width: 100px;
  padding: 0px 20px;
  border-radius: 20px;
  background: #0F123E15;
  border: 2px solid #0000;
  &.active {
    background: #0F123E;
    color: white;
  }
  &:hover {
    color: #0F123E;
    background: white;
    border: 2px solid #0F123E;
    transition: all 0.2s ease-in-out;
  }
`;

const VehiclePaper = styled.div`
  height: 120px;
  width: 400px;
  background-color: #F5F5F5;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 10px;
    gap: 10px;
    display: flex;
    z-index: 10;
  }
  &.active .content {
    background-color: #000A;
    color: white;
    transition: all 0.2s ease-in-out;
  }
  button {
    width: 100px;
    height: 100%;
    display: flex;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    background-color: white;
  }
  .preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
  }
  &.active .preview {
    display: flex;
  }
  &.has-error {
    border: 2px solid red;
    transition: all 0.2s ease-in-out;
  }
`;

const FilePicker = styled.div`
  border: 1px solid rgb(176, 190, 197);
  padding: 5px 5px 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  transition: all 0.2s ease-in-out;
  .label {
    position: absolute;
    left: 10px;
    padding: 0px 5px;
    transition: left 0.2s ease-in-out;
  }
  &.active .label {
    top: -10px;
    left: 10px;
    font-size: 11px;
    background-color: white;
    transition: all 0.2s ease-in-out;
  }
  button {
    height: 100%;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    background: #0F123E;
    color: white;
    border-radius: 4px;
  }
`;

const SubmitButton = styled.button`
  height: 50px;
  width: 350px;
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