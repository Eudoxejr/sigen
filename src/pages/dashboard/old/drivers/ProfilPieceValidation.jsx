import React, { useState } from 'react'
import {
	Card,
	CardBody,
	CardHeader,
	Typography,
	Tooltip,
} from "@material-tailwind/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PaperPreview, RejectedPaper, ValidPaper } from '@/components/papers';
import { useDialogController } from '@/context/dialogueProvider';
import { MoyenApi } from '@/api/api';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import { VehicleApi } from '@/api/api';
import { toast } from 'react-toastify';
import { produce } from 'immer';
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';
import { isAllowedTo, isAllowedWith } from '@/utils';
import useAuth from '@/hooks/useAuth';


export default function ProfilPieceValidation() {

	const navigate = useNavigate()
	const { state } = useLocation();
	const [idCard, setIdcard] = useState(state.user.userIdCard.attachedFiles[0]);
	const [idCasier, setCasier] = useState(state.user.criminalRecordCard.attachedFiles[0]);
	const queryClient = useQueryClient();
	// console.log(state);

	const [_, dispatch] = useDialogController();

	const { mutate: mutatePieceIdCard } = useMutation({

		mutationFn: async (data) => {
			return VehicleApi.putVehiculePiece(data)
		},
		gcTime: 0,
		onSuccess: (response) => {

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

			setIdcard(response?.data)

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


	const { mutate: mutatePieceCasier } = useMutation({

		mutationFn: async (data) => {
			return VehicleApi.putVehiculePiece(data)
		},
		gcTime: 0,
		onSuccess: (response) => {

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

			setCasier(response?.data)

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

	const handleFeedback = (isValid, data, typePiece) => {
		if (isAllowedWith(auth,Permissions.VALIDATE_AND_REJECT_DRIVER_PAPERS)) {
			typeof dispatch === 'function' && dispatch({
				type: "SET_DIALOG",
				value: {
					active: true,
					view: "paperFeedback",
					value: {
						status: isValid,
						item: data,
						onConfirm: async (data) => {

							dispatch({
								type: "SET_BACKDROP",
								value: true
							})

							if (typePiece == "idCard") {
								mutatePieceIdCard(data)
							}
							else {
								mutatePieceCasier(data)
							}

						}
					}
				}
			});
		} else {
			toast.warn("Vous n'êtes pas autorisés à effectuer cette action");
		}
	};

	return (
		<RenderIf allowedTo={Permissions.VIEW_DRIVER_PAPERS}>
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
								Valider les pièces du profil
							</Typography>
						</div>
					</CardHeader>
					<CardBody className="p-4 pt-3 pb-[100px] h-[calc(100vh-210px)] flex flex-col overflow-auto shadow-none">
						<p
							className="text-center w-[600px] text-black text-[14px] leading-[30px] self-center mb-5"
						>Pour procéder à la validation du profil, veuillez vérifier et valider chacune des pièces qui lui sont attachées</p>
						<div className="grid grid-cols-2 gap-[30px] mt-[15px] w-[70%] mx-auto">

							{idCard?.fileStatus === "VALIDATED" ?

								<ValidPaper
									paperData={{
										title: "Carte d'identité",
										...idCard
									}}
									onViewMore={() => handleMediaPreview(idCard.url)}
									className="!w-full"
								/>

								: idCard?.fileStatus === "REJECTED" ?

									<RejectedPaper
										paperData={{
											title: "Carte d'identité",
											...idCard
										}}
										onViewMore={() => handleMediaPreview(idCard.url)}
										className="!w-full"
									/>

									: idCard?.fileStatus === "CHECKING" ?

										<PaperPreview
											paperData={{
												title: "Carte d'identité",
												...idCard
											}}
											onViewMore={() => handleMediaPreview(idCard.url)}
											onValidate={() => handleFeedback(true, { title: "Carte d'identité", ...idCard }, "idCard")}
											onReject={() => handleFeedback(false, { title: "Carte d'identité", ...idCard }, "idCard")}
											className="!w-full"
										/>


										: idCard?.fileStatus === "EXPIRED" ?

											<PaperPreview
												paperData={{
													title: "Carte d'identité",
													...idCard
												}}
												isExpired
												onViewMore={() => handleMediaPreview(idCard.url)}
												onValidate={() => handleFeedback(true, { title: "Carte d'identité", ...idCard }, "idCard")}
												onReject={() => handleFeedback(false, { title: "Carte d'identité", ...idCard }, "idCard")}
												className="!w-full"
											/>

											: null}

							{idCasier?.fileStatus === "VALIDATED" ?

								<ValidPaper
									paperData={{
										title: "Casier judiaire",
										...idCasier
									}}
									onViewMore={() => handleMediaPreview(idCasier.url)}
									className="!w-full"
								/>

								: idCasier?.fileStatus === "REJECTED" ?

									<RejectedPaper
										paperData={{
											title: "Casier judiaire",
											...idCasier
										}}
										onViewMore={() => handleMediaPreview(idCasier.url)}
										className="!w-full"
									/>

									: idCasier?.fileStatus === "CHECKING" ?

										<PaperPreview
											paperData={{
												title: "Casier judiaire",
												...idCasier
											}}
											onViewMore={() => handleMediaPreview(idCasier.url)}
											onValidate={() => handleFeedback(true, { title: "Casier judiaire", ...idCasier }, "idCasier")}
											onReject={() => handleFeedback(false, { title: "Casier judiaire", ...idCasier }, "idCasier")}
											className="!w-full"
										/>


										: idCasier?.fileStatus === "EXPIRED" ?

											<PaperPreview
												paperData={{
													title: "Casier judiaire",
													...idCasier
												}}
												isExpired
												onViewMore={() => handleMediaPreview(idCasier.url)}
												onValidate={() => handleFeedback(true, { title: "Casier judiaire", ...idCasier }, "idCasier")}
												onReject={() => handleFeedback(false, { title: "Casier judiaire", ...idCasier }, "idCasier")}
												className="!w-full"
											/>

											: null}

						</div>
					</CardBody>
				</Card>
			</div>
		</RenderIf>
	);
}