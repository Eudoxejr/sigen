import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { produce } from "immer"
import Select from 'react-select'
import DataGridComponent from '@/components/common/datatable';
import { devisColumns } from '@/utils/columsDatatable';
import { DevisApi } from '@/api/api';
import debounce from 'lodash.debounce';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';

const DevisListe = () => {

  const [total, setTotal] = useState(0);
  const updateTotal = (ttal) => {
    setTotal(ttal);
  };

  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState();


  const { isLoading, refetch } = useQuery({

    queryKey: ["getDevisFiltre", 1, 25, searchTerm, status],
    queryFn: async ({ queryKey }) => {
      return DevisApi.getDevis(queryKey[1], queryKey[2], queryKey[3], queryKey[4])
    },
    onSuccess: (data) => {

      // console.log(data);

      queryClient.setQueriesData(["getDevis"], (dataService) => {
        const nextData = produce(dataService, draftData => {
          draftData.data = data.data
          draftData.meta = data.meta
        })
        return nextData;
      })

    },
    enabled: false,
    staleTime: 0

  })

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  useEffect(() => {

    if (typeof (searchTerm) === 'string' || typeof (status) !== 'undefined') {
      refetch()
    }

    return () => {
      debouncedResults.cancel();
    };

  }, [searchTerm, status]);

  const options = [
    { value: null, label: 'Tout' },
    { value: 'SENT', label: 'En Attente' },
    { value: 'TREATED', label: 'Traité' },
    { value: 'ASSIGNED', label: 'Assigné' },
    { value: 'CANCELED', label: 'Annulé' },
    { value: 'ATPLACE', label: 'Sur Place' },
    { value: 'INPROGRESS', label: 'En cours' },
    { value: 'ENDED', label: 'Fini' },
    { value: 'VALIDATED', label: 'Validé' }
  ]

  return (
    <RenderIf allowedTo={Permissions.VIEW_ESTIMATION_REQUESTS_LIST}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray" >
              {total} Demande(s)
            </Typography>
          </CardHeader>
          <CardBody className="md:h-[calc(100vh-220px)] shadow-none flex flex-col px-4 pt-0 pb-4 gap-[15px] overflow-auto">
            <div className="w-full flex justify-between items-center flex-wrap gap-y-3">
              <div class='max-w-md min-w-[140px]'>
                <div className="relative flex items-center w-full h-[42px] rounded-lg focus-within:shadow-md bg-blue-gray-800 overflow-hidden">
                  <div className="grid place-items-center h-full w-12 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    className="peer bg-blue-gray-800 h-full w-full outline-none text-[12.5px] text-white pr-2"
                    type="text"
                    id="search"
                    placeholder="Rechercher..."
                    onChange={debouncedResults}
                  />
                </div>
              </div>
              <div class='max-w-md z-20'>
                <Select
                  options={options}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      height: 42,
                      width: 240,
                      fontSize: 13,
                      fontWeight: "300",
                      color: "red",
                      zIndex: 100
                    }),
                  }}
                  placeholder="Filtrer"
                  onChange={(val) => setStatus(val.value)}
                />
              </div>
            </div>
            <div className="flex-1 w-full">
              <DataGridComponent
                hidePagination={false}
                idpri="idReservation"
                queryFirstKey={"getDevis"}
                columns={devisColumns}
                fnQuery={({ queryKey }) => DevisApi.getDevis(queryKey[1], queryKey[2], searchTerm, status)}
                handleTotal={updateTotal}
                loadSup={
                  typeof (searchTerm) == 'string' || typeof (status) !== 'undefined' ? isLoading : false
                }
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default DevisListe;