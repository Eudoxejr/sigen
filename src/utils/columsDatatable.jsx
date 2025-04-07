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
import { FaRegFileWord } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import img1 from '/img/home-decor-4.jpeg';
import dummyProfileImg from '/img/sigen/user.png';
import { FaFolder } from "react-icons/fa";
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

			// const dossierManager

			const dossierManagerCount = parseInt(row.meta.folderManage_count)
			const dossierSubManagerCount = parseInt(row.meta.folderSubManage_count)

			return (

				<div className="w-full h-full py-3 flex items-center flex-col justify-center" >

					<div className="w-full flex justify-between" >
						<span className="font-medium opacity-75 text-[10.5px] capitalize" >Dossiers</span>
						<span className="font-medium opacity-75 text-[10.5px] capitalize" >{dossierManagerCount+dossierSubManagerCount}</span>
					</div>
					<Progress value={100} color="blue" />

					<div className="w-full mt-2 flex justify-between" >
						<span className="font-medium opacity-75 text-[10.5px] capitalize">Titulaire</span>
						<span className="font-medium opacity-75 text-[10.5px] capitalize">{dossierManagerCount}</span>
					</div>
					<Progress value={(dossierManagerCount*100)/(dossierManagerCount+dossierSubManagerCount)} color="green" />

					<div className="w-full mt-2 flex justify-between" >
						<span className="font-medium opacity-75 text-[10.5px] capitalize">Suppléant</span>
						<span className="font-medium opacity-75 text-[10.5px] capitalize">{dossierSubManagerCount}</span>
					</div>
					<Progress value={(dossierSubManagerCount*100)/(dossierManagerCount+dossierSubManagerCount)} color="deep-orange" />

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
								className="h-6 w-6"
							/>
						</IconButton>
					</MenuHandler>

					<MenuList className="p-1 rounded-[5px]">
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									navigate(`./${params.row.id}`,
										{ state: params.row })
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between"
							>
								Plus
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
							onClick={() =>
								setDialogue({
									size: "xs",
									open: true,
									view: "delete-collaborateur",
									data: params.row
								})
							}
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
		field: 'matricule',
		headerName: 'Matricule',
		flex: 0.4,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			function convertToFiveDigits(number) {
				// Convertir le nombre en chaîne de caractères
				let strNumber = number.toString();
				
				// Vérifier la longueur de la chaîne de caractères
				if (strNumber.length < 5) {
					// Ajouter des zéros à gauche jusqu'à ce que la longueur soit de 5
					strNumber = '0'.repeat(5 - strNumber.length) + strNumber;
				}
				
				return '0'.repeat(1) + strNumber;
			}

			return (

				<div className="flex flex-col" >
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13.5px] "
					>
						{params?.row?.matricule}
					</Typography>

					<Typography
						variant="small"
						color="blue-gray"
						className=" font-medium mt-2 text-[12.5px] "
					>
						{dayjs(params?.row?.created_at).format('DD MMM YYYY')}
					</Typography>

				</div>

			)

		}
	},

	{
		field: 'civility',
		headerName: 'Civilité',
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
					{params?.row?.civility}
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
					<AvatarMui >

					</AvatarMui>
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13.5px] "
					>
						{row.civility == "Structure" ? row?.denomination : row?.firstname + " " + row?.lastname}
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
	// 	field: 'ifu',
	// 	headerName: 'Numéro IFU',
	// 	width: 170,
	// 	sortable: true,
	// 	hideSortIcons: false,
	// 	disableColumnMenu: true,
	// 	renderCell: (params) => {

	// 		return (

	// 			params?.row?.numero_ufu &&
	// 			<div className="w-full h-full flex items-center" >
	// 				<Chip
	// 					variant="gradient"
	// 					color={params?.row?.numero_ufu ? "green" : "red"}
	// 					value={params?.row?.numero_ufu}
	// 					className="py-2 px-2 text-[12.5px] font-medium"
	// 				/>
	// 			</div>

	// 		)
	// 	}
	// },

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
						value={row.meta.folders_count+" Dossiers"}
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

			const navigate = useNavigate();
			const { setDialogue } = useDialogueStore();

			return (
				// isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) || isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) ?
				<Menu placement="bottom-end">
					<MenuHandler>
						<IconButton size="sm" variant="text" color="blue-gray">
							<EllipsisVerticalIcon
								strokeWidth={1.5}
								className="h-6 w-6"
							/>
						</IconButton>
					</MenuHandler>

					<MenuList className="p-1 rounded-[5px]">
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									navigate(`./${params.row.id}`,
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
									setDialogue({
										size: "md",
										open: true,
										view: "update-client",
										data: params.row
									})
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Modifier le client
							</MenuItem>
						{/* } */}

						
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									setDialogue({
										size: "md",
										open: true,
										view: "details-client",
										data: params.row
									})
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Détails du client
							</MenuItem>
						{/* } */}

						<MenuItem
							onClick={() => 
								setDialogue({
									size: "sm",
									open: true,
									view: "delete-client",
									data: params.row
								})
							}
							className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
						>
							Supprimer le client
						</MenuItem>

					</MenuList>
				</Menu>
			)
		}
	}
];

