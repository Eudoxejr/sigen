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
import { columnMinuatureDossier } from "@/utils/columsDatatable";
import { FaMapSigns } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import DataGridComponent from "../common/datatable";
import { Button } from "@material-tailwind/react";

import { useNavigate } from "react-router-dom";
import { FoldersApi } from "@/api/api";
// import {ZoneApi} from "api/api";

import {
	EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { isAllowedTo } from "@/utils";
import { Permissions } from "@/data/role-access-data";


function FolderCard() {

	const navigate = useNavigate();
	const [total, setTotal] = useState(0);

	return (

		<Card className=" max-h-[530px] w-[45%] " >

			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="m-0 p-6 flex justify-between "
			>

				<div className=" w-full flex flex-row justify-between items-center " >

					<Typography variant="h6" color="blue-gray" className="mb-2">
						Dossiers
					</Typography>

					<Button
						onClick={() => navigate("/dashboard/dossiers")}
					>
						Plus
					</Button>

				</div>

			</CardHeader>

			<CardBody className="pt-0 flex flex-1 flex-col overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 ">

				<DataGridComponent
                  idpri="id"
                  hidePagination={true}
                  hideHeader={false}
                  columns={columnMinuatureDossier}
                  queryKey={[
                    "getFolderMinuature", 
                    1,
                    30
                  ]}
                  fnQuery={({ queryKey }) => FoldersApi.getFolders(queryKey[1], queryKey[2])}
                  noRow={"Pas de dossier trouvé"}
                  totalInformation={{total, setTotal}}
                />

			</CardBody>

			<CardFooter divider={true} >
				{/* <Pagination count={totalpage} onChange={(_, value) => setpage(value)} variant="outlined" color='primary' size="small" /> */}
			</CardFooter>

		</Card>

	)

}

export default FolderCard