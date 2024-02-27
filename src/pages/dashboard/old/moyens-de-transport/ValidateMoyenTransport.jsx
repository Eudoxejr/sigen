import React from 'react'
import {
	Card,
	CardBody,
	CardHeader,
	Typography,
	Tooltip,
} from "@material-tailwind/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from 'react-router-dom';
import dummyProfileImg from '/img/sigen/user.png';
import { useDialogController } from '@/context/dialogueProvider';
import { PaperPreview, RejectedPaper, ValidPaper } from '@/components/papers';
import { MoyenApi } from '@/api/api';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import { VehicleApi } from '@/api/api';
import { toast } from 'react-toastify';
import { produce } from 'immer';
import { RenderIf } from '@/components/common';
import { Permissions } from '@/data/role-access-data';
import { isAllowedTo, isAllowedWith } from '@/utils';
import useAuth from '@/hooks/useAuth';

export default function ValidateMoyenTransport() {

	const navigate = useNavigate();
	const { id } = useParams();
	const [_, dispatch] = useDialogController();
	const queryClient = useQueryClient();

	// console.log(id);

	const { mutate: mutatePiece } = useMutation({

		mutationFn: async (data) => {
			return VehicleApi.putVehiculePiece(data)
		},
		gcTime: 0,
		onSuccess: (response) => {

			//   console.log(response);

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

			queryClient.setQueriesData(["getPieceByMoyen"], (dataIncription) => {

				const indexUpdate = dataIncription.data.findIndex((inscript) => inscript.transportMoyenId == response?.data?.attachement?.idTransportMoyen)

				// console.log(indexUpdate);
				if (indexUpdate >= 0) {
					const indexUpdate2 = dataIncription.data?.[indexUpdate]?.driver?.attachedFiles.findIndex((attachement) => attachement.idAttachedFile == response.data.idAttachedFile)
					// console.log(dataIncription.data?.[indexUpdate]?.driver?.attachedFiles);
					if (indexUpdate2 >= 0) {
						const nextData = produce(dataIncription, draftData => {
							draftData.data[indexUpdate].driver.attachedFiles[indexUpdate2] = response.data
							draftData.data[indexUpdate].isValidate = response.transportMoyenIsValidate
							draftData.data[indexUpdate].status = response.status
						})
						return nextData;
					}
				}

			})

			//   queryClient.setQueriesData(["getPieceByMoyen"], (dataVehicule) => {
			// 	const indexUpdate = dataVehicule.data.findIndex((info) => info.idVehicule == response.data.vehiculeId)
			// 	console.log(indexUpdate);
			// 	if(indexUpdate >= 0)
			// 	{
			// 	  const nextData = produce(dataVehicule, draftData => {
			// 		draftData.data[indexUpdate].isValidate = response.vehiculeIsValidate
			// 	  })
			// 	  return nextData;
			// 	}
			//   })

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

	const handleFeedback = (isValid, data) => {
		if (isAllowedWith(auth,Permissions.VALIDATE_AND_REJECT_TRANSPORT_MEAN_PAPERS)) {
			typeof dispatch === 'function' && dispatch({
				type: "SET_DIALOG",
				value: {
					active: true,
					view: "paperFeedback",
					value: {
						status: isValid,
						item: data,
						onConfirm: async (data) => {
							// console.log(isField);
							// console.log(data);
							dispatch({
								type: "SET_BACKDROP",
								value: true
							}),
								mutatePiece(data)

						}
					}
				}
			});
		} else {
			toast.warn("Vous n'êtes pas autorisés à effectuer cette action");
		}
	};

	const { isLoading, refetch, data: details } = useQuery({
		queryKey: ["getPieceByMoyen", id],
		queryFn: async ({ queryKey, }) => {
			return MoyenApi.getMoyenByPiece(queryKey[1])
		},
		enabled: true,
	})

	if (isLoading) {
		return <div className=" w-full h-screen flex justify-center items-center " >
			<BeatLoader color="grey" size={8} />
		</div>
	}

	return (
		<RenderIf allowedTo={Permissions.VIEW_TRANPORT_MEAN_PAPERS}>
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
								Liste des pièces
							</Typography>
						</div>
					</CardHeader>
					<CardBody className="p-4 pt-3 pb-[100px] h-[calc(100vh-210px)] flex flex-col overflow-auto shadow-none">
						<p
							className="text-center w-[600px] text-black text-[14px] leading-[30px] self-center mb-5"
						>Pour procéder à la validation complète de chaque moyen de transport, veuillez vérifier et valider chacune des pièces qui lui sont jointes.</p>
						{details?.data?.map((el, key) => (
							<div
								key={String(key)}
								className="w-[95%] self-center mt-[50px] flex flex-col bg-[#00000005] p-[15px] rounded-[15px]"
							>
								<div className="flex items-start gap-[30px]">
									<img
										src={el?.transportMoyen?.illustrationPic}
										alt={"Moyen de transport"}
										className="h-[100px] w-[100px] border-[3px] border-[#0F123E55] p-1 rounded-full object-cover self-center mb-[15px]"
									/>
									<div className="flex flex-col w-full">
										<h5 className="text-black font-bold">
											{el?.transportMoyen?.title}
										</h5>
										{/* <span className="font-normal text-blue-gray-500 text-[13px]" >[Status du moyen de transport]</span> */}
										<span
											//  className="font-normal text-blue-gray-500 text-[11px] mt-3" 
											className={
												"font-normal mt-1 text-[10.5px] " + (
													el?.status === "REJECTED" ? " text-red-500"
														: el?.status === "EXPIRED" ? " text-gray-600"
															: el?.status === "CHECKING" ? " text-orange-600"
																: " text-green-500 "
												)
											}
										>
											{
												el?.status === "REJECTED" ? " Rejeté"
													: el?.status === "EXPIRED" ? " Expiré"
														: el?.status === "CHECKING" ? " En Attente"
															: "Validé"
											}
										</span>

										<p
											className="font-normal leading-[25px] text-[12px]"
										>{el?.transportMoyen?.transportMoyenDescription}</p>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-[30px] mt-[15px]">

									{el?.driver?.attachedFiles?.map((piece, id) => {

									// console.log(piece);

									if(piece?.attachement?.idTransportMoyen == el.transportMoyenId)
									{

										if(piece?.fileStatus === "VALIDATED") {
											return(
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

									}

									})}

								</div>
							</div>
						))}
					</CardBody>
				</Card>
			</div>
		</RenderIf>
	);
}