export const columnClientsMinuature = [
	{
		field: 'matricule',
		headerName: 'Matricule',
		flex: 0.4,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			function convertToFiveDigits(number) {
				// Convertir le nombre en chaîne de caractères
				let strNumber = number.toString();
				
				// Vérifier la longueur de la chaîne de caractères
				if (strNumber.length < 5) {
					// Ajouter des zéros à gauche jusqu'à ce que la longueur soit de 5
					strNumber = '0'.repeat(5 - strNumber.length) + strNumber;
				}
				
				return '0'.repeat(1) + strNumber;
			}

			return (

				<div className="flex flex-col" >
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13.5px] "
					>
						{params?.row?.matricule}
					</Typography>

					<Typography
						variant="small"
						color="blue-gray"
						className=" font-medium mt-2 text-[12.5px] "
					>
						{dayjs(params?.row?.created_at).format('DD MMM YYYY')}
					</Typography>

				</div>

			)

		}
	},

	{
		field: 'civility',
		headerName: 'Civilité',
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
					{params?.row?.civility}
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
					<AvatarMui >

					</AvatarMui>
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13.5px] "
					>
						{row.civility == "Structure" ? row?.denomination : row?.firstname + " " + row?.lastname}
					</Typography>
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
						value={row.meta.folders_count+" Dossiers"}
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

			const navigate = useNavigate();
			const { setDialogue } = useDialogueStore();

			return (
				// isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) || isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) ?
				<Menu placement="bottom-end">
					<MenuHandler>
						<IconButton size="sm" variant="text" color="blue-gray">
							<EllipsisVerticalIcon
								strokeWidth={1.5}
								className="h-6 w-6"
							/>
						</IconButton>
					</MenuHandler>

					<MenuList className="p-1 rounded-[5px]">
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									navigate(`../clients/${params.row.id}`,
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
									setDialogue({
										size: "md",
										open: true,
										view: "update-client",
										data: params.row
									})
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Modifier le client
							</MenuItem>
						{/* } */}

						
						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									setDialogue({
										size: "md",
										open: true,
										view: "details-client",
										data: params.row
									})
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Détails du client
							</MenuItem>
						{/* } */}

						<MenuItem
							onClick={() => 
								setDialogue({
									size: "sm",
									open: true,
									view: "delete-client",
									data: params.row
								})
							}
							className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
						>
							Supprimer le client
						</MenuItem>

					</MenuList>
				</Menu>
			)
		}
	}
];

