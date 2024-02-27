import React, { useState, useEffect, useMemo } from "react";
import { produce } from "immer"
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import DataGridComponent from "@/components/common/datatable";
import { columnDriver } from "@/utils/columsDatatable";
import { DriverApi, MoyenApi } from "@/api/api";
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Select from 'react-select'
import { RenderIf } from "@/components/common";
import { Permissions } from "@/data/role-access-data";


export function Drivers() {

  const [total, setTotal] = React.useState(0);
  const updateTotal = (ttal) => {
    setTotal(ttal);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [moyen, setMoyen] = useState();
  const [pieceStatus, setPieceStatus] = useState();

  const queryClient = useQueryClient();


  const getMoyen = async (inputValue) => {
    const res = await MoyenApi.getMoyen(1, 8, inputValue)
    //   console.log(res);
    res.data.unshift({ idTransportMoyen: null, title: 'Tout les moyens de transport' })
    return res.data.map((data) => { return { label: data.title, value: data.idTransportMoyen } })
  };

  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(getMoyen(inputValue))
    }
  );

  const { isLoading, refetch } = useQuery({

    queryKey: ["getDriverFiltre", 1, 25, searchTerm, moyen, pieceStatus ],
    queryFn: async ({ queryKey }) => {
      return DriverApi.getDriver(queryKey[1], queryKey[2], ["DRIVER"], queryKey[3], queryKey[4], null, queryKey[5])
    },     
    onSuccess: (data) => {

    queryClient.setQueriesData(["getDriver"], (dataService) => {
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

    if( typeof(searchTerm) === 'string' || typeof(moyen) !== 'undefined' )
    {
      refetch()
    }

    return () => {
      debouncedResults.cancel();
    };

  }, [searchTerm, moyen, pieceStatus]);


  return (
    <RenderIf allowedTo={Permissions.VIEW_DRIVERS_LIST}>
      <div className="mt-12 mb-2 flex-1 w-full flex flex-col">

        <Card className=" md:h-[calc(100vh-150px)] " >

          <CardHeader variant="gradient" className="mb-8 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center ">

            <Typography variant="h6" color="blue-gray" >
              {total} Driver(s)
            </Typography>

            {/* <Button 
              className="text-[11px] bg-blue-gray-600" 
              onClick={() => dispatch({
                type: "setDialog",
                value: {
                  active: true,
                  view: "createprestataire",
                  size: "md"
                }
              })}
            >
              Créer prestataire
            </Button> */}

          </CardHeader>

          <CardBody className="md:h-[calc(100%-70px-16px)] shadow-none flex flex-col px-4 pt-0 pb-0">

            <div className=" w-full mb-2 flex justify-between items-center flex-wrap gap-y-3 " >

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
                    placeholder="Recherche..."
                    onChange={debouncedResults}
                  />

                </div>

              </div>

              <div class='max-w-md'>
                    
                <Select  
                  defaultOptions 
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                        height: 42,
                        width: 260,
                        fontSize: 13,
                        fontWeight: "300",
                        color: "red",
                        zIndex: 100
                    }),
                  }}
                  options={
                    [
                      { value: null, label: 'Toutes les pièces' },
                      { value: 'CHECKING', label: 'Pièces en cours' },
                      { value: 'VALIDATED', label: 'Pièces validées' },
                      { value: 'REJECTED', label: 'Pièces rejetées' },
                      { value: 'EXPIRED', label: 'Pièces expirées' }
                    ]
                  }
                  placeholder="Filtrer par pièce"
                  onChange={(val) => {setPieceStatus(val.value)} } 
                />

              </div>

              <div class='max-w-md'>
                    
                <AsyncSelect 
                  cacheOptions 
                  defaultOptions 
                  loadOptions={loadOptions} 
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      height: 42,
                      width: 260,
                      fontSize: 13,
                      fontWeight: "300",
                      color: "red",
                      zIndex: 100
                    }),
                  }}
                  placeholder="Filtrer par transport"
                  onChange={(val) => { setMoyen(val.value) }}
                />

              </div>

            </div>

            <div className="md:h-[calc(100%-50px)]" >

              <DataGridComponent
                hidePagination={false}
                columns={columnDriver}
                queryFirstKey={"getDriver"}
                fnQuery={async ({ queryKey }) => {
                  return DriverApi.getDriver(queryKey[1], queryKey[2], ["DRIVER"], searchTerm, moyen)
                }
                }
                idpri={"idUser"}
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
}

export default Drivers;
