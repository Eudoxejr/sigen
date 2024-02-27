import React from 'react';
import { BsTrash3 } from 'react-icons/bs';

const FaqCard = ({
  data,
  className,
  onDelete,
  deletable,
  ...props
}) => {
  return (
    <div className={`bg-white shadow-[0px_0px_10px_0px_#0002] rounded-[8px] p-[15px] relative text-black ${className ?? ''}`} {...props}>
      <h4 className="text-[#0F123E] font-bold text-[16px] w-[80%]">{data?.quiz ?? "-"}</h4>
      <p className="w-full text-[14px] leading-[28px] mt-[15px]">{data?.answer ?? "-"}</p>
      {deletable &&
        <BsTrash3
          color="#D95A4C" size={17}
          onClick={() => typeof onDelete === 'function' && onDelete(data?.id)}
          className="absolute right-[15px] top-[15px] cursor-pointer"
        />
      }
    </div>
  );
};

export default FaqCard;