export const columnDossierForUser = [
	{ 
		field: null,
		headerName: 'Dossier',
		flex: 2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="flex items-center">
					<div style={{backgroundColor: params.row?.category?.category_color}} className="flex h-[70px] w-[70px] items-center justify-center rounded-md">
						<FaFolder size={18} color="white" />
					</div>
					<div className="ml-4">
						<h2 className=" line-clamp-2 " >{params.row?.category?.category_name}</h2>
						<p className="text-gray-700 mt-2 ">{params.row.folder_name || "####"}</p>
					</div>
				</div>

			)

		}
	},

	{
		field: 'collaboTitulaire',
		headerName: 'Titulaire',
		flex: 1.2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: ({row}) => {
			return (
				<div>
					<div className="flex items-center gap-2 ">
						<PhotoView key={row.id} src={row.manager?.profil_pic || '/img/sigen/user128.png'}>
							<AvatarMui src={row?.manager?.profil_pic} sx={{ width: 30, height: 30 }} />
						</PhotoView>
						<div>
							<Typography
								variant="small"
								color="blue-gray"
								className="font-medium opacity-85 text-[13px] line-clamp-1 capitalize"
							>
								{row?.manager?.firstname + " " + row?.manager?.lastname}
							</Typography>
						</div>
					</div>
				</div>
			)
		}
	},

	{
		field: 'collaboSupleant',
		headerName: 'Suppléant',
		flex: 1.2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: ({row}) => {
			return (
				<div>
					{row?.subManager && 

						<div className="flex items-center mt-2 gap-2 ">
							<PhotoView key={row.id} src={row.subManager?.profil_pic || '/img/sigen/user128.png'}>
								<AvatarMui src={row?.subManager?.profil_pic} sx={{ width: 30, height: 30 }} />
							</PhotoView>
							<div>
								<Typography
									variant="small"
									color="blue-gray"
									className="font-medium opacity-60 text-[13px] line-clamp-1 capitalize"
								>
									{row?.subManager?.firstname + " " + row?.subManager?.lastname}
								</Typography>
							</div>
						</div>

					}
				</div>
			)
		}
	},
	
	{
		field: 'status',
		headerName: 'Status',
		width: 120,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				params?.row?.is_archived ?
					
					<Chip
						variant="gradient"
						color={"red"}
						value={ "Archiver"}
						className="py-2 px-2 !text-[12.5px] font-medium"
					/>

				:

					<div className="w-full h-full flex items-center" >
						<Chip
							variant="gradient"
							color={params?.row?.is_treated_folder ? "green" : "orange"}
							value={params?.row?.is_treated_folder ? "Traité" : "En Cours"}
							className="py-2 px-2 !text-[12.5px] font-medium"
						/>
					</div>

			)
		}
	},

	{
		field: 'created_at',
		headerName: 'Créer le',
		width: 120,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {
			return (
				<div className="w-full h-full flex items-center" >
					{dayjs(params?.row?.created_at).format('DD MMM YYYY')}
				</div>
			)
		}
	},

];

