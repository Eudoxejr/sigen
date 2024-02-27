/* eslint-disable react-hooks/rules-of-hooks */
import {
	IconButton,
	Menu,
	MenuHandler,
	MenuList,
	MenuItem,
	Chip,
	Avatar,
	Typography,
	Progress,
	Button
} from "@material-tailwind/react";
import {Avatar as AvatarMui} from '@mui/material';
import {
	EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import dayjs from 'dayjs'
import { AiOutlineClose, AiFillEye, AiFillStar } from "react-icons/ai";
import { PhotoView } from 'react-photo-view';
import { useNavigate } from 'react-router-dom';
import { BsChevronRight, BsEyeFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import img1 from '/img/home-decor-4.jpeg';
import dummyProfileImg from '/img/sigen/user.png';
import { CiEdit } from "react-icons/ci";
import { useDialogueStore } from '@/store/dialogue.store';
// import { isAllowedTo } from "./isAllowedTo";
// import { Permissions } from "@/data/role-access-data";
// import { RenderIf } from "@/components/common";


export const columnColaborateurs = [
	{
		field: 'fullname',
		headerName: 'Nom complet',
		flex: 1.5,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				<div className="flex items-center gap-4 py-3">
					<PhotoView key={row.id} src={row.profil_pic || '/img/sigen/user128.png'}>
						<AvatarMui src={row?.profil_pic} sx={{ width: 50, height: 50 }} />
					</PhotoView>
					<div>
						<Typography
							variant="small"
							color="blue-gray"
							className="font-medium opacity-75 text-[13px] capitalize"
						>
							{row?.firstname + " " + row?.lastname}
						</Typography>
					</div>
				</div>

			)

		}
	},

	{
		field: 'role',
		headerName: 'Role',
		flex: 1.2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div>

					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13px] "
					>
						{params.row?.role?.role_name}
					</Typography>


				</div>

			)

		}
	},

	{
		field: 'coordone',
		headerName: 'Coordonnées',
		flex: 2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {
			return (
				<div>
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13px] "
					>
						{params.row.email || "Email inexistant"}
					</Typography>
					<Typography
						variant="small"
						color="blue-gray"
						className=" font-normal mt-1 text-[13px] "
					>
						{params.row.phone_number || "Tel inexistant"}
					</Typography>
				</div>
			)
		}
	},

	{
		field: 'isSuspend',
		headerName: 'Status',
		width: 120,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="w-full h-full flex items-center" >
					<Chip
						variant="gradient"
						color={!params.row.is_suspend ? "green" : "red"}
						value={!params.row.is_suspend ? "Actif" : "Suspendu"}
						className="py-0.5 px-2 text-[11px] font-medium"
					/>
				</div>

			)
		}
	},

	{
		field: 'dossier',
		headerName: 'Dossiers',
		flex: 1.8,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				<div className="w-full h-full py-3 flex items-center flex-col justify-center" >

					<div className="w-full flex justify-between" >
						<span className="font-medium opacity-75 text-[10.5px] capitalize" >Dossiers</span>
						<span className="font-medium opacity-75 text-[10.5px] capitalize" >10</span>
					</div>
					<Progress value={100} color="blue" />

					<div className="w-full mt-2 flex justify-between" >
						<span className="font-medium opacity-75 text-[10.5px] capitalize">Titulaire</span>
						<span className="font-medium opacity-75 text-[10.5px] capitalize">4</span>
					</div>
					<Progress value={40} color="green" />

					<div className="w-full mt-2 flex justify-between" >
						<span className="font-medium opacity-75 text-[10.5px] capitalize">Suppléant</span>
						<span className="font-medium opacity-75 text-[10.5px] capitalize">6</span>
					</div>
					<Progress value={60} color="deep-orange" />

				</div>

			)

		}
	},

	{
		field: 'action',
		headerAlign: 'center',
		headerName: '',
		width: 70,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			const navigate = useNavigate()
			const { setDialogue } = useDialogueStore()

			return (
				// isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) || isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) ?
				<Menu placement="bottom-end">
					<MenuHandler>
						<IconButton size="sm" variant="text" color="blue-gray">
							<EllipsisVerticalIcon
								strokeWidth={1.5}
								fill="currenColor"
								className="h-6 w-6"
							/>
						</IconButton>
					</MenuHandler>

					<MenuList className="p-1 rounded-[5px]">
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between"
							>
								Voir les dossiers assignés
							</MenuItem>
						{/* } */}

						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									setDialogue({
										size: "md",
										open: true,
										view: "update-collaborateur",
										data: params.row
									})
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Modifier le collaborateur
							</MenuItem>
						{/* } */}

						{
							// isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) &&
							!params.row.is_suspend ?
								<MenuItem
									onClick={() =>
										setDialogue({
											size: "xs",
											open: true,
											view: "suspend-collaborateur",
											data: {...params.row, wasActive: true}
										})
									}
									className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
								>
									Suspendre le collaborateur
								</MenuItem>
								:
								<MenuItem
									onClick={() =>
										setDialogue({
											size: "xs",
											open: true,
											view: "suspend-collaborateur",
											data: {...params.row, wasActive: false}
										})
									}
									className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-green-600 hover:!text-white font-medium flex items-center justify-between"
								>
									Activer le collaborateur
								</MenuItem>
							
						}

						<MenuItem
							onClick={() => dispatch({
								type: "SET_DIALOG",
								value: {
									active: true,
									view: "suspendDriver",
									value: {
										wasActive: true,
										user: params.row,
									}
								}
							})}
							className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
						>
							Supprimer le collaborateur
						</MenuItem>
					</MenuList>
				</Menu>
			)
		}
	}
];


