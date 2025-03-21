import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import styled from '@emotion/styled';
import carImg from '/img/car.svg';
import { BsLink45Deg } from 'react-icons/bs';
import { PaperPreview, RejectedPaper, ValidPaper } from '@/components/papers';
import { useDialogController } from '@/context/dialogueProvider';
import { VehicleApi } from '@/api/api';
import BeatLoader from "react-spinners/BeatLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import { produce } from 'immer';
import { IoWarningOutline } from 'react-icons/io5';
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';
import { isAllowedTo, isAllowedWith } from '@/utils';
import useAuth from '@/hooks/useAuth';

const DetailsVehicule = () => {

  const navigate = useNavigate();
  const [_, dispatch] = useDialogController();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { isLoading, refetch, data: details } = useQuery({
    queryKey: ["getVehicleDetails", id],
    queryFn: async ({ queryKey, }) => {
      return VehicleApi.getVehicleDetails(queryKey[1])
    },
    enabled: true,
  })

  const { mutate: mutatePiece } = useMutation({

    mutationFn: async (data) => {
      return VehicleApi.putVehiculePiece(data)
    },
    gcTime: 0,
    onSuccess: (response) => {

      // console.log(response);

      toast.success('Pièce modifiée avec succès', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      queryClient.setQueriesData(["getVehicleDetails"], (dataVehicule) => {
        const indexUpdate = dataVehicule.data.attachmentVehicule.findIndex((attachement) => attachement.idAttachedFile == response.data.idAttachedFile)
        if (indexUpdate >= 0) {
          const nextData = produce(dataVehicule, draftData => {
            draftData.data.attachmentVehicule[indexUpdate] = response.data
            draftData.data.isValidate = response.vehiculeIsValidate
          })
          return nextData;
        }
      })

      queryClient.setQueriesData(["getVehicle"], (dataVehicule) => {
        const indexUpdate = dataVehicule.data.findIndex((info) => info.idVehicule == response.data.vehiculeId)
        //console.log(indexUpdate);
        if (indexUpdate >= 0) {
          const nextData = produce(dataVehicule, draftData => {
            draftData.data[indexUpdate].isValidate = response.vehiculeIsValidate
          })
          return nextData;
        }
      })

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

  const { mutate: mutateField } = useMutation({

    mutationFn: async (data) => {
      return VehicleApi.putVehiculeField(data)
    },
    gcTime: 0,
    onSuccess: (response) => {

      // console.log(response);

      toast.success('Donnée modifiée avec succès', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      queryClient.setQueriesData(["getVehicleDetails"], (dataVehicule) => {
        const indexUpdate = dataVehicule.data.infoVehicule.findIndex((info) => info.id == response.data.id)
        if (indexUpdate >= 0) {
          const nextData = produce(dataVehicule, draftData => {
            draftData.data.infoVehicule[indexUpdate] = response.data
            draftData.data.isValidate = response.vehiculeIsValidate
          })
          return nextData;
        }
      })

      queryClient.setQueriesData(["getVehicle"], (dataVehicule) => {
        const indexUpdate = dataVehicule.data.findIndex((info) => info.idVehicule == response.data.vehiculeId)
        if (indexUpdate >= 0) {
          const nextData = produce(dataVehicule, draftData => {
            draftData.data[indexUpdate].isValidate = response.vehiculeIsValidate
          })
          return nextData;
        }
      })

      dispatch({
        type: "SET_BACKDROP",
        value: false
      })

    },
    onError: ({ response }) => {

      setError('root.serverError', {
        message: response.data.msg || "Une erreur s'est produite lors de la modification de la donnée"
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

  const { mutate: mutateClass } = useMutation({

    mutationFn: async (data) => {
      //console.log("Mutate : ")
      //console.log(data)
      let {status, ...dataRequest} = data
      if(data.status)
      {
        return VehicleApi.validateVehiculeClass(dataRequest)
      }
      else
      {
        return VehicleApi.rejectVehiculeClass(dataRequest)
      }
    },
    gcTime: 0,
    onSuccess: (response) => {

      // console.log(response);

      toast.success('Classe modifiée avec succès', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      queryClient.setQueriesData(["getVehicleDetails"], (dataVehicule) => {
        const indexUpdate = dataVehicule.data.AllClassOnVehicule.findIndex((clas) => clas.classId == response.data.classId)
        // console.log(indexUpdate);
        if (indexUpdate >= 0) {
          const nextData = produce(dataVehicule, draftData => {
            draftData.data.AllClassOnVehicule[indexUpdate] = response.data
            draftData.data.isValidate = response.vehiculeIsValidate
          })
          return nextData;
        }
      })

      queryClient.setQueriesData(["getVehicle"], (dataVehicule) => {
        const indexUpdate = dataVehicule.data.findIndex((info) => info.idVehicule == response.data.vehiculeId)
        if (indexUpdate >= 0) {
          const nextData = produce(dataVehicule, draftData => {
            draftData.data[indexUpdate].isValidate = response.vehiculeIsValidate
          })
          return nextData;
        }
      })

      dispatch({
        type: "SET_BACKDROP",
        value: false
      })

    },
    onError: ({ response }) => {

      setError('root.serverError', {
        message: response?.data?.msg || "Une erreur s'est produite lors de la modification de la donnée"
        // message: "Une erreur s'est produite lors de la connexion"
      })
      toast.error(response?.data?.msg || 'Une Erreur s\'est produite', {
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

  const handleMediaPreview = (mediaUrl) => {
    typeof dispatch === 'function' && dispatch({
      type: "SET_DIALOG",
      value: {
        active: true,
        view: "previewMedia",
        value: mediaUrl
      }
    });
  };

  const { auth } = useAuth();

  const handleFeedback = (isValid, data, isField) => {
    //console.log(da)
    if (isAllowedWith(auth,Permissions.VALIDATE_AND_REJECT_DRIVER_PAPERS)) {
      typeof dispatch === 'function' && dispatch({
        type: "SET_DIALOG",
        value: {
          active: true,
          view: "paperFeedback",
          value: {
            status: isValid,
            item: data,
            isField: isField,
            onConfirm: async (dataDialogBox) => {
              // console.log(isField);
              console.log(dataDialogBox);
              if (isField) {
                dispatch({
                  type: "SET_BACKDROP",
                  value: true
                })
                mutateField(dataDialogBox)
              }
              else {
                dispatch({
                  type: "SET_BACKDROP",
                  value: true
                }),
                  mutatePiece(dataDialogBox)
              }

            }
          }
        }
      });
    } else {
      toast.warn("Vous n'êtes pas autorisés à effectuer cette action");
    }
  };

 

  const handleFeedbackClass = (isValid, data) => {
    //console.log(data)
		if (isAllowedWith(auth,Permissions.VALIDATE_AND_REJECT_VEHICLE_PAPERS)) {
			typeof dispatch === 'function' && dispatch({
				type: "SET_DIALOG",
				value: {
					active: true,
					view: "paperFeedback",
					value: {
						status: isValid, 
						item: data,
						onConfirm: async (dataDialogBox) => {
              //data.ExpirationDate = da
							// console.log(isField);
              let dataRequest = {
                ...data,
                expirationDate: dataDialogBox?.status ? dataDialogBox?.date : undefined,
                status: dataDialogBox.status,
                rejectionComment : (!dataDialogBox?.status) ? dataDialogBox.reason : undefined
              }

							dispatch({
								type: "SET_BACKDROP",
								value: true
							}),
              mutateClass(dataRequest)

						}
					}
				}
			});
		} else {
			toast.warn("Vous n'êtes pas autorisés à effectuer cette action");
		}
	};


  if (isLoading) {
    return <div className=" w-full h-screen flex justify-center items-center " >
      <BeatLoader color="grey" size={8} />
    </div>
  }

  return (
    <RenderIf allowedTo={Permissions.VIEW_A_VEHICLE_DETAILS}>
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
                Véhicule
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-4 pt-3 pb-[100px] h-[calc(100vh-210px)] flex flex-col overflow-auto shadow-none">

            {!details?.data?.isValidate &&
              <p
                className="text-center w-[600px] text-black text-[14px] leading-[30px] self-center mb-5"
              >Ce véhicule n'est pas encore validé. Pour procéder à sa validation, veuillez vérifier et valider chacune des pièces qui lui sont jointes.</p>
            }

            <div className="w-full flex gap-[20px]">
              <div className="w-2/5 flex flex-col text-[14px] gap-[20px] pt-2">
                <div className="rounded-[10px] overflow-hidden bg-white border-[1px] border-[#0F123E55] flex flex-col items-center">

                  <div className="w-full p-[12px] flex items-center justify-between border-b-[4px] border-[#0F123E] bg-[#0F123E10]">
                    <span className="font-bold text-[#0F123E]">Classes</span>
                    <div className="flex items-center justify-center gap-[10px] text-[13px]">
                      {details?.data?.isValidate ?
                        <div className={`h-[30px] px-[20px] rounded-[6px] bg-white text-[#2B6B46] flex items-center justify-center`}>
                          Validé
                        </div>
                        :
                        <div className={`h-[30px] px-[20px] rounded-[6px] bg-white text-[#545454] flex items-center justify-center`}>
                          Non validé
                        </div>
                      }
                    </div>
                  </div>

                  <div className="p-[12px] flex flex-row flex-wrap w-full gap-[15px]">

                    {/* <img
                    src={carImg}
                    alt="car"
                    className="object-contain w-[100px] self-center mt-3"
                  /> */}

                    {details?.data?.AllClassOnVehicule?.map((classe, id) => (
                      <div key={classe?.classId + "-" + classe?.vehiculeId + "-container-" + id} className={" min-h-[80px] outline outline-2 outline-offset-2 bg-[#F5F5F5] min-w-[250px] p-2 flex-col rounded-md flex gap-[5px] " + (classe?.status === "CHECKING" ? "outline-black-600" : (classe?.status === "VALIDATED" ? "outline-green-600" : (classe?.status === "REJECTED" ? "outline-red-500" : "outline-gray-500" )))}>
                        {/* JSON.stringify(classe) */}
                        {classe?.status === "VALIDATED" && (
                        <ValidPaper
                        paperData={{title: classe?.class?.className, ExpirationDate: classe?.ExpirationDate}}
                        key={classe?.classId + "-" + classe?.vehiculeId + "-" + id}
                        placeholder={classe?.class?.classDescription ? classe?.class?.classDescription : "Validée"}
                        onViewMore={() => {}}
                        />
                        )
                        }
                        {classe?.status === "REJECTED" && (
                        <RejectedPaper
                        paperData={{title: classe?.class?.className, rejectionComment: classe?.rejectionComment}}
                        key={classe?.classId + "-" + classe?.vehiculeId + "-" + id}
                        placeholder={classe?.class?.classDescription ? classe?.class?.classDescription : "Rejetée"}
                        onViewMore={() => {}}
                        />
                        )
                        }
                        {classe?.status === "CHECKING" && (
                        <PaperPreview
                        paperData={{title: classe?.class?.className, rejectionComment: classe?.rejectionComment}}
                        key={classe?.classId + "-" + classe?.vehiculeId + "-" + id}
                        placeholder={classe?.class?.classDescription ? classe?.class?.classDescription : "En attente de validation"}
                        onViewMore={() => {}}
                        onValidate={() => handleFeedbackClass(true, {
                          classId: classe.classId,
                          vehiculeId: classe.vehiculeId,
                          status: true
                        })}
                        onReject={() => handleFeedbackClass(false, {
                          classId: classe.classId,
                          vehiculeId: classe.vehiculeId,
                          status: false
                        })}
                        />
                        )
                        }
                        {classe?.status === "EXPIRED" && (
                        <PaperPreview
                        paperData={{title: classe?.class?.className, rejectionComment: classe?.rejectionComment}}
                        isExpired
                        key={classe?.classId + "-" + classe?.vehiculeId + "-" + id}
                        placeholder={classe?.class?.classDescription ? classe?.class?.classDescription : "Expirée"}
                        onViewMore={() => {}}
                        onValidate={() => handleFeedbackClass(true, {
                          classId: classe.classId,
                          vehiculeId: classe.vehiculeId
                        })}
                        onReject={() => handleFeedback(false, {
                          classId: classe.classId,
                          vehiculeId: classe.vehiculeId
                        })}
                        />
                        )
                        }
                      </div>
                    ))}

                  </div>

                </div>
                <p className="w-full leading-[30px]">
                  Quelques informations additionnelles présentées ci-dessous, sont configurées sur le véhicule afin de mieux le décrire.
                </p>
                <div className="rounded-[10px] overflow-hidden bg-white border-[1px] border-[#0F123E55] flex flex-col items-center">
                  <div className="w-full p-[12px] text-center border-b-[4px] font-bold border-[#0F123E] text-[#0F123E] bg-[#0F123E10]">
                    Méta données
                  </div>
                  <div className="p-[12px] flex flex-col w-full gap-[15px]">

                    {details?.data?.infoVehicule.map((champ, id) => (

                      <div key={id} className="w-full flex items-center gap-[5px]">

                        <div>
                          <span className="text-black">{champ.titleField} : </span>
                          <span>{champ.value}</span>
                        </div>

                        {champ?.status === "CHECKING" &&
                          <>
                            <button
                              className=" text-white px-3 rounded-md py-1 bg-[#D95A4C]"
                              onClick={() => handleFeedback(false, champ, true)}
                            >
                              Rejeter
                            </button>
                            <button
                              className=" text-white px-3 rounded-md py-1 bg-[#0F123E]"
                              onClick={() => handleFeedback(true, champ, true)}
                            >
                              Valider
                            </button>
                          </>
                        }

                        {champ?.status === "VALIDATED" &&
                          <>
                            <button
                              className=" text-white px-3 rounded-md py-1 bg-[#3AA76D]"
                            // onClick={onReject}
                            >
                              Donnée validée
                            </button>
                          </>
                        }

                        {champ?.status === "REJECTED" &&
                          <>
                            <button
                              className=" text-white px-3 rounded-md py-1 bg-[#D95A4C]"
                            // onClick={onReject}
                            >
                              Donnée invalidée
                            </button>
                          </>
                        }

                      </div>

                    ))}

                  </div>
                </div>
              </div>
              <div className="w-3/5 flex flex-col items-center gap-[30px] text-[14px] p-4">
                <p className="w-full leading-[30px]">
                  Trouvez ci-dessous la liste des pièces jointes au véhicule :
                </p>
                <RenderIf
                  allowedTo={Permissions.VIEW_VEHICLE_PAPERS}
                  placeholder={
                    <div className="w-full flex items-center justify-center pt-[100px]">
                      Vous n'êtes pas autorisé à voir les pièces
                    </div>
                  }
                >
                  <div className="w-full flex items-center justify-center flex-wrap gap-[20px]">

                    {details?.data?.attachmentVehicule.map((piece, id) => {

                      // console.log(piece);

                      if (piece?.fileStatus === "VALIDATED") {
                        return (
                          <ValidPaper
                            paperData={piece}
                            key={id}
                            onViewMore={() => handleMediaPreview(piece.url)}
                          />
                        )
                      }

                      if (piece?.fileStatus === "REJECTED") {
                        return (
                          <RejectedPaper
                            paperData={piece}
                            key={id}
                            onViewMore={() => handleMediaPreview(piece.url)}
                          />
                        )
                      }

                      if (piece?.fileStatus === "CHECKING") {
                        return (
                          <PaperPreview
                            paperData={piece}
                            key={id}
                            onViewMore={() => handleMediaPreview(piece.url)}
                            onValidate={() => handleFeedback(true, piece)}
                            onReject={() => handleFeedback(false, piece)}
                          />
                        )
                      }

                      if (piece?.fileStatus === "EXPIRED") {
                        return (
                          <PaperPreview
                            key={id}
                            isExpired
                            onViewMore={() => handleMediaPreview(piece.url)}
                            onValidate={() => handleFeedback(true)}
                            onReject={() => handleFeedback(false)}
                          />
                        )
                      }

                    })}
                  </div>
                </RenderIf>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default DetailsVehicule;

const VehicleClass = styled.div`
  height: 35px;
  min-width: 100px;
  padding: 0px 10px;
  border-radius: 17.5px;
  background: #0F123E;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;