import styled from '@emotion/styled';
import React from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdZoomOutMap } from 'react-icons/md';
import dayjs from 'dayjs';

/**
 * paperData {
 *    title: string;
 *    url: string;
 *    status: string | enum;
 *    expiry: string;
 * }
 */
const ValidPaper = ({
  paperData,
  onViewMore,
  className,
  placeholder,
  ...props
}) => {
  return (
    <VehiclePaper className={`active ${className ?? ''}`}>
      <div className="px-3 py-[5px] bg-white rounded-[7px] text-[#0F123E] font-bold flex items-center justify-between">
      {paperData?.attachement?.title || paperData?.title }
      </div>
      <div
        className="w-full flex items-center justify-start relative"
      >
        <button
          className="flex flex-1 items-center justify-center h-[100px]"
          onClick={onViewMore}
        >
          <MdZoomOutMap className="mr-2" size={15} />
          {placeholder ? placeholder : "Cliquer ici pour voir la pièce"}
        </button>
        <div className="expiry-label">Expire le : {dayjs(paperData?.ExpirationDate).format("DD/MM/YYYY")}</div>
      </div>
      <button className="validate-btn">
        Pièce validée
        <BsCheck2Circle size={20} className="check" />
      </button>
    </VehiclePaper>
  );
};

ValidPaper.defaultProps = {
  paperData: null,
  onViewMore: () => { },
};

export default ValidPaper;

const VehiclePaper = styled.div`
  width: 380px;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  color: black;
  border: 2px solid #3AA76D;
  transition: all 0.2s ease-in-out;
  .check {
    margin-left: 10px;
    color: white;
  }
  .validate-btn {
    height: 35px;
    width: 100%;
    background: #3AA76D;
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
  .expiry-label {
    display: block;
    position: absolute;
    right: 5px;
    bottom: 0;
    font-size: 11px;
  }
`;