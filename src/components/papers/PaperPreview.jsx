import styled from '@emotion/styled';
import React from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdZoomOutMap } from 'react-icons/md';


/**
 * paperData {
 *    title: string;
 *    url: string;
 *    status: string | enum;
 * }
 */
const PaperPreview = ({
  paperData,
  isExpired,
  onValidate,
  onReject,
  onViewMore,
  className,
  placeholder,
  ...props
}) => {
  return (
    <VehiclePaper className={`${className ?? ''}`}>
      <div className="px-3 py-[5px] bg-white rounded-[7px] text-[#0F123E] font-bold flex items-center justify-between">
        {paperData?.attachement?.title || paperData?.title}
        <BsCheck2Circle size={20} className="check" />
      </div>
      <div
        className="w-full flex items-center justify-start"
      >
        <button
          className="flex flex-1 items-center justify-center h-[100px]"
          onClick={onViewMore}
        >
          <MdZoomOutMap className="mr-2" size={15} />
          {placeholder ? placeholder : "Cliquer ici pour voir la pièce"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-[10px]">
        {isExpired ?
          <button
            className="action-btn bg-[#aaa] col-span-2"
          >
            Expirée
          </button>
          :
          <>
            <button
              className="action-btn bg-[#D95A4C]"
              onClick={onReject}
            >
              Rejeter
            </button>
            <button
              className="action-btn bg-[#0F123E]"
              onClick={onValidate}
            >
              Valider
            </button>
          </>
        }
      </div>
    </VehiclePaper>
  );
};

PaperPreview.defaultProps = {
  paperData: null,
  onValidate: () => { },
  onReject: () => { },
  onViewMore: () => { },
};

export default PaperPreview;

const VehiclePaper = styled.div`
  width: 380px;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  color: black;
  border: 2px solid #0000;
  transition: all 0.2s ease-in-out;
  .check {
    display: none;
    margin-left: 10px;
    color: white;
  }
  .action-btn {
    height: 35px;
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
`;