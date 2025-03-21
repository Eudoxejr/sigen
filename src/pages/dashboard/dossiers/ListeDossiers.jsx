import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import DataGridComponent from '@/components/common/datatable';
import { columnDossierForUser, columnDossier } from '@/utils/columsDatatable';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useLocation } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { FoldersApi, CategoriesApi } from '@/api/api';
import debounce from 'lodash.debounce';
import { produce } from "immer";
import { useDialogueStore } from '@/store/dialogue.store';
import {Avatar as AvatarMui} from '@mui/material';

import { useQueryClient } from "@tanstack/react-query";

const DossierListe = ({specificUser}) => {

  const navigate = useNavigate();
  const {state} = useLocation();
  const { setDialogue } = useDialogueStore()
  const queryClient = useQueryClient();

  const clientMeta = queryClient.getQueriesData(["getDossier"])?.[0]?.[1]?.meta


  const [searchTerm, setSearchTerm] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0, 
    pageSize: 25
  })
  const [total, setTotal] = useState(0);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getCat = async (inputValue) => {
    const res = await CategoriesApi.getCategories(1, 10, inputValue)
    return res.data.map((data) => { return { label: data.category_name, value: data.id, other: data } })
  };

  const loadOptionsCategorie = (inputValue) =>
    new Promise((resolve) => {
      resolve(getCat(inputValue))
    })

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 600);
  }, []);

  const [categorie, setCategorie] = useState(null);

  return (
    // <RenderIf allowedTo={Permissions.VIEW_ADMINS_LIST}>
      <div className="mt-6 flex-1 w-full flex flex-col">
        <Card>
            <CardBody className="md:h-[calc(100vh-125px)] shadow-none flex flex-col px-4 pt-0 pb-4 gap-[15px] overflow-auto">
              
              <div className="flex items-center" >
                {specificUser &&
                  <Tooltip content="Retour">
                    <button onClick={() => navigate(-1)} className=" bg-primary mb-2 w-[40px] h-[40px] mr-4 rounded-full flex justify-center items-center" >
                      <AiOutlineArrowLeft className=' text-white ' size={16} />
                    </button>
                  </Tooltip>
                }
                <Typography variant="h6" color="blue-gray" >
                  DOSSIERS ({clientMeta?.total || total})
                </Typography>
              </div>
                
              <div className=" w-full mb-2 flex justify-between items-center flex-wrap gap-y-3 " >

                {specificUser ?
                    <div className=" w-[320px] h-[90px] flex flex-col justify-center px-3 border-1 border-gray-800 bg-gray-100 rounded-md " >
                      <span className=" text-[13px] " >Client</span>
                      <div className="flex items-center gap-3 py-1">
                        <AvatarMui >
                        </AvatarMui>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold text-[13.5px] "
                        >
                          {state.civility == "Structure" ? state?.denomination : state?.firstname + " " + state?.lastname}
                        </Typography>
                      </div>

                    </div>

                :
                  <button 
                    onClick={() => navigate("add")}
                    class=' bg-primary text-white px-4 py-2 rounded-md text-[13px] font-semibold '
                  >
                    Nouveau Dossier
                  </button>
                }

                <div>

                  <AsyncSelect 
                    cacheOptions 
                    defaultOptions 
                    loadOptions={loadOptionsCategorie} 
                    isMulti
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        minHeight: 42,
                        width: 250,
                        fontSize: 13,
                        fontWeight: "300",
                        color: "red",
                        zIndex: 100
                      }),
                    }}
                    placeholder="Filtrer par catégorie"
                    onChange={(val) => { val.length > 0 ? setCategorie(val.map((item) => {return item.value})) : setCategorie(null) } }
                  />

                </div>

                <div class='w-[250px]'>

                  <div className="relative flex items-center w-full h-[42px] rounded-lg focus-within:shadow-md bg-blue-gray-800 overflow-hidden">

                    <div className="grid place-items-center h-full w-12 text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    <input
                      className="peer bg-blue-gray-800 h-full w-full outline-none text-[12.5px] text-white pr-2"
                      type="search"
                      id="search"
                      placeholder="Recherche..."
                      onChange={debouncedResults}
                    />

                  </div>

                </div>

                {/* <div class='max-w-md'>
                      
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

                </div> */}

              </div>

              <div className="flex-1 w-full">
                <DataGridComponent
                  idpri="id"
                  hidePagination={false}
                  hideHeader={specificUser}
                  columns={specificUser ? columnDossierForUser : columnDossier}
                  queryKey={[
                    "getDossier", 
                    pagination.page+1,
                    pagination.pageSize,
                    searchTerm,
                    categorie,
                    null,
                    state?.id
                  ]}
                  fnQuery={({ queryKey }) => FoldersApi.getFolders(queryKey[1], queryKey[2], queryKey[3], queryKey[4], queryKey[5], queryKey[6] )}
                  noRow={"Pas de dossier trouvé"}
                  onRowClick={(params) => {
                    specificUser ?
                      navigate(`../../dossiers/view`, { state: params.row })
                    :
                      navigate(`../dossiers/view`, { state: params.row })
                  }}
                  totalInformation={{total, setTotal}}
                  paginationInformation={{pagination, setPagination}}
                />
              </div>
            </CardBody>
        </Card>
      </div>
    // </RenderIf>
  );
};

export default DossierListe;