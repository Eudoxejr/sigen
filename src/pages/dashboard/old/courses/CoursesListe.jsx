import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import Select from 'react-select'
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from './components';
import { CourseApi } from "@/api/api";
import debounce from 'lodash.debounce';
import { useQuery } from "@tanstack/react-query";
import { RenderIf } from "@/components/common";
import { Permissions } from "@/data/role-access-data";

const CoursesListe = () => {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState();
  const [type, setType] = useState();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 25
  })


  const { isLoading, refetch, data: courseList } = useQuery({

    queryKey: ["getCourse", pagination.page, pagination.pageSize, searchTerm, type],
    queryFn: async ({ queryKey }) => {
      return CourseApi.getCourse(queryKey[1], queryKey[2], queryKey[3], queryKey[4])
    },
    onSuccess: (data) => {
      // console.log(data);
    },
    enabled: true,
    staleTime: 5 * 60 * 1000

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

  const options = [
    { value: null, label: 'Tout' },
    { value: 'SENT', label: 'En Attente' },
    { value: 'ACCEPTED', label: 'Accepté' },
    { value: 'CANCELED', label: 'Annulé' },
    { value: 'EXPIRED', label: 'Expiré' },
    { value: 'ATPLACE', label: 'Sur Place' },
    { value: 'INPROGRESS', label: 'En cours' },
    { value: 'ENDED', label: 'Fini' },
    { value: 'VALIDATED', label: 'Validé' }
  ]

  const viewCourseDetails = (item) => navigate(`./${item}`);

  return (
    <RenderIf allowedTo={Permissions.VIEW_TRIPS_LIST}>
      <div className="mt-12 flex-1 w-full flex flex-col">

        <Card>

          <CardHeader variant="gradient" className="mb-4 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray" >
              {courseList?.meta?.total || 0}  Course(s)
            </Typography>
          </CardHeader>

          <CardBody className="md:h-[calc(100vh-220px)] shadow-none flex flex-col px-4 pt-0 pb-4 gap-[15px]">
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
                  onChange={(val) => { val.value ? setType([val.value]) : setType(null) }}
                />
              </div>
            </div>

            {!isLoading ?

              courseList?.data?.length > 0 ?

                <>
                  <div className="flex-1 w-full flex flex-wrap overflow-y-auto">
                    {courseList?.data?.map((item, key) => (
                      <CourseCard
                        key={key}
                        courseData={item}
                        onViewDetails={() => viewCourseDetails(item.idReservation)}
                        className="w-1/4"
                      />
                    ))}
                  </div>
                  <Pagination count={courseList?.meta?.totalPage || 1} onChange={(_, value) => setPagination({ ...pagination, page: value })} variant="outlined" color='primary' size="small" />

                </>

                :

                <div className=" w-full h-full flex flex-col justify-center items-center" >
                  <span>Pas de course disponible</span>
                </div>

              :

              <div className="md:h-[calc(100%-50px)] animate-pulse overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded scrollbar-thumb-gray-900 scrollbar-track-gray-100 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4 " >
                {Array.from(Array(6).keys()).map((_, key) => (
                  <div key={key} className="border-[1px] border-[#E2E2E2] rounded-[10px] h-[250px] bg-gray-200  dark:bg-gray-700 max-w-full mb-2.5" />
                ))}
              </div>

            }

          </CardBody>

        </Card>
      </div>
    </RenderIf>
  );
};

export default CoursesListe;