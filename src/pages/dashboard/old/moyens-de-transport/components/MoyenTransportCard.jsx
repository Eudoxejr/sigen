import { Permissions } from '@/data/role-access-data';
import { isAllowedTo, shorten } from '@/utils';
import { Typography } from '@material-tailwind/react';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';

const MoyenTransportCard = ({
  item,
  className,
  onViewDetails,
  ...props
}) => {
  return (
    <div className={`flex items-center justify-center p-2 ${className ?? ''}`}>
      <div className="flex flex-col w-full bg-white shadow-[0px_0px_10px_0px_#0002] rounded-[15px] overflow-hidden p-[15px]">
        <img
          src={item?.illustrationPic}
          alt={item?.title}
          className="h-[120px] w-[120px] border-[3px] border-[#0F123E55] p-1 rounded-full object-cover self-center mb-[15px]"
        />
        <h5 className="text-black font-bold">
          {item?.title}
        </h5>
        <Typography
          variant="small"
          className={"font-normal text-[12px] text-blue-gray-500 " + (item?.isAccessible ? "text-green-500" : " text-red-400")}
        >
          {item?.isAccessible ? "Disponible" : "Indisponible"}
        </Typography>
        <span className="font-normal text-blue-gray-500 text-[11px]" >{item?._count.drivers + ' Conducteurs'}</span>
        <div
          className={`py-2 h-[70px] border-t-[1px] ${isAllowedTo(Permissions.VIEW_A_TRANSPORT_MEAN_DETAILS) ? 'my-3 border-b-[1px]' : 'mt-3 border-b-[0px]'}  border-[#E7E7E7]`}
        >
          <p
            className="font-normal leading-[25px] text-[12px]"
          >{shorten(item?.transportMoyenDescription ?? "Aucune description", 100)}</p>
        </div>
        {isAllowedTo(Permissions.VIEW_A_TRANSPORT_MEAN_DETAILS) &&
          <button
            className="h-[42px] px-[15px] rounded-[5px] flex items-center justify-between bg-[#0F123E] text-white text-[14px]"
            onClick={() => onViewDetails(item)}
          >
            Voir plus de détails
            <BsChevronRight size={15} />
          </button>
        }
      </div>
    </div>
  );
};

MoyenTransportCard.defaultProps = {
  onViewDetails: () => { },
};

export default MoyenTransportCard;