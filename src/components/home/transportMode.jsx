import React, { useState } from "react";
import {
	Typography,
	Card,
	CardHeader,
	CardBody,
	IconButton,
	CardFooter,
	Menu,
	MenuHandler,
	MenuList,
	MenuItem,
} from "@material-tailwind/react";

import { FaMapSigns } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import Pagination from '@mui/material/Pagination';

import { useQuery } from "@tanstack/react-query";
import { TransportModeApi } from "@/api/api";
// import {ZoneApi} from "api/api";

import {
	EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import useAuth from "@/hooks/useAuth";
import { useDialogController } from "@/context/dialogueProvider";
import { isAllowedTo } from "@/utils";
import { Permissions } from "@/data/role-access-data";


function TransportModeCard() {

	const [dialogueState, dispatch] = useDialogController();

	const { auth } = useAuth();
	const [page, setpage] = useState(1);
	const [perPage, setperPage] = useState(25);
	const [totalpage, setTotalpage] = useState(1);

	const { isError, data: modeList, error, isLoading } = useQuery({
		queryKey: ['getMode', page, perPage],
		queryFn: async ({ queryKey }) => {
			return TransportModeApi.getTransportMode(queryKey[1], queryKey[2])
		},
		onSuccess: (data) => {
			setTotalpage(data.meta.totalPage);
		},
		enabled: true,
		staleTime: 40 * 60 * 1000
	})

	return (

		<Card className=" max-h-[530px] " >

			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="m-0 p-6 flex justify-between "
			>

				<div>

					<Typography variant="h6" color="blue-gray" className="mb-2">
						Modes de transport
					</Typography>

					<Typography
						variant="small"
						className="flex items-center gap-1 font-normal text-blue-gray-600"
					>

						<FaMapSigns className=" text-green-400 " />
						<strong>{modeList?.meta?.total || null}</strong> mode(s) de transport

					</Typography>

				</div>

				{isAllowedTo(Permissions.ADD_MODE_TRANSPORT) &&
					<Menu placement="bottom-end">

						<MenuHandler>

							<IconButton size="sm" variant="text" color="blue-gray">
								<EllipsisVerticalIcon
									strokeWidth={3}
									fill="currenColor"
									className="h-6 w-6"
								/>
							</IconButton>
						</MenuHandler>

						<MenuList>

							<MenuItem
								onClick={() =>
									dispatch({
										type: "SET_DIALOG", value: {
											active: true,
											view: "createMode",
											value: null
										}
									})
								}
							>
								Nouvelle Mode
							</MenuItem>

						</MenuList>

					</Menu>
				}

			</CardHeader>

			<CardBody className="pt-0 flex flex-1 flex-col overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">

				{!isLoading ?

					<>
						{modeList?.data.map(

							(mode, key) => (

								<div key={key} className="flex flex-row gap-x-[10px] py-2 items-center " >

									<div className="flex flex-col flex-1 " >

										<Typography
											variant="small"
											color="blue-gray"
											className="block font-medium line-clamp-1"
										>
											{mode?.title}
										</Typography>

										<Typography
											as="span"
											variant="small"
											className="text-xs font-medium text-blue-gray-500 mt-1"
										>
											{mode?._count.transportMoyens} moyen(s) de transport
										</Typography>

									</div>

									<div className="flex flex-row gap-x-[5px]" >

										{isAllowedTo(Permissions.EDIT_MODE_TRANSPORT) &&
											<IconButton
												variant="filled" color="blue" className=" shadow-none " size="sm"
												onClick={() => dispatch({
													type: "SET_DIALOG",
													value: {
														active: true,
														view: "updateZone",
														value: mode
													}
												})}
											>
												<AiOutlineEdit size={16} />
											</IconButton>
										}

										{isAllowedTo(Permissions.DELETE_MODE_TRANSPORT) &&
											(mode?._count.transportMoyens == 0 &&
												<IconButton
													variant="filled" color="red" size="sm"
													onClick={() => dispatch({
														type: "SET_DIALOG",
														value: {
															active: true,
															view: "deleteMode",
															value: mode
														}
													})}
												>
													<MdDeleteForever size={16} />
												</IconButton>
											)
										}

									</div>

								</div>
							)

						)}

					</>

					:

					<div className=" w-full animate-pulse">

						{Array.from(Array(8).keys()).map((_, key) => (

							<div key={key} className="h-[70px] bg-gray-200 rounded-[5px] dark:bg-gray-700 max-w-full mb-2.5" />

						))}

					</div>

				}


			</CardBody>

			<CardFooter divider={true} >
				<Pagination count={totalpage} onChange={(_, value) => setpage(value)} variant="outlined" color='primary' size="small" />
			</CardFooter>

		</Card>

	)

}

export default TransportModeCard