export const columnDossier = [
	{ 
		field: null,
		headerName: 'Dossiers',
		flex: 2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="flex items-center">
					<div style={{backgroundColor: params.row?.category?.category_color}} className="flex h-[70px] w-[70px] items-center justify-center rounded-md">
						<FaFolder size={18} color="white" />
					</div>
					<div className="ml-4">
						<h2 className=" line-clamp-2 " >{params.row?.category?.category_name}</h2>
						<p className="text-gray-700 mt-2 ">{params.row.folder_name || "####"}</p>
					</div>
				</div>

			)

		}
	},

	{
		field: 'fullname',
		headerName: 'Clients',
		flex: 1.8,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				row?.client?.civility === "Structure" ?

					<div className="flex items-center gap-4 ">
						<AvatarMui>
						</AvatarMui>
						<Typography
							variant="small"
							color="blue-gray"
							className="font-semibold text-[13.5px] line-clamp-1 "
						>
							{row?.client?.denomination}
						</Typography>
					</div>

				:

					<div className="flex items-center gap-4 ">
						<AvatarMui>
						</AvatarMui>
						<Typography
							variant="small"
							color="blue-gray"
							className="font-semibold text-[13.5px] line-clamp-1 "
						>
							{row?.client?.firstname + " " + row?.client?.lastname}
						</Typography>
					</div>

			)

		}
	},

	{
		field: 'collaboTitulaire',
		headerName: 'Titulaire',
		flex: 1.2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: ({row}) => {
			return (
				<div>
					<div className="flex items-center gap-2 ">
						<PhotoView key={row.id} src={row.manager?.profil_pic || '/img/sigen/user128.png'}>
							<AvatarMui src={row?.manager?.profil_pic} sx={{ width: 30, height: 30 }} />
						</PhotoView>
						<div>
							<Typography
								variant="small"
								color="blue-gray"
								className="font-medium opacity-85 text-[13px] line-clamp-1 capitalize"
							>
								{row?.manager?.firstname + " " + row?.manager?.lastname}
							</Typography>
						</div>
					</div>
				</div>
			)
		}
	},

	{
		field: 'collaboSupleant',
		headerName: 'Suppléant',
		flex: 1.2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: ({row}) => {
			return (
				<div>
					{row?.subManager && 

						<div className="flex items-center gap-2 ">
							<PhotoView key={row.id} src={row.subManager?.profil_pic || '/img/sigen/user128.png'}>
								<AvatarMui src={row?.subManager?.profil_pic} sx={{ width: 30, height: 30 }} />
							</PhotoView>
							<div>
								<Typography
									variant="small"
									color="blue-gray"
									className="font-medium opacity-60 text-[13px] line-clamp-1 capitalize"
								>
									{row?.subManager?.firstname + " " + row?.subManager?.lastname}
								</Typography>
							</div>
						</div>

					}
				</div>
			)
		}
	},

	{
		field: 'status',
		headerName: 'Status',
		width: 120,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="w-full h-full flex items-center" >

					{params?.row?.is_archived ?
					
						<Chip
							variant="gradient"
							color={"red"}
							value={ "Archiver"}
							className="py-2 px-2 !text-[12.5px] font-medium"
						/>

					:

						<div 
							className={" px-3 py-1 rounded-md text-white "+ (params?.row?.is_treated_folder ? "bg-green-500" : "bg-orange-500")} 
						>
							{params?.row?.is_treated_folder ? "Traité" : "En Cours"}
						</div>
					}

				</div>

			)
		}
	},

	{
		field: 'created_at',
		headerName: 'Créer le',
		width: 120,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {
			return (
				<div className="w-full h-full flex items-center" >
					{dayjs(params?.row?.created_at).format('DD MMM YYYY')}
				</div>
			)
		}
	},


	// {
	// 	field: 'action',
	// 	headerAlign: 'center',
	// 	headerName: '',
	// 	width: 60,
	// 	sortable: false,
	// 	hideSortIcons: true,
	// 	disableColumnMenu: true,
	// 	renderCell: (params) => {

	// 		const navigate = useNavigate();
	// 		const { setDialogue } = useDialogueStore();

	// 		return (
	// 			// isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) || isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) ?
	// 			<Menu placement="bottom-end">
	// 				<MenuHandler>
	// 					<IconButton size="sm" variant="text" color="blue-gray">
	// 						<EllipsisVerticalIcon
	// 							strokeWidth={1.5}
	// 							className="h-6 w-6"
	// 						/>
	// 					</IconButton>
	// 				</MenuHandler>

	// 				<MenuList className="p-1 rounded-[5px]">
	// 					{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
	// 						<MenuItem
	// 							onClick={() =>
	// 								navigate(`./view`,
	// 									{ state: params.row })
	// 							}
	// 							className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between"
	// 						>
	// 							Voir le dossier
	// 						</MenuItem>
	// 					{/* } */}

	// 					{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
	// 						{/* <MenuItem
	// 							onClick={() =>
	// 								setDialogue({
	// 									size: "md",
	// 									open: true,
	// 									view: "update-client",
	// 									data: params.row
	// 								})
	// 							}
	// 							className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
	// 						>
	// 							Modifier le dossier
	// 						</MenuItem> */}
	// 					{/* } */}

						
	// 					{/* <MenuItem
	// 						// onClick={() => dispatch({
	// 						// 	type: "SET_DIALOG",
	// 						// 	value: {
	// 						// 		active: true,
	// 						// 		view: "suspendDriver",
	// 						// 		value: {
	// 						// 			wasActive: true,
	// 						// 			user: params.row,
	// 						// 		}
	// 						// 	}
	// 						// })}
	// 						className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
	// 					>
	// 						Supprimer le dossier
	// 					</MenuItem> */}

	// 				</MenuList>
	// 			</Menu>
	// 		)
	// 	}
	// }
];

