import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import DataGridComponent from "@/components/common/datatable";
import { rolesColumns } from "@/utils/columsDatatable";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
// import { produce } from "immer"
// import { RenderIf } from '@/components/common/render.if';
// import { Permissions } from '@/data/role-access-data';
// import { isAllowedTo } from '@/utils';
import { RolesApi } from "@/api/api";

const RolesListe = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const rolesMeta = queryClient.getQueriesData(["getRoles"])?.[0]?.[1]?.meta;

  const [searchTerm, setSearchTerm] = useState(null);

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 25,
  });
  const [total, setTotal] = useState(0);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  return (
    // <RenderIf allowedTo={Permissions.VIEW_ROLES_LIST}>
    <div className="mt-12 flex w-full flex-1 flex-col">
      <Card>
        <CardBody className="flex flex-col gap-[15px] overflow-auto px-4 pt-0 pb-4 shadow-none md:h-[calc(100vh-125px)]">
          <Typography variant="h6" color="blue-gray ">
            Roles ({rolesMeta?.total || total})
          </Typography>

          <div className=" mb-2 flex w-full flex-wrap items-center justify-between gap-y-3 ">
            <button
              onClick={() => navigate("add")}
              class=" rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white "
            >
              Ajouter un rôle
            </button>

            <div class="w-[270px]">
              <div className="relative flex h-[42px] w-full items-center overflow-hidden rounded-lg bg-blue-gray-800 focus-within:shadow-md">
                <div className="grid h-full w-12 place-items-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  className="peer h-full w-full bg-blue-gray-800 pr-2 text-[12.5px] text-white outline-none"
                  type="search"
                  id="search"
                  placeholder="Recherche..."
                  onChange={debouncedResults}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex-1">
            <DataGridComponent
              idpri="id"
              hidePagination={false}
              hideHeader={false}
              columns={rolesColumns}
              queryKey={[
                "getRoles",
                pagination.page + 1,
                pagination.pageSize,
                searchTerm,
                true,
              ]}
              fnQuery={({ queryKey }) =>
                RolesApi.getRole(
                  queryKey[1],
                  queryKey[2],
                  queryKey[3],
                  queryKey[4]
                )
              }
              noRow={"Pas de role trouvé"}
              // onRowClick={(params) => {
              //   specificUser ?
              //     navigate(`../../dossiers/view`, { state: params.row })
              //   :
              //     navigate(`../dossiers/view`, { state: params.row })
              // }}
              totalInformation={{ total, setTotal }}
              paginationInformation={{ pagination, setPagination }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
    // </RenderIf>
  );
};

export default RolesListe;
