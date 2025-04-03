import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading, AiOutlinePlusCircle } from 'react-icons/ai';
import { Pagination } from '@mui/material';
import { PromoCard } from './components';
import { useDebounce } from '@/hooks/useDebounce';
import { PromosApi } from '@/api/api';
import { RenderIf } from '@/components/common';
import { Permissions } from '@/data/role-access-data';
import { isAllowedTo } from '@/utils';

const PromosListe = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [meta, setMeta] = useState({
    currentPage: 1,
    perPage: 15,
    total: 0,
    totalPage: 0
  });

  const [loading, setLoading] = useState(false);

  const [promoCodes, setPromoCodes] = useState([]);

  const handleFetchData = async (forPage = meta?.currentPage, perPage = meta?.perPage, keywords = searchTerm) => {
    setLoading(true);
    await PromosApi.fetchAllCodes(forPage, perPage, keywords)
      .then(({ data: response }) => {
        if (response?.success) {
          setPromoCodes(Array.isArray(response?.data) ? response?.data : []);
          setMeta(old => ({
            ...old,
            currentPage: response?.meta?.currentPage,
            perPage: response?.meta?.perPage,
            total: response?.meta?.total,
            totalPage: response?.meta?.totalPage
          }));
        } else {
          setPromoCodes([]);
          setMeta({ currentPage: 1, perPage: 15, total: 0, totalPage: 0 });
        }
      })
      .catch(err => {
        setPromoCodes([]);
        setMeta({ currentPage: 1, perPage: 15, total: 0, totalPage: 0 });
      })
      .finally(() => setLoading(false));
  };

  useDebounce(
    () => handleFetchData(),
    300,
    [meta?.currentPage, searchTerm]
  );

  const viewPromoDetails = (item) => navigate(`./${item?.id}`, { state: { promoCode: item } });

  return (
    <RenderIf allowedTo={Permissions.VIEW_PROMO_CODES_LIST}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray" >
              Codes Promos
            </Typography>
          </CardHeader>
          <CardBody className="md:h-[calc(100vh-220px)] shadow-none flex flex-col px-4 pt-0 pb-4 gap-[15px]">
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
                  value={searchTerm}
                  onChange={e => setSearchTerm(e?.target?.value)}
                />
              </div>
              {isAllowedTo(Permissions.ADD_PROMO_CODE) &&
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
              {loading && <AiOutlineLoading className="animate-spin absolute left-[20px]" size={20} />}
            </div>
            <div className="flex-1 w-full overflow-y-auto pb-[50px]">
              {Array.isArray(promoCodes) && promoCodes?.length > 0 ?
                <div className="w-full grid grid-cols-1 gap-[15px] md:grid-cols-2 xl:grid-cols-5">
                  {promoCodes?.map((el, key) => (
                    <PromoCard
                      key={el?.id}
                      promoData={el}
                      onViewDetails={isAllowedTo(Permissions.VIEW_A_PROMO_CODE_DETAILS) ? viewPromoDetails : null}
                    />
                  ))}
                </div>
                :
                "Aucune donnée"
              }
            </div>
            <Pagination
              variant="outlined" color='primary' size="small"
              count={meta?.totalPage}
              onChange={(_, value) => setMeta(old => ({ ...old, currentPage: value }))}
              className="self-center"
            />
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default PromosListe;