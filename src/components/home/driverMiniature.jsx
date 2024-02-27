import React, { useState } from "react";
import {
	Typography,
	Card,
	CardHeader,
	CardBody
} from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import DataGridComponent from "../common/datatable";
import { columnDriverMiniature } from "@/utils/columsDatatable";
import { useNavigate } from "react-router-dom";
import { DriverApi } from "@/api/api";
import { isAllowedTo } from "@/utils";
import { Permissions } from "@/data/role-access-data";



export function DriverMiniatureCard() {

	const navigate = useNavigate();
	const [total, setTotal] = React.useState(0);

	const updateTotal = (ttal) => {
		setTotal(ttal);
	};

	return (

		<Card className={`overflow-hidden h-[530px] ${isAllowedTo(Permissions.VIEW_MODE_TRANSPORT) ? 'xl:col-span-2' : 'xl:col-span-3'}`}>

			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="m-0 flex items-center justify-between p-6"
			>

				<div>
					<Typography variant="h6" color="blue-gray" className="mb-1">
						{total || 0} Conducteurs
					</Typography>
				</div>

				<Button
					onClick={() => navigate("/dashboard/drivers")}
				>
					Plus
				</Button>

			</CardHeader>

			<CardBody className="flex flex-1 scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 px-1 pt-0 pb-0">

				<DataGridComponent
					hidePagination={true}
					columns={columnDriverMiniature}
					queryFirstKey={"getDriverMiniature"}
					fnQuery={async ({ queryKey }) => {
						return DriverApi.getDriver(queryKey[1], queryKey[2], ["DRIVER"])
					}
					}
					idpri={"idUser"}
					handleTotal={updateTotal}
				/>

			</CardBody>

		</Card>


	);

}

export default DriverMiniatureCard;
