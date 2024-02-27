import styled from '@emotion/styled';
import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { MdZoomOutMap } from 'react-icons/md';


/**
 * paperData {
 *    title: string;
 *    url: string;
 *    status: string | enum;
 *    reason: string;
 * }
 */
const RejectedPaper = ({
  paperData,
  onViewMore,
  className,
  placeholder,
  ...props
}) => {

  return (
    <VehiclePaper className={`active ${className ?? ''}`}>
      <div className="px-3 py-[5px] bg-white rounded-[7px] text-[#D95A4C] font-bold flex items-center justify-between">
      {paperData?.attachement?.title || paperData?.title }
      </div>
      <div
        className="w-full flex flex-col items-center justify-start relative"
      >
        <button
          className="flex w-full items-center justify-center h-[70px]"
          onClick={onViewMore}
        >
          <MdZoomOutMap className="mr-2" size={15} />
          {placeholder ? placeholder : "Cliquer ici pour voir la pièce"}
        </button>
        <div className="reason-label self-start flex flex-col">
          <span className="font-bold">
            Reason
          </span>
          {paperData?.rejectionComment}
        </div>
      </div>
      <button className="reject-btn">
        Pièce rejetée
        <IoWarningOutline size={20} className="check" />
      </button>
    </VehiclePaper>
  );
};

RejectedPaper.defaultProps = {
  paperData: null,
  onViewMore: () => { },
};

export default RejectedPaper;

const VehiclePaper = styled.div`
  width: 380px;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  color: black;
  border: 2px solid #D95A4C;
  transition: all 0.2s ease-in-out;
  .check {
    margin-left: 10px;
    color: white;
  }
  .reject-btn {
    height: 35px;
    width: 100%;
    background: #D95A4C;
    color: white;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .preview {
    width: 70px;
    height: 100px;
    object-fit: cover;
    border-radius: 7px;
  }
  .reason-label {
    font-size: 11px;
  }
`;