export const columnMinuatureDossier = [
	{ 
		field: null,
		headerName: 'Dossiers',
		flex: 2,
		minWidth: 200,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="flex items-center">
					<div style={{backgroundColor: params.row?.category?.category_color}} className="flex h-[70px] w-[70px] items-center justify-center rounded-md">
						<FaFolder size={18} color="white" />
					</div>
					<div className="ml-4">
						<h2 className=" line-clamp-2 " >{params.row?.category?.category_name}</h2>
						<p className="text-gray-700 mt-2 ">{params.row.folder_name || "####"}</p>
					</div>
				</div>

			)

		}
	},

	{
		field: 'fullname',
		headerName: 'Clients',
		flex: 1.8,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				row?.client?.civility === "Structure" ?

					<div className="flex items-center gap-4 ">
						<AvatarMui>
						</AvatarMui>
						<Typography
							variant="small"
							color="blue-gray"
							className="font-semibold text-[13.5px] line-clamp-1 "
						>
							{row?.client?.denomination}
						</Typography>
					</div>

				:

					<div className="flex items-center gap-4 ">
						<AvatarMui>
						</AvatarMui>
						<Typography
							variant="small"
							color="blue-gray"
							className="font-semibold text-[13.5px] line-clamp-1 "
						>
							{row?.client?.firstname + " " + row?.client?.lastname}
						</Typography>
					</div>

			)

		}
	},

	{
		field: 'status',
		headerName: 'Status',
		width: 120,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="w-full h-full flex items-center" >
					{/* <Chip
						variant="gradient"
						color={params?.row?.is_treated_folder ? "green" : "orange"}
						value={params?.row?.is_treated_folder ? "Traité" : "En Cours"}
						className="py-2 px-2 !text-[12.5px] font-medium"
					/> */}

					<div 
						className={" px-3 py-1 rounded-md text-white "+ (params?.row?.is_treated_folder ? "bg-green-500" : "bg-orange-500")} 
					>
						{params?.row?.is_treated_folder ? "Traité" : "En Cours"}
					</div>

				</div>

			)
		}
	}

];

export const columnDossierCollabo = [
	{ 
		field: null,
		headerName: 'Dossier',
		flex: 2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="flex items-center">
					<div style={{backgroundColor: params.row?.category?.category_color}} className="flex h-[70px] w-[70px] items-center justify-center rounded-md">
						<FaFolder size={18} color="white" />
					</div>
					<div className="ml-4">
						<h2 className=" line-clamp-2 " >{params.row?.category?.category_name}</h2>
						<p className="text-gray-700 mt-2 ">{params.row.folder_name || "####"}</p>
					</div>
				</div>

			)

		}
	},

	{
		field: 'fullname',
		headerName: 'Clients',
		flex: 1.8,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				row?.client?.civility === "Structure" ?

					<div className="flex items-center gap-4 ">
						<AvatarMui>
						</AvatarMui>
						<Typography
							variant="small"
							color="blue-gray"
							className="font-semibold text-[13.5px] line-clamp-1 "
						>
							{row?.client?.denomination}
						</Typography>
					</div>

				:

					<div className="flex items-center gap-4 ">
						<AvatarMui>
						</AvatarMui>
						<Typography
							variant="small"
							color="blue-gray"
							className="font-semibold text-[13.5px] line-clamp-1 "
						>
							{row?.client?.firstname + " " + row?.client?.lastname}
						</Typography>
					</div>

			)

		}
	},

	{
		field: 'collabo',
		headerName: 'Collaborateurs',
		flex: 2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: ({row}) => {
		
			return (
				<Typography
					variant="small"
					color="blue-gray"
					className="font-medium opacity-85 text-[13px] line-clamp-1 capitalize"
				>
					{"Titulaire"}
				</Typography>
			)
		}
	},

	{
		field: 'status',
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
						color={params?.row?.is_treated_folder ? "green" : "orange"}
						value={params?.row?.is_treated_folder ? "Traité" : "En Cours"}
						className="py-2 px-2 !text-[12.5px] font-medium"
					/>
				</div>

			)
		}
	},

	{
		field: 'created_at',
		headerName: 'Créer le',
		width: 120,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {
			return (
				<div className="w-full h-full flex items-center" >
					{dayjs(params?.row?.created_at).format('DD MMM YYYY')}
				</div>
			)
		}
	}
];

