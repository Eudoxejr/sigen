import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import DataGridComponent from '@/components/common/datatable';
import { rolesColumns } from '@/utils/columsDatatable';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
// import { produce } from "immer"
// import { RenderIf } from '@/components/common';
// import { Permissions } from '@/data/role-access-data';
// import { isAllowedTo } from '@/utils';
import { RoleApi } from '@/api/api';

const RolesListe = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const rolesMeta = queryClient.getQueriesData(["getRoles"])?.[0]?.[1]?.meta

  const [searchTerm, setSearchTerm] = useState(null);

  const [pagination, setPagination] = useState({
    page: 0, 
    pageSize: 25
  })
  const [total, setTotal] = useState(0);


  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);


  return (
    // <RenderIf allowedTo={Permissions.VIEW_ROLES_LIST}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>

          <CardBody className="md:h-[calc(100vh-125px)] shadow-none flex flex-col px-4 pt-0 pb-4 gap-[15px] overflow-auto">
              
            <Typography variant="h6" color="blue-gray " >
              Roles ({rolesMeta?.total || total})
            </Typography>

            <div className=" w-full mb-2 flex justify-between items-center flex-wrap gap-y-3 " >
              <button 
                onClick={() => navigate("add")}
                class=' bg-primary text-white px-4 py-2 rounded-md text-[13px] font-semibold '
              >
                Ajouter un rôle
              </button>

              <div class='w-[270px]'>

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

            </div>

            <div className="flex-1 w-full">
              <DataGridComponent
                idpri="id"
                hidePagination={false}
                hideHeader={false}
                columns={rolesColumns}
                queryKey={[
                  "getRoles", 
                  pagination.page+1,
                  pagination.pageSize,
                  searchTerm
                ]}
                fnQuery={({ queryKey }) => RoleApi.getRole(queryKey[1], queryKey[2], queryKey[3] )}
                noRow={"Pas de role trouvé"}
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

export default RolesListe;