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
import { RolesApi } from '@/api/api';
import debounce from 'lodash.debounce';
import { produce } from "immer"
import { RenderIf } from '@/components/common';
import { Permissions } from '@/data/role-access-data';
import { isAllowedTo } from '@/utils';

const RolesListe = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState(null);

  const [total, setTotal] = useState(0);

  const { isLoading, refetch } = useQuery({
    queryKey: ["getFilteredRolesList", 1, 25, searchTerm],
    queryFn: async ({ queryKey }) => {
      return RolesApi.fetchAllRoles(queryKey[1], queryKey[2], queryKey[3]);
    },
    onSuccess: (data) => {
      queryClient.setQueriesData(["getRoles"], (dataUser) => {
        const nextData = produce(dataUser, draftData => {
          draftData.data = data.data
          draftData.meta = data.meta
        })
        return nextData;
      });
    },
    enabled: false,
    staleTime: 0
  });

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);


  useEffect(() => {
    if (typeof searchTerm === 'string') {
      refetch()
    }

    return () => {
      debouncedResults.cancel();
    }
  }, [searchTerm]);

  return (
    <RenderIf allowedTo={Permissions.VIEW_ROLES_LIST}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray" >
              {total} Rôle(s)
            </Typography>
          </CardHeader>
          <CardBody className="md:h-[calc(100vh-220px)] shadow-none flex flex-col px-4 pt-0 pb-4 gap-[15px] overflow-auto">
            <div className="w-full flex justify-center items-center gap-[10px] text-[14px]">
              <div className="w-[400px] relative flex items-center h-[42px] rounded-[5px] border-[#0F123E] border-[2px] focus-within:shadow-md bg-[#0F123E] overflow-hidden">
                <div className="grid place-items-center h-full w-12 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  className="peer bg-[#0F123E] h-full w-full outline-none text-white pr-2"
                  type="text"
                  id="search"
                  placeholder="Rechercher..."
                  onChange={debouncedResults}
                />
              </div>
              {isAllowedTo(Permissions.ADD_ROLE) &&
                <button
                  className="h-[42px] px-[15px] rounded-[5px] flex items-center justify-center border-[#0F123E] border-[2px] text-[#0F123E]"
                  onClick={() => navigate('new')}
                >
                  Ajouter
                  <AiOutlinePlusCircle
                    className="text-[20px] ml-3"
                  />
                </button>
              }
            </div>
            <div className="flex-1 w-full">
              <DataGridComponent
                idpri="id"
                hidePagination={false}
                columns={rolesColumns}
                fnQuery={({ queryKey }) => RolesApi.fetchAllRoles(queryKey[1], queryKey[2], queryKey[3])}
                handleTotal={setTotal}
                queryFirstKey="getRoles"
                loadSup={typeof searchTerm === 'string' ? isLoading : false}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default RolesListe;