export const columnMinutes = [
	{
		field: 'matricule',
		headerName: 'Matricule',
		flex: 0.4,
		minWidth: 170,
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: (params) => {

			return (

				<div className="flex flex-col" >
					<Typography
						variant="small"
						color="blue-gray"
						className="font-semibold text-[13.5px] "
					>
						{params?.row?.matricule}
					</Typography>
				</div>

			)

		}
	},

	{
		field: 'template_name',
		headerName: "Titre",
		flex: 1.5,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: (params) => {
			return (
				<div className="flex-row flex items-center gap-x-3 " >
					<span className=" w-[40px] h-[40px] rounded-full flex justify-center items-center bg-primary " >
						<FaRegFileWord size={18} color="#fff" />
					</span>
					<Typography
						variant="small"
						color="blue-gray"
						className=" font-medium text-[13.5px] "
					>
						{params?.row?.template_name}
					</Typography>
				</div>
			)
		}
	},

	{
		field: 'categorie',
		headerName: 'Catégorie',
		flex: 1.2,
		width: 170,
		sortable: false,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {
			return (
				<div>
					{row?.category?.category_name}
				</div>
			)
		}
	},

	{
		field: 'createDate',
		headerName: 'Date de création',
		flex: 0.5,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {

			return (

				<div className="w-full h-full flex items-center" >
					{dayjs(row?.created_at).format('DD MMM YYYY à HH:mm')}
				</div>

			)

		}
	},

	{
		field: 'updateDate',
		headerName: 'Dernière modification',
		flex: 0.5,
		minWidth: 170,
		sortable: true,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({row}) => {
			return (
				<div className="w-full h-full flex items-center" >
					{dayjs(row?.updated_at).format('DD MMM YYYY à HH:mm')}
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

			const navigate = useNavigate();
			const { setDialogue } = useDialogueStore();

			return (
				// isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) || isAllowedTo(Permissions.ENABLE_AND_DISABLE_A_DRIVER) ?
				<Menu placement="bottom-end">
					<MenuHandler>
						<IconButton size="sm" variant="text" color="blue-gray">
							<EllipsisVerticalIcon
								strokeWidth={1.5}
								className="h-6 w-6"
							/>
						</IconButton>
					</MenuHandler>

					<MenuList className="p-1 rounded-[5px]">

						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
						<MenuItem
							onClick={() =>
								setDialogue({
									size: "lg",
									open: true,
									view: "view-template",
									data: {...params.row, isUpdate: true}
								})
							}
							className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
						>
							Aperçu
						</MenuItem>
						{/* } */}

						{/* {isAllowedTo(Permissions.VIEW_A_DRIVER_DETAILS) && */}
							<MenuItem
								onClick={() =>
									navigate('edit', {state: params.row} )
								}
								className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-primary hover:!text-white font-medium flex items-center justify-between mt-1"
							>
								Editer l'exemplaire
							</MenuItem>
						{/* } */}

						<MenuItem
							className="text-[13px] bg-[#00000007] rounded-[3px] px-[10px] text-black hover:!bg-red-600 hover:!text-white font-medium flex items-center justify-between mt-1"
						>
							Supprimer l'exemplaire
						</MenuItem>

					</MenuList>
				</Menu>
			)
		}
	}
];

export const rolesColumns = [
	{
		field: 'roleName',
		headerName: 'Titre du rôle',
		flex: 2,
		minWidth: 170,
		sortable: false,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({ row, ...rest }) => {
			return (
				<span className="text-[13px]">
					{row?.role_name ?? "-"}
				</span>
			);
		}
	},
	{
		field: 'permissionsCount',
		headerName: "Nombre d'accès",
		flex: 2,
		sortable: false,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({ row, ...rest }) => {
			return (
				<div className="w-full h-full flex items-center" >
					{(row?.meta?.totalPermission ?? 0)}
				</div>
			);
		}
	},
	{
		field: 'totalUsers',
		headerName: "Nombre de collaborateur",
		flex: 2,
		sortable: false,
		hideSortIcons: false,
		disableColumnMenu: true,
		renderCell: ({ row, ...rest }) => {
			return (
				<div className="w-full h-full flex items-center" >
					{(row?.meta?.totalUsers ?? 0)}
				</div>
			);
		}
	},
	{
		field: 'action',
		headerAlign: 'center',
		headerName: '',
		sortable: false,
		hideSortIcons: true,
		disableColumnMenu: true,
		renderCell: ({ row, ...rest }) => {
			const navigate = useNavigate();
			// return isAllowedTo(Permissions.EDIT_ROLE) ? (
			return (
				<button
					className="text-[#0F123E] h-[36px] w-full rounded-[5px] flex items-center justify-center gap-[5px]"
					// onClick={() => navigate(`./${row?.id}`, { state: { role: row } })}
				>
					Voir plus
					<BsChevronRight />
				</button>
			)
			// ) : null;
		}
	},
];