export const columnClients = [
	{
		field: 'id',
		headerName: 'Identifiants',
		flex: 0.4,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<Typography
					variant="small"
					color="blue-gray"
					className="font-semibold text-[13.5px] "
				>
					#858556555
				</Typography>

			)

		}
	},

	{
		field: 'fullname',
		headerName: 'Nom complet',
		flex: 1.5,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				<div className="flex items-center gap-4 py-3">
					<AvatarMui>

					</AvatarMui>
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13.5px] "
					>
						{row?.firstname + " " + row?.lastname}
					</Typography>
				</div>

			)

		}
	},

	{
		field: 'coordone',
		headerName: 'Coordonnées',
		flex: 2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {
			return (
				<div>
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13.5px] "
					>
						{params.row.email || "Email inexistant"}
					</Typography>
					<Typography
						variant="small"
						color="blue-gray"
						className=" font-normal mt-1 text-[12.5px] "
					>
						{params.row.phone_number || "Tel inexistant"}
					</Typography>
				</div>
			)
		}
	},

	// {
	// 	field: 'moyen',
	// 	headerName: 'Moyen de transport',
	// 	flex: 2,
	// 	minWidth: 170,
	// 	sortable: false,
	// 	hideSortIcons: true,
	// 	disableColumnMenu: true,
	// 	renderCell: (params) => {
	// 		const [_, dispatch] = useDialogController();

	// 		const navigate = useNavigate();

	// 		return (
	// 			<RenderIf
	// 				allowedTo={Permissions.VIEW_TRANPORT_MEAN_PAPERS}
	// 				placeholder="Pas accessible"
	// 			>
	// 				<div>
	// 					<Typography
	// 						variant="small"
	// 						color="blue-gray"
	// 						className="font-semibold text-[12px] "
	// 					>
	// 						{params.row?.transportMoyens?.length + " moyen(s) de transport"}
	// 					</Typography>

	// 					<div className=" flex flex-1 justify-between mt-2 " >

	// 						<div className=" flex flex-col " >

	// 							{params.row?.transportMoyens.map((item, key) => (
	// 								<Typography
	// 									key={key}
	// 									variant="small"
	// 									color="blue-gray"
	// 									className={
	// 										"font-normal mt-1 text-[10.5px] " + (
	// 											item?.status === "REJECTED" ? " text-red-500"
	// 												: item?.status === "EXPIRED" ? " text-gray-600"
	// 													: item?.status === "CHECKING" ? " text-orange-600"
	// 														: " text-green-500 "
	// 										)
	// 									}
	// 								>
	// 									{item.transportMoyen.title}
	// 								</Typography>
	// 							))}
	// 							<Button color="green" size="sm" className="mt-2"
	// 								onClick={() => {
	// 									navigate(
	// 										`./inscription/${params.row?.idUser}`
	// 									)
	// 								}}
	// 							>
	// 								voir plus
	// 							</Button>
	// 						</div>

	// 						{/* <MenuHandler> */}
	// 						{/* {params.row?.transportMoyens.length > 0 &&
	// 						<IconButton
	// 							onClick={() => dispatch({
	// 								type: "SET_DIALOG",
	// 								value: {
	// 									active: true,
	// 									view: "viewTransportMoyen",
	// 									value: params.row?.transportMoyens
	// 								}
	// 							})}
	// 							size="sm" variant="text" color="blue-gray"
	// 						>
	// 							<EllipsisVerticalIcon
	// 								strokeWidth={1.5}
	// 								fill="currenColor"
	// 								className="h-6 w-6"
	// 							/>
	// 						</IconButton>
	// 					} */}
	// 						{/* </MenuHandler> */}

	// 					</div>
	// 				</div>
	// 			</RenderIf>
	// 		)
	// 	}
	// },

	{
		field: 'ifu',
		headerName: 'Numéro IFU',
		width: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="w-full h-full flex items-center" >
					<Chip
						variant="gradient"
						color={!params?.row.is_suspend ? "green" : "red"}
						value="1854862358965"
						className="py-0.5 px-2 text-[11px] font-medium"
					/>
				</div>

			)
		}
	},

	{
		field: 'dossier',
		headerName: 'Dossiers',
		flex: 0.5,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				<div className="w-full h-full flex items-center" >
					<Chip
						variant="gradient"
						color={"blue"}
						value={"0 Dossiers"}
						className="py-0.5 px-2 text-[11px] font-medium"
					/>
				</div>

			)

		}
	},

	{
		field: 'action',
		headerAlign: 'center',
		headerName: '',
		width: 70,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			const navigate = useNavigate()

			return (
				// isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) || isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) ?
				<Menu placement="bottom-end">
					<MenuHandler>
						<IconButton size="sm" variant="text" color="blue-gray">
							<EllipsisVerticalIcon
								strokeWidth={1.5}
								fill="currenColor"
								className="h-6 w-6"
							/>
						</IconButton>
					</MenuHandler>

					<MenuList className="p-1 rounded-[5px]">
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									navigate(`./${params.row.idUser}`,
										{ state: params.row })
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between"
							>
								Voir les dossiers du client
							</MenuItem>
						{/* } */}

						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									navigate(`./${params.row.idUser}`,
										{ state: params.row })
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Modifier le client
							</MenuItem>
						{/* } */}

						
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
						<MenuItem
								onClick={() =>
									navigate(`./${params.row.idUser}`,
										{ state: params.row })
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Détails du client
							</MenuItem>
						{/* } */}

					</MenuList>
				</Menu>
			)
		}
	}
];
