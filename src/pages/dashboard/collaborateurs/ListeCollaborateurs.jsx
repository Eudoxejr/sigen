import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import DataGridComponent from "@/components/common/datatable";
import { columnColaborateurs } from "@/utils/columsDatatable";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { CollaboApi, RoleApi } from "@/api/api";
import debounce from "lodash.debounce";
import { produce } from "immer";
import { useDialogueStore } from "@/store/dialogue.store";
// import { RenderIf } from '@/components/common';
// import { Permissions } from '@/data/role-access-data';
// import { isAllowedTo } from '@/utils';
import { useQueryClient } from "@tanstack/react-query";

const CollaborateursListe = () => {
  const navigate = useNavigate();
  const { setDialogue } = useDialogueStore();

  const queryClient = useQueryClient();
  const allQuery = queryClient.getQueriesData(["getCollabo"]);
  const collaboMeta = allQuery?.[allQuery.length - 1]?.[1]?.meta;

  const [searchTerm, setSearchTerm] = useState(collaboMeta?.keyword || null);
  const [pagination, setPagination] = useState({
    page: collaboMeta?.current_page - 1 || 0,
    pageSize: collaboMeta?.per_page || 25,
  });
  const [total, setTotal] = useState(0);
  const [role, setRole] = useState(null);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 600);
  }, []);

  const getRole = async (inputValue) => {
    const res = await RoleApi.getRole(1, 12, inputValue);
    // res.data.unshift({ id: null, role_name: 'Tout les roles' })
    return res.data.map((data) => {
      return { label: data.role_name, value: data.id };
    });
  };

  const loadRoleOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(getRole(inputValue));
    });

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  }, []);

  return (
    // <RenderIf allowedTo={Permissions.VIEW_ADMINS_LIST}>
    <div className="mt-6 flex w-full flex-1 flex-col">
      <Card>
        <CardBody className="flex flex-col gap-[15px] overflow-auto px-4 py-4 shadow-none md:h-[calc(100vh-125px)]">
          <Typography variant="h6" color="blue-gray">
            Collaborateurs ({collaboMeta?.total || total})
          </Typography>

          <div className=" mb-2 flex w-full flex-wrap items-center justify-between gap-y-3 ">
            <button
              onClick={() => {
                setDialogue({
                  size: "md",
                  open: true,
                  view: "create-collaborateur",
                  data: null,
                });
              }}
              class=" rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-white "
            >
              Nouveau Collaborateur
            </button>

            <div>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadRoleOptions}
                isMulti
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    minHeight: 42,
                    width: 250,
                    fontSize: 13,
                    fontWeight: "300",
                    color: "red",
                    zIndex: 100,
                  }),
                }}
                placeholder="Filtrer par role"
                onChange={(val) => {
                  val.length > 0
                    ? setRole(
                        val.map((item) => {
                          return item.value;
                        })
                      )
                    : setRole(null);
                }}
              />
            </div>

            <div class="w-[250px]">
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
                  defaultValue={searchTerm}
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

          <div className="w-full flex-1">
            <DataGridComponent
              idpri="id"
              hidePagination={false}
              hideHeader={true}
              columns={columnColaborateurs}
              queryKey={[
                "getCollabo",
                pagination.page + 1,
                pagination.pageSize,
                searchTerm,
                role,
                true,
              ]}
              fnQuery={({ queryKey }) =>
                CollaboApi.getCollabo(
                  queryKey[1],
                  queryKey[2],
                  queryKey[3],
                  queryKey[4],
                  queryKey[5]
                )
              }
              noRow={"Pas de collaborateur trouvé"}
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

export default CollaborateursListe;
