import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import AsyncSelect from 'react-select/async';
import DataGridComponent from '@/components/common/datatable';
import { vehicleColumns } from '@/utils/columsDatatable';
import { VehicleApi, MoyenApi } from "@/api/api";
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer"
import { RenderIf } from "@/components/common/render.if";
import { Permissions } from "@/data/role-access-data";
import { isAllowedTo } from "@/utils";


const VehiculeListe = () => {

  const [searchTerm, setSearchTerm] = useState();
  const [moyen, setMoyen] = useState();

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const updateTotal = (ttal) => {
    setTotal(ttal);
  };

  const getMoyen = async (inputValue) => {
    const res = await MoyenApi.getMoyen(1, 8, inputValue)
    //   console.log(res);
    // res.data.unshift({idTransportMoyen: null, title: 'Tout les moyens de transport'})
    return res.data.map((data) => { return { label: data.title, value: data.idTransportMoyen } })
  };

  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(getMoyen(inputValue))
    }
    );

  const { isLoading, refetch } = useQuery({

    queryKey: ["getVehicleFiltre", 1, 25, searchTerm, moyen],
    queryFn: async ({ queryKey }) => {
      return VehicleApi.getVehicle(queryKey[1], queryKey[2], queryKey[3], queryKey[4])
    },
    onSuccess: (data) => {

      queryClient.setQueriesData(["getVehicle"], (dataService) => {
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
    if (typeof (searchTerm) === 'string' || typeof (moyen) !== 'undefined') {
      refetch()
    }
    return () => {
      debouncedResults.cancel();
    };
  }, [searchTerm, moyen]);


  return (
    <RenderIf allowedTo={Permissions.VIEW_VEHICLES_LIST}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray" >
              {total} Vehicule(s)
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
              <div className="flex items-center gap-[20px]">
                <div class='max-w-md z-20'>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOptions}
                    isMulti={true}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        minHeight: 40,
                        width: 300,
                        fontSize: 13,
                        fontWeight: "300",
                        color: "red",
                        zIndex: 100
                      }),
                    }}
                    placeholder="Filtrer par transport"
                    onChange={(val) => { (val.length > 0) ? setMoyen(val.map((val) => { return val.value })) : setMoyen(null) }}
                  />
                </div>
                {isAllowedTo(Permissions.ADD_VEHICLE) &&
                  <button
                    className="h-11 px-[15px] rounded-[5px] flex items-center justify-center bg-[#0F123E] text-white"
                    onClick={() => navigate('new')}
                  >
                    Ajouter
                    <AiOutlinePlusCircle
                      className="text-[20px] ml-3"
                    />
                  </button>
                }
              </div>
            </div>
            <div className="flex-1 w-full">
              <DataGridComponent
                hidePagination={false}
                columns={vehicleColumns}
                queryFirstKey={"getVehicle"}
                fnQuery={async ({ queryKey }) => {
                  return VehicleApi.getVehicle(queryKey[1], queryKey[2], searchTerm, moyen)
                }
                }
                idpri="idVehicule"
                handleTotal={updateTotal}
                loadSup={
                  typeof (searchTerm) == 'string' || typeof (moyen) !== 'undefined' ? isLoading : false
                }
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default VehiculeListe;