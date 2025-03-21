import React, { useState, useEffect, useMemo } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Typography,
	Button
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { MoyenApi } from "@/api/api";
import debounce from 'lodash.debounce';
import { useQuery } from "@tanstack/react-query";
import Pagination from '@mui/material/Pagination';
import { MoyenTransportCard } from "./components";
import { isAllowedTo } from "@/utils";
import { Permissions } from "@/data/role-access-data";
import { RenderIf } from "@/components/common/render.if";

export function TransportMoyen() {

	const navigate = useNavigate();

	// const dispatch = useDispatch();

	const [searchTerm, setSearchTerm] = useState();
	const [pagination, setPagination] = useState({
		page: 1,
		pageSize: 25
	})

	const { isLoading, refetch, data: moyenList } = useQuery({

		queryKey: ["getMoyen", pagination.page, pagination.pageSize, searchTerm],
		queryFn: async ({ queryKey }) => {
			return MoyenApi.getMoyen(queryKey[1], queryKey[2], queryKey[3])
		},
		onSuccess: (data) => {
			// console.log(data);
		},
		enabled: true,
		staleTime: 40 * 60 * 1000

	})

	const handleChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const debouncedResults = useMemo(() => {
		return debounce(handleChange, 300);
	}, []);


	useEffect(() => {

		if (typeof (searchTerm) === 'string') {
			refetch()
		}

		return () => {
			debouncedResults.cancel();
		};

	}, [searchTerm]);

	const handleViewDetails = item => {
		navigate(`./${item?.idTransportMoyen}`);
	};

	return (
		<RenderIf allowedTo={Permissions.VIEW_TRANSPORT_MEANS_LIST}>
			<div className="mt-12 flex-1 w-full flex flex-col">
				<Card>
					<CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center ">
						<Typography variant="h6" color="blue-gray" >
							{moyenList?.meta?.total || 0} Moyen(s) de transport
						</Typography>
						{isAllowedTo(Permissions.ADD_TRANSPORT_MEAN) &&
							<Link to='/dashboard/moyen-transport/new'>
								<Button
									className="text-[11px] bg-[#0F123E]"
								>
									Ajouter
								</Button>
							</Link>
						}
					</CardHeader>
					<CardBody className="md:h-[calc(100vh-220px)] shadow-none flex flex-col px-4 pt-0 pb-4 gap-[15px]">
						<div className="w-full mb-2 flex justify-between items-center flex-wrap gap-y-3">
							<div class='w-[400px]'>
								<div className="relative flex items-center w-full h-[42px] rounded-lg focus-within:shadow-md bg-blue-gray-900 overflow-hidden">
									<div className="grid place-items-center h-full w-12 text-gray-300">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</div>
									<input
										className="peer bg-blue-gray-900 h-full w-full outline-none text-[13px] text-white pr-2"
										type="text"
										id="search"
										placeholder="Recherche..."
										onChange={debouncedResults}
									/>
								</div>
							</div>
							<Pagination count={moyenList?.meta?.totalPage || 1} onChange={(_, value) => setPagination({ ...pagination, page: value })} variant="outlined" color='primary' size="small" />
						</div>
						{!isLoading ?
							moyenList?.data?.length > 0 ?
								<div className="flex-1 w-full flex items-start flex-wrap overflow-y-auto">
									{moyenList.data.map((item, key) => (
										<MoyenTransportCard
											key={String(key)}
											item={item}
											className="w-1/4"
											onViewDetails={handleViewDetails}
										/>
									))}
								</div>
								:
								<div className="w-full flex-1 flex flex-col justify-center items-center" >
									<span>Pas de moyen de transport disponible</span>
								</div>
							:
							<div className="md:h-[calc(100%-50px)] animate-pulse overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4 " >
								{Array.from(Array(6).keys()).map((_, key) => (
									<div key={key} className="h-[260px] bg-gray-200 rounded-[5px] dark:bg-gray-700 max-w-full mb-2.5" />
								))}
							</div>
						}
					</CardBody>
				</Card>
			</div>
		</RenderIf>
	);
}

export default TransportMoyen;
