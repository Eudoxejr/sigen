import React, { useState } from "react";
import {
	Typography,
	Card,
	CardHeader,
	CardBody
} from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import DataGridComponent from "../common/datatable";
import { columnClientsMinuature } from "@/utils/columsDatatable";
import { useNavigate } from "react-router-dom";
import { ClientApi } from '@/api/api';
import { isAllowedTo } from "@/utils";
import { Permissions } from "@/data/role-access-data";
import { useQueryClient } from "@tanstack/react-query";


export function ClientMiniatureCard() {

	const navigate = useNavigate();
	const [total, setTotal] = useState(0);

	const queryClient = useQueryClient();

	const clientMeta = queryClient.getQueriesData(["getClient"])?.[0]?.[1]?.meta

	return (

		<Card 
			className={`overflow-hidden h-[530px] flex flex-1 `}
		>

			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="m-0 flex items-center justify-between p-6"
			>

				<div>
					<Typography variant="h6" color="blue-gray" className="mb-1">
					Clients ({clientMeta?.total || total})
					</Typography>
				</div>

				<button onClick={() => navigate("/dashboard/clients")} className=" px-3 py-2 bg-primary text-white text-sm rounded-lg " >
					Plus
				</button>

				{/* <Button
					onClick={() => navigate("/dashboard/clients")}
				>
					Plus
				</Button> */}

			</CardHeader>

			<CardBody className="flex flex-1 scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 px-1 pt-0 pb-0">

				<DataGridComponent
                  idpri="id"
                  hidePagination={true}
                  hideHeader={false}
                  columns={columnClientsMinuature}
                  queryKey={[
                    "getClientMinuature", 
                    1,
                    30,
                    // searchTerm,
                    // role
                  ]}
                  fnQuery={({ queryKey }) => ClientApi.getClient(queryKey[1], queryKey[2], queryKey[3] )}
                  noRow={"Pas de client trouvé"}
                  totalInformation={{total, setTotal}}
                />

			</CardBody>

		</Card>


	);

}

export default ClientMiniatureCard;
