import React, { useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import carImg from '/img/car.svg';
import fromLocIcon from '/img/from-location.svg';
import toLocIcon from '/img/to-location.svg';
// import ReactMapGL, {Marker, NavigationControl } from 'react-map-gl';
// import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirection from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { IoMdLocate } from "react-icons/io";
import { Rating } from '@mui/material';
import userImg from '/img/team-2.jpeg';
import { ChatView } from './components';
import { CourseApi } from '@/api/api';
import BeatLoader from "react-spinners/BeatLoader";
import { useQuery } from "@tanstack/react-query";
import dayjs from 'dayjs';
import { MdLocationPin } from "react-icons/md";
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';


const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

const DetailsCourse = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, refetch, data:details } = useQuery({
		queryKey: ["getDetailsCourse", id],
		queryFn: async ({ queryKey, }) => {
			return CourseApi.getSpecifiqCourse(queryKey[1], queryKey[2])
		},
		enabled: true,
	});


  const makeStatusButton = (status) => {
    switch (status) {
      case "SENT":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-[#545454] text-[13px] flex items-center justify-center`}
          >En attente</div>
        );
      case "ATPLACE":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-black text-[13px] flex items-center justify-center`}
          >Sur Place</div>
        );
      case "ACCEPTED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-[#957FCE] text-[13px] flex items-center justify-center`}
          >Accepté</div>
        );
      case "INPROGRESS":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-[#ED6E33] text-[13px] flex items-center justify-center`}
          >En cours</div>
        );
      case "ENDED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-[#2B6B46] text-[13px] flex items-center justify-center`}
          >Terminé</div>
        );
      case "VALIDATED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-green-500 text-[13px] flex items-center justify-center`}
          >Validé</div>
        );
      case "EXPIRED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-[#D95A4C] text-[13px] flex items-center justify-center`}
          >Expiré</div>
        );
      case "CANCELED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-red-500 text-[13px] flex items-center justify-center`}
          >Annulé</div>
        );
      default:
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] z-[9999] absolute top-[20px] right-[20px] text-white bg-[#EEEEEE] text-[13px] flex items-center justify-center`}
          >En attente</div>
        );
    }
  };


  // console.log(details?.data);
  // console.log(MAPBOX_ACCESS_TOKEN);

  const mapContainer = useRef(null);

  useEffect(() => {

    const map = new mapboxgl.Map({
      accessToken: MAPBOX_ACCESS_TOKEN,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [`${parseFloat(details?.data?.placeDepartureLongitude) || 0}`, `${parseFloat(details?.data?.placeDepartureLatitude) || 0}`],
      zoom: 14,

    });

    const directions = new MapboxDirection({
      accessToken: MAPBOX_ACCESS_TOKEN,
      unit: "metric",
      profile: "mapbox/driving",
      alternatives: true,
      geometries: false,
      controls: { instructions: true, inputs: false },
      flyTo: true,
      interactive: false
    });


    map.addControl(directions, "top-left");
    map.scrollZoom.enable()

    map.on('load', function () {
      directions.setOrigin([`${parseFloat(details?.data?.placeDepartureLongitude) || 0}`, `${parseFloat(details?.data?.placeDepartureLatitude) || 0}`]); // can be address in form setOrigin("12, Elm Street, NY")
      directions.setDestination([`${parseFloat(details?.data?.placeArrivalLongitude) || 0}`, `${parseFloat(details?.data?.placeArrivalLatitude) || 0}`]); // can be address
    })

    // new mapboxgl.Marker()
    // .setLngLat([`${parseFloat(details?.data?.placeDepartureLongitude)}`, `${parseFloat(details?.data?.placeDepartureLatitude)}`])
    // .addTo(map);

    // // Create a default Marker, colored black, rotated 45 degrees.
    // new mapboxgl.Marker({ color: 'black', rotation: 45 })
    // .setLngLat([`${parseFloat(details?.data?.placeArrivalLongitude)}`, `${parseFloat(details?.data?.placeArrivalLatitude)}`])
    // .addTo(map);

  }, [details]);

  // console.log(details?.data);

  if (isLoading) {
    return <div className=" w-full h-screen flex justify-center items-center " >
      <BeatLoader color="grey" size={8} />
      <div ref={mapContainer} className="map-container" />
    </div>
  }

  return (
    <RenderIf allowedTo={Permissions.VIEW_A_TRIP_DETAILS}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">
            <div className='flex items-center' >
              <Tooltip content="Retour">
                <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                  <AiOutlineArrowLeft color='white' size={18} />
                </button>
              </Tooltip>
              <Typography variant="h6" color="blue-gray">
                Informations de la course
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-4 pt-3 md:h-[calc(100vh-210px)] shadow-none">
            <div className="w-full h-full flex items-center gap-[30px]">
              <div className="w-[40%] h-full overflow-hidden flex flex-col gap-[15px] relative">

                {makeStatusButton(details?.data?.statusReservation)}
                <div
                  className={`rounded-[6px] h-[30px] px-[20px] text-white bg-[#ED6E33] text-[13px] flex items-center justify-center absolute top-[20px] right-[20px]`}
                >En cours</div>

                <RenderIf
                  allowedTo={Permissions.VIEW_A_TRIP_ROUTING}
                  placeholder={
                    <div className="w-full flex-1 rounded-[10px] bg-[#0F123E20] overflow-hidden flex items-center justify-center">
                      Vous n'êtes pas autorisé à suivre le trajet de cette course
                    </div>
                  }
                >
                  <div ref={mapContainer} className="w-full flex-1 map-container rounded-[10px] bg-[#0F123E20] overflow-hidden">
                    {/* <ReactMapGL
    <div className="mt-12 flex-1 w-full flex flex-col">
      <Card>
        <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">
          <div className='flex items-center' >
            <Tooltip content="Retour">
              <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                <AiOutlineArrowLeft color='white' size={18} />
              </button>
            </Tooltip>
            <Typography variant="h6" color="blue-gray">
              Informations de la course
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="p-4 pt-3 md:h-[calc(100vh-210px)] shadow-none">
          <div className="w-full h-full flex items-center gap-[30px]">
            <div className="w-[40%] h-full overflow-hidden flex flex-col gap-[15px] relative">
              
              {makeStatusButton(details?.data?.statusReservation)}
              
              <div ref={mapContainer} className="w-full flex-1 map-container rounded-[10px] bg-[#0F123E20] overflow-hidden">
                {/* <ReactMapGL
                  mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                  initialViewState={{
                    longitude: parseFloat(details.data.placeDepartureLongitude),
                    latitude:  parseFloat(details.data.placeDepartureLatitude),
                    zoom: 18 
                  }}
                  style={{ width: "100%", height: "100%" }}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                >
                  <NavigationControl className="navigation-control" showCompass={false} />
                  <Marker longitude={parseFloat(details?.data?.placeDepartureLongitude)} latitude={parseFloat(details?.data?.placeDepartureLatitude)} anchor="bottom" >
                    <IoMdLocate size={50} color='#407BFF' />
                  </Marker>
                  <Marker longitude={parseFloat(details?.data?.placeArrivalLongitude)} latitude={parseFloat(details?.data?.placeArrivalLatitude)} anchor="bottom" >
                    <MdLocationPin size={50} color='#407BFF'/>
                  </Marker>
                </ReactMapGL> */}
                  </div>
                </RenderIf>

                <div className="rounded-[10px] w-full flex items-center gap-[20px]">
                  <div
                    className="bg-[#407BFF] rounded-full w-[30px] py-[15px] flex flex-col items-center justify-center gap-[10px]"
                  >
                    <img
                      src={fromLocIcon}
                      alt="fromPin"
                      className="object-contain w-[20px] h-[20px]"
                    />
                    <div className="border-[1px] border-dashed border-white h-[30px]" />
                    <img
                      src={toLocIcon}
                      alt="toPin"
                      className="object-contain w-[20px] h-[20px]"
                    />
                  </div>
                  <div className="flex-1 h-[120px] border-[1px] border-[#0F123E55] rounded-[15px] flex flex-col items-start text-black text-[15px]">
                    <span className="h-1/2 w-full flex items-center px-[15px] border-b-[1px] border-[#0F123E55]">{details.data.placeDepartureAdresse}</span>
                    <span className="h-1/2 w-full flex items-center px-[15px]">{details.data.placeArrivalAdresse}</span>
                  </div>
                  <img
                    src={carImg}
                    alt="car"
                    className="object-contain w-[80px]"
                  />
                </div>
              </div>
              <div className="w-[60%] h-full overflow-y-auto flex">
                <div className="w-1/2 flex flex-col">
                  <div
                    className="w-full flex flex-col"
                  >
                    <div className="w-full flex items-center gap-[10px]">
                      <span className="text-[#0F123E] text-[17px] font-bold">Détails de la course</span>
                      <div className="h-[1px] bg-[#E8E8E8] flex-1" />
                    </div>
                    <div className="w-full flex flex-col text-[15px] gap-[10px] pt-2">
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Distance : </span>
                        <span>{details.data.bills?.[0]?.distanceInKm.toFixed(2)} Km</span>
                      </div>
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Durée du trajet : </span>
                        <span>{(details.data.bills?.[0]?.durationInSeconds / 60).toFixed(2)} min</span>
                      </div>
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Montant : </span>
                        <span className="font-bold">{details.data.bills?.[0]?.total} €</span>
                      </div>
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Classe : </span>
                        <span>{details.data?.class?.className}</span>
                      </div>
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Date de création : </span>
                        <span>{dayjs(details.data?.createdAt).format(" dddd, DD MMM YYYY à hh:mm ")}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-full flex flex-col mt-[40px]"
                  >
                    <div className="w-full flex items-center gap-[10px]">
                      <span className="text-[#0F123E] text-[17px] font-bold">Informations du client</span>
                      <div className="h-[1px] bg-[#E8E8E8] flex-1" />
                    </div>
                    <div className="w-full flex flex-col text-[15px] gap-[10px] pt-2">
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Nom & Prénoms : </span>
                        <span>{details.data?.reservationAuthor?.firstName + " " + details.data?.reservationAuthor?.lastName}</span>
                      </div>
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Code : </span>
                        <span>{details.data?.otpCode || "non définis"}</span>
                      </div>
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Email : </span>
                        <span>{details.data?.reservationAuthor?.email || "non définis"}</span>
                      </div>
                      <div className="w-full flex items-center gap-[5px]">
                        <span className="text-black">Téléphone : </span>
                        <span>{details.data?.reservationAuthor?.telephone || "non définis"}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-full flex flex-col mt-[40px]"
                  >

                    {details.data?.reservationDriver &&
                      <>
                        <div className="w-full flex items-center gap-[10px]">
                          <span className="text-[#0F123E] text-[17px] font-bold">Informations du transporteur</span>
                          <div className="h-[1px] bg-[#E8E8E8] flex-1" />
                        </div>
                        <div className="w-full flex flex-col text-[15px] gap-[10px] pt-2">
                          <div className="w-full flex items-center gap-[5px]">
                            <span className="text-black">Nom & Prénoms : </span>
                            <span>{details.data?.reservationDriver?.firstName + " " + details.data?.reservationDriver?.lastName}</span>
                          </div>
                          <div className="w-full flex items-center gap-[5px]">
                            <span className="text-black">Email : </span>
                            <span>{details.data?.reservationDriver?.email || "non défini"}</span>
                          </div>
                          <div className="w-full flex items-center gap-[5px]">
                            <span className="text-black">Téléphone : </span>
                            <span>{details.data?.reservationDriver?.telephone || "non défini"}</span>
                          </div>
                        </div>
                      </>
                    }
                  </div>
                </div>

                <div className="w-1/2 pl-[30px] pr-[10px] flex flex-col">
                  <h4 className="text-[#0F123E] font-bold text-[14px]">Avis sur le transporteur</h4>
                  {/* Hide this next block if no rating exists */}
                  {details.data?.rate &&
                    <div
                      className="w-full flex flex-col p-[20px] bg-white shadow-[0px_0px_10px_0px_#0002] rounded-[15px] mt-[10px]"
                    >
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-[10px]">
                          <img
                            src={details.data?.photoProfil || '/img/sigen/user128.png'}
                            alt="user"
                            className="h-[30px] w-[30px] rounded-full border-[2px] border-[#0F123E] bg-[#0F123E55]"
                          />
                          <span className="text-black text-[12px]">{details.data?.reservationAuthor?.firstName + " " + details.data?.reservationAuthor?.lastName}</span>
                        </div>
                        {/* <div className="flex items-center gap-[10px]">
                        {false ?
                          <BsArrowLeftCircleFill
                            size={20} color="#0F123E"
                            className="cursor-pointer"
                          />
                          :
                          <BsArrowLeftCircle size={20} color="#AAA" />
                        }
                        {true ?
                          <BsArrowRightCircleFill
                            size={20} color="#0F123E"
                            className="cursor-pointer"
                          />
                          :
                          <BsArrowRightCircle size={20} color="#AAA" />
                        }
                      </div> */}
                      </div>

                      <div className="mt-2 flex flex-col items-center gap-[10px]">
                        <Rating
                          name="simple-controlled"
                          value={details.data?.rate?.rateStars}
                          readOnly
                        />
                        <p
                          className="text-[12px] text-center leading-[20px]"
                        >
                          {details.data?.rate?.rateComment}
                        </p>
                      </div>
                    </div>
                  }
                  <div className="w-full h-full bg-white shadow-[0px_0px_10px_0px_#0002] rounded-[15px] mt-[15px] mb-[10px] overflow-hidden">
                    <RenderIf
                      allowedTo={Permissions.VIEW_A_TRIP_DISCUSSIONS}
                      placeholder={
                        <div className="h-full w-full flex items-center justify-center text-[14px]">
                          Vous n'êtes pas autorisé à voir les dicussions entre le client et le transporteur
                        </div>
                      }
                    >
                      <ChatView messages={details.data?.messages} />
                    </RenderIf>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default DetailsCourse;