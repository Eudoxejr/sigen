import React from 'react';
import dummyMapImg from '/img/dummy-map.svg';
import carImg from '/img/car.svg';
import { IoMdTime } from 'react-icons/io';
import dayjs from 'dayjs';
import { isAllowedTo } from '@/utils';
import { Permissions } from '@/data/role-access-data';

const CourseCard = ({
  courseData,
  onViewDetails,
  className,
  ...props
}) => {

  const makeStatusButton = (status) => {
    switch (status) {
      case "SENT":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-[#545454] text-[13px] flex items-center justify-center`}
          >En attente</div>
        );
      case "ATPLACE":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-black text-[13px] flex items-center justify-center`}
          >Sur Place</div>
        );
      case "ACCEPTED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-[#957FCE] text-[13px] flex items-center justify-center`}
          >Accepté</div>
        );
      case "INPROGRESS":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-[#ED6E33] text-[13px] flex items-center justify-center`}
          >En cours</div>
        );
      case "ENDED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-[#2B6B46] text-[13px] flex items-center justify-center`}
          >Terminé</div>
        );
      case "VALIDATED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-green-500 text-[13px] flex items-center justify-center`}
          >Validé</div>
        );
      case "EXPIRED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-[#D95A4C] text-[13px] flex items-center justify-center`}
          >Expiré</div>
        );
      case "CANCELED":
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-red-500 text-[13px] flex items-center justify-center`}
          >Annulé</div>
        );
      default:
        return (
          <div
            className={`rounded-[6px] h-[30px] px-[20px] text-white bg-[#EEEEEE] text-[13px] flex items-center justify-center`}
          >En attente</div>
        );
    }
  };

  const makeDetailsButton = (status) => {
    switch (status) {
      case "SENT": case "VALIDATED": case "ENDED":
        return (
          <button
            className={`rounded-[4px] h-[30px] px-[15px] text-white bg-[#050C4D] text-[13px] flex items-center justify-center absolute top-[15px] right-[15px]`}
            onClick={onViewDetails}
          >Voir le trajet</button>
        );
      case "ACCEPTED": case "ATPLACE": case "INPROGRESS":
        return (
          <button
            className={`rounded-[4px] h-[30px] px-[15px] text-white bg-[#407BFF] text-[13px] flex items-center justify-center absolute top-[15px] right-[15px]`}
            onClick={onViewDetails}
          >Suivre l'itinéraire</button>
        );
      default:
        return (
          <button
            className={`rounded-[4px] h-[30px] px-[15px] text-[#050C4D] border-[1px] border-[#050C4D] text-[13px] flex items-center justify-center absolute top-[15px] right-[15px]`}
            onClick={onViewDetails}
          >Détails</button>
        );;
    }
  };

  return (
    <div className={`p-2 flex items-center justify-center ${className ?? ''}`}>
      <div
        className="border-[1px] border-[#E2E2E2] rounded-[10px] flex flex-col overflow-hidden"
        {...props}
      >
        <div className="h-[130px] w-full relative flex">
          <img
            src={dummyMapImg}
            alt="Dummy Map"
            className="object-cover w-full h-full absolute"
          />
          <div
            className={`w-full h-full flex flex-col items-start justify-between p-[20px] z-10`}
            style={{ background: `#000${[3, 4].includes(courseData?.status) ? '5' : '1'}` }}
          >
            {makeStatusButton(courseData?.statusReservation)}
            <div
              className={`rounded-[6px] h-[35px] px-[10px] bg-white text-[13px] flex items-center gap-[5px]`}
            >
              <IoMdTime size={20} />
              <span>{dayjs(courseData.createdAt).format('DD MMM YY HH:mm')}</span>
              <div className="h-[5px] w-[5px] bg-[#757575] rounded-full" />
              {/* <span className="text-[#757575]">{courseData.class.className}</span> */}
            </div>
          </div>
        </div>
        <div className="w-full border-t-[1px] border-[#E2E2E2] p-[20px] flex items-center gap-[20px] relative">
          <img
            src={carImg}
            alt="car"
            className="object-contain w-[60px]"
          />
          <div className="flex-1 flex flex-col items-start gap-[3px] text-[#757575] text-[13px]">
            <span className="text-black text-[18px] mb-2">{courseData.bills[0].total} €</span>
            <span>{courseData.placeDepartureAdresse}</span>
            <span>{courseData.placeArrivalAdresse}</span>
          </div>
          {isAllowedTo(Permissions.VIEW_A_TRIP_DETAILS) && makeDetailsButton(courseData?.statusReservation)}
        </div>
      </div>
    </div>
  );
};

CourseCard.defaultProps = {
  courseData: { status: "SENT" },
  onViewDetails: () => console.log("Method is not provided to [CourseCard]")
};

export default CourseCard;