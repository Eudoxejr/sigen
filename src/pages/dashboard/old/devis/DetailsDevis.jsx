import React, { useState } from 'react';
import { produce } from "immer"
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  Input,
  Chip,
  Avatar
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs'
import { PhotoView } from 'react-photo-view';
import { DevisApi, DriverApi } from '@/api/api';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDialogController } from '@/context/dialogueProvider';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';


const DetailsDevis = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [_, dispatch] = useDialogController();
  const queryClient = useQueryClient();

  const [state, setState] = useState(location.state);
  const [driver, setDriver] = useState();

  // console.log(state);

  const schema = yup.object({
    devisData: yup.array().of(
      yup.object({
        amount: yup.number().required(),
        libelle: yup.string().required()
      })
    )
  }).required();

  const { control, watch, setValue, handleSubmit, setError, getValues, formState: { errors, isDirty } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      devisData: state.devisData || []
    }
  });


  const { mutate: mutate2, isLoading: isloading2 } = useMutation({

    mutationFn: async (data) => {
      return DevisApi.putConducteur(data)
    },
    gcTime: 0,
    onSuccess: (response) => {

      // navigate(-1)
      toast.success('Conducteur ajouté avec succès', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      queryClient.setQueriesData(["getDevis"], (datadevis) => {
        const indexUpdateDevis = datadevis.data.findIndex((reservation) => reservation.idReservation == response.data.idReservation)
        const nextData = produce(datadevis, draftData => {
          draftData.data[indexUpdateDevis] = response.data
        })
        return nextData;
      })

      setState(response.data)

      dispatch({
        type: "SET_BACKDROP",
        value: false
      })

    },
    onError: ({ response }) => {

      // console.log(response.data);

      setError('root.serverError', {
        message: response.data.msg || "Une erreur s'est produite lors de la modification du devis"
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


  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "devisData", // unique name for your Field Array
  });

  const watchDevisData = watch("devisData");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchDevisData[index]
    };
  });

  const { mutate, isLoading } = useMutation({

    mutationFn: async (data) => {
      return DevisApi.putDevis(data)
    },
    gcTime: 0,
    onSuccess: (response) => {

      // navigate(-1)

      toast.success('Devis modifié avec succès', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      queryClient.setQueriesData(["getDevis"], (datadevis) => {
        const indexUpdateDevis = datadevis.data.findIndex((reservation) => reservation.idReservation == response.data.idReservation)
        const nextData = produce(datadevis, draftData => {
          draftData.data[indexUpdateDevis] = response.data
        })
        return nextData;
      })

      setState(response.data)

      dispatch({
        type: "SET_BACKDROP",
        value: false
      })

    },
    onError: ({ response }) => {

      setError('root.serverError', {
        message: response.data.msg || "Une erreur s'est produite lors de la modification du devis"
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
    dispatch({
      type: "SET_BACKDROP",
      value: true
    })
    data.idReservation = state.idReservation
    mutate(data)
    // console.log(data);
  };

  const getDriver = async (inputValue) => {
    const res = await DriverApi.getDriver(1, 15, ["DRIVER"], inputValue, state.moyenTransport.idTransportMoyen, true)
    // console.log(res.data); state.idReservation
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


  return (
    <RenderIf allowedTo={Permissions.VIEW_AN_ESTIMATION_REQUEST_DETAILS}>
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
                Informations sur la demande de devis
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none">
            <div className="w-full flex gap-[20px]">
              <div className="w-2/5 flex flex-col text-[14px] gap-[20px] pt-2">
                <div className="rounded-[10px] overflow-hidden bg-white border-[1px] border-[#0F123E55] flex flex-col items-center">
                  <div className="w-full p-[12px] flex items-center justify-between border-b-[4px] border-[#0F123E] bg-[#0F123E10]">
                    <span className="font-bold text-[#0F123E]">Fiche de demande</span>
                    <div className="flex items-center justify-center gap-[10px] text-[13px]">
                      {/* Keep only one */}
                      {state.statusReservation === "SENT" &&
                        <div className={`h-[30px] px-[20px] rounded-[6px] bg-white text-[#545454] flex items-center justify-center`}>
                          Non traité
                        </div>
                      }

                      {state.statusReservation === "TREATED" && state.payStatus === "UNPAID" &&
                        <div className={`h-[30px] px-[20px] rounded-[6px] bg-white text-[#ED6E33] flex items-center justify-center`}>
                          Traité
                        </div>
                      }

                      {state.statusReservation === "TREATED" && state.payStatus === "PAID" &&
                        <div className={`h-[30px] px-[20px] rounded-[6px] bg-white text-[#2B6B46] flex items-center justify-center`}>
                          Payé
                        </div>
                      }

                    </div>
                  </div>
                  <div className="p-[12px] flex flex-col w-full gap-[10px]">
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Type de demande : </span>
                      <>
                        <Chip
                          variant="gradient"
                          color={state?.instantly ? "green" : "red"}
                          value={state?.instantly ? "Instantané" : "Non Instantané"}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </>
                    </div>
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Moyen de transport : </span>
                      <Chip
                        variant="gradient"
                        color="cyan"
                        value={state?.moyenTransport.title}
                        className="py-0.5 px-2 text-[11px] font-medium"
                      />
                    </div>
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Montant : </span>
                      <span>{watchDevisData?.reduce((acc, objet) => acc + parseFloat(objet.amount), 0) || 0} €</span>
                    </div>
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Coût estimé : </span>
                      <span>{watchDevisData?.reduce((acc, objet) => acc + parseFloat(objet.amount), 0) || 0} €</span>
                    </div>
                    <div className="h-[1px] w-full bg-[#0F123E55]" />
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Lieu de départ : </span>
                      <span>{state?.benefitAdresse}</span>
                    </div>
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Lieu de destination : </span>
                      <span>{state?.placeArrivalAdresse || "Néant"}</span>
                    </div>
                    {/* <div className="w-full flex items-center gap-[5px]">
                  <span className="text-black">Distance : </span>
                  <span>{state?.placeArrivalAdresse || "Néant"}</span>
                </div> */}
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Période de prise en charge : </span>
                      <span>
                        <span className=" mt-1 text-[12px] " >{dayjs(state?.benefitDateStart).format('ddd DD MMM YY à hh:mm')} au </span>
                        <span className=" mt-1 text-[12px] " >{dayjs(state?.benefitDateEnd).format('ddd DD MMM YY à hh:mm')}</span>
                      </span>
                    </div>
                    {/* <div className="w-full flex items-center gap-[5px]">
                  <span className="text-black">L'heure de début : </span>
                  <span>[Value]</span>
                </div> */}
                    <div className="w-full flex items-center gap-[5px]">
                      <span className="text-black">Temps de vol estimé : </span>
                      <span>Néant</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[10px] overflow-hidden bg-white border-[1px] border-[#0F123E55] flex flex-col">
                  <div className="w-full p-[12px] text-center border-b-[4px] font-bold border-[#0F123E] text-[#0F123E] bg-[#0F123E10]">
                    Informations sur le client
                  </div>
                  <div className="p-[12px] flex flex-col gap-[10px]">
                    <div className="flex items-center gap-4">
                      <PhotoView key={state?.reservationAuthor?.idUser} src={state?.reservationAuthor?.photoProfil || '/img/sigen/user128.png'}>
                        <Avatar
                          src={state?.reservationAuthor?.photoProfilThumbs || '/img/sigen/user.png'}
                          size="sm"
                          className=" cursor-pointer bg-blue-gray-300 "
                        />
                      </PhotoView>
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold text-[12px] "
                        >
                          {state?.reservationAuthor?.firstName + " " + state?.reservationAuthor?.lastName}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className=" font-normal text-[10.5px] "
                        >
                          {state?.reservationAuthor?.pseudo}
                        </Typography>
                      </div>
                    </div>
                    <span className="text-black">{state?.reservationAuthor?.email}</span>
                    <span className="text-black">{state?.reservationAuthor?.telephone}</span>
                    {/* <q className="mt-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, quaerat placeat rerum eos repellendus molestiae vel molestias recusandae quas ullam velit, modi cumque, minus aspernatur nam fugiat nemo assumenda deserunt!
                </q> */}
                  </div>
                </div>

              </div>
              <div className="w-3/5 flex flex-col items-center gap-[30px] text-[14px] p-4">

                {state.payStatus !== "PAID" &&
                  <>
                    <p className="w-full leading-[30px]">
                      Pour procéder au traitement du devis, veuillez ajouter des lignes de devis après avoir mentionné à chaque fois le libellé et le montant (en euro) associé. Vous pouvez revenir modifier les données des devis tant que la demande n'est pas payée.
                    </p>
                    <div className="flex items-center gap-[20px] w-full">
                      <div className="flex-1">
                        <Controller
                          render={({
                            field: { ref, onChange, value, ...field },
                            fieldState: { invalid, error },
                          }) => (
                            <Input
                              label="Libellé"
                              onChange={onChange}
                              value={value}
                              type="text" color="blue-gray" size="lg"
                            />
                          )}
                          name="libelle"
                          control={control}
                        />
                      </div>
                      <div className="min-w-[150px]">
                        <Controller
                          render={({
                            field: { ref, onChange, value, ...field },
                            fieldState: { invalid, error },
                          }) => (
                            <Input
                              label="Montant (€)"
                              onChange={onChange}
                              value={value}
                              color="blue-gray" size="lg" type="number"
                            />
                          )}
                          name="amount"
                          control={control}
                        />
                      </div>
                      <button
                        className="border-[1px] border-[#0F123E55] h-11 w-[55px] rounded-[5px] flex items-center justify-center text-white"
                        onClick={() => {

                          const lib = getValues("libelle");
                          const amount = getValues("amount");
                          if (lib && amount) {
                            append(
                              {
                                libelle: lib,
                                amount: amount
                              }
                            )

                            setValue("libelle", "")
                            setValue("amount", "")

                          }
                          else {
                            toast.error('Vous devez ajouter un libellé et un montant', {
                              position: "top-right",
                              autoClose: 2000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: false,
                              draggable: false,
                              progress: undefined,
                              theme: "colored",
                            });
                          }

                        }}
                      >
                        <AiOutlinePlusCircle
                          className="text-[20px] text-[#0F123E]"
                        />
                      </button>
                    </div>
                  </>
                }

                {fields.length > 0 ?
                  <>
                    <Table className="">
                      {controlledFields.map((field, index) => (
                        <tr key={String(field.id)}>
                          <td>
                            <Controller
                              render={({
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error },
                              }) => (
                                <input
                                  className=""
                                  value={value}
                                  disabled={state.payStatus === "PAID"}
                                  onChange={onChange}
                                />
                              )}
                              name={`devisData[${index}].libelle`}
                              control={control}
                            />
                          </td>
                          <td className="w-[150px]">
                            <Controller
                              render={({
                                field: { ref, onChange, value, ...field },
                                fieldState: { invalid, error },
                              }) => (
                                <input
                                  className=""
                                  value={value}
                                  type="number"
                                  disabled={state.payStatus === "PAID"}
                                  onChange={(e) => {
                                    onChange(e.target.value);
                                    // setValue("devisData", watchDevisData)
                                  }}
                                  onBlur={(e) => setValue("devisData", watchDevisData)}
                                />
                              )}
                              name={`devisData[${index}].amount`}
                              control={control}
                            />
                          </td>
                          {state.payStatus !== "PAID" &&
                            <td className="centered">
                              <AiOutlineMinusCircle
                                onClick={() => remove(index)}
                                className="text-[20px] text-[#0F123E] cursor-pointer ml-[15px]"
                              />
                            </td>
                          }
                        </tr>
                      ))}

                      <tr className="border-t-[4px] border-[#0F123E] text-[#0F123E] bg-[#0F123E10] font-bold">
                        <td className="h-[40px] px-[10px] text-end">
                          TOTAL
                        </td>
                        <td colSpan={2} className="text-end px-[10px]">
                          {watchDevisData?.reduce((acc, objet) => acc + parseFloat(objet.amount), 0) || 0} €
                        </td>
                      </tr>
                    </Table>

                    <RenderIf
                      allowedTo={Permissions.SUBMIT_AN_ESTIMATION}
                      placeholder={
                        <div className="flex items-center justify-center w-full py-5">
                          Vous n'êtes pas autorisé à soumettre un devis
                        </div>
                      }
                    >
                      <div className="flex items-center justify-center w-full gap-[30px]">

                        {state.statusReservation === "SENT" &&
                          <button
                            className="bg-[#0F123E] h-11 w-1/5 rounded-[5px] flex items-center justify-center text-white"
                            onClick={handleSubmit(handleClick)}
                          >
                            Soumettre le devis
                          </button>
                        }

                        {state.statusReservation === "TREATED" && state.payStatus === "UNPAID" &&
                          <button
                            onClick={handleSubmit(handleClick)}
                            className="bg-[#2B6B46] h-11 w-1/5 rounded-[5px] flex items-center justify-center text-white"
                          >
                            Modifier le devis
                          </button>
                        }
                      </div>
                    </RenderIf>


                  </>
                  :
                  <div className="text-[12px]">
                    Aucun devis ajouté pour le moment
                  </div>
                }

                {state.payStatus === "PAID" &&

                  <>

                    <p className="w-full leading-[30px]">
                      Vous pouvez à présent assigner cette course à un conducteur. Selectionner un conducteur disponible dans la liste ci-dessous. Vous pouvez faire une
                      recherche sur son nom, prenom, mail ou son numéro de téléphone.
                    </p>

                    <RenderIf
                      allowedTo={Permissions.ASSIGN_PRIVATE_DRIVER_TO_AN_ESTIMATION}
                      placeholder={
                        <div className="flex items-center justify-center w-full py-5">
                          Vous n'êtes pas autorisé à assigner un chauffeur
                        </div>
                      }
                    >
                      <div className="flex items-center gap-[20px] w-full">
                        <div className="flex-1">
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
                            onChange={(val) => { setDriver(val.value) }}
                          />
                        </div>
                        <button
                          onClick={() => {

                            if (driver) {
                              dispatch({
                                type: "SET_BACKDROP",
                                value: true
                              });
                              mutate2({
                                idReservation: state.idReservation,
                                idUser: driver
                              })
                            } else {
                              toast.error("Choisissez un conducteur", {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: false,
                                progress: undefined,
                                theme: "colored",
                              });
                            }

                          }}
                          className="bg-[#2B6B46] h-11 px-5 rounded-[5px] flex items-center justify-center text-white"
                        >
                          Ajouter ce conducteur
                        </button>

                        {/* <button
                    className="border-[1px] border-[#0F123E55] h-11 w-[55px] rounded-[5px] flex items-center justify-center text-white"
                    onClick={() => { 

                      const lib = getValues("libelle");
                      const amount = getValues("amount");
                      if (lib && amount) {
                        append(
                          {
                            libelle: lib,
                            amount: amount
                          }
                        )

                        setValue("libelle", "")
                        setValue("amount", "")

                      }
                      else{
                        toast.error('Vous devez ajouter un libellé et un montant', {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                          progress: undefined,
                          theme: "colored",
                      });
                      }
                      
                    }}
                  >
                    <AiOutlinePlusCircle
                      className="text-[20px] text-[#0F123E]"
                    />
                  </button> */}

                      </div>
                    </RenderIf>

                    {state.statusReservation === "ASSIGNED" &&
                      <div className="rounded-[10px] w-[90%] overflow-hidden bg-white border-[1px] border-[#0F123E55] flex flex-col">
                        <div className="w-full p-[12px] text-center border-b-[4px] font-bold border-[#0F123E] text-[#0F123E] bg-[#0F123E10]">
                          Informations sur le conducteur assigné
                        </div>
                        <div className="p-[12px] flex flex-col gap-[10px]">
                          <div className="flex items-center gap-4">
                            <PhotoView key={state?.reservationDriver?.idUser} src={state?.reservationDriver?.photoProfil || '/img/sigen/user128.png'}>
                              <Avatar
                                src={state?.reservationDriver?.photoProfilThumbs || '/img/sigen/user.png'}
                                size="sm"
                                className=" cursor-pointer bg-blue-gray-300 "
                              />
                            </PhotoView>
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold text-[12px] "
                              >
                                {state?.reservationDriver?.firstName + " " + state?.reservationDriver?.lastName}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className=" font-normal text-[10.5px] "
                              >
                                {state?.reservationDriver?.pseudo}
                              </Typography>
                            </div>
                          </div>
                          <span className="text-black">{state?.reservationDriver?.email}</span>
                          <span className="text-black">{state?.reservationDriver?.telephone}</span>
                          {/* <q className="mt-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, quaerat placeat rerum eos repellendus molestiae vel molestias recusandae quas ullam velit, modi cumque, minus aspernatur nam fugiat nemo assumenda deserunt!
                      </q> */}
                        </div>
                      </div>
                    }

                  </>

                }

              </div>
            </div>
          </CardBody>
        </Card>
      </div >
    </RenderIf>
  );
};

export default DetailsDevis;

const Table = styled.table`
  width: 100%;
  position: relative;
  border-collapse: collapse;
  td {
    border: 1px solid #0F123E55;
    border-collapse: collapse;
    &.centered {
      width: 55px;
      text-align: center;
    }
  }
  input {
    outline: none;
    padding: 0px 10px;
    font-size: 13px;
    width: 100%;
    height: 40px;
    color: black;
  }
`;