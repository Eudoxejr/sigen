import React from 'react';
import styled from '@emotion/styled';
import { BiBlock } from 'react-icons/bi';

const PromoCard = ({
  promoData,
  onViewDetails,
  className,
  ...props
}) => {

  const getMainColor = React.useCallback((forPercentage) => {
    if (forPercentage >= 0 && forPercentage < 30) {
      return '#0F123E';
    } else if (forPercentage >= 30 && forPercentage < 75) {
      return '#ED6E33';
    } else if (forPercentage >= 75) {
      return '#2B6B46';
    } else {
      return '#0F123E';
    }
  }, [promoData]);

  return (
    <Wrapper
      mainColor={getMainColor(parseInt(promoData?.percent) ?? 0)}
      isActive={promoData?.active ? '1' : '0'}
      className={`text-[14px] ${className ?? ''}`}
      onClick={() => onViewDetails(promoData)}
      {...props}
    >
      <div className='w-full h-full flex flex-col justify-start gap-[5px] cursor-pointer z-10'>
        <h4
          className={`h-[40px] flex items-center justify-center bg-white rounded-[5px] text-[#0F123E] text-[18px] font-bold w-full`}
          style={{
            opacity: promoData?.active ? 1 : 0.5,
            border: `1px solid ${promoData?.active ? getMainColor(parseInt(promoData?.percent) ?? 0) : '#000000'}30`
          }}
        >{promoData?.value}</h4>
        <h4 className={`text-[${getMainColor(parseInt(promoData?.percent) ?? 0)}] text-[16px] font-bold w-full text-center mt-[5px]`}>{parseInt(promoData?.percent) ?? 0}%</h4>
        <p className="text-[13px] mt-[20px]">Valable : du <span className="font-bold text-black">04/05/23</span> au <span className="font-bold text-black">08/12/23</span></p>
        <p className="text-[13px]">Utilisable : <span className="font-bold text-black">{promoData?.numberOfUses ?? 0} fois</span> par utilisateur</p>
      </div>
      <div className="left-round" />
      <div className="right-round" />
      {!promoData?.active && <BiBlock className="blocked-icon" />}
    </Wrapper>
  );
};

PromoCard.defaultProps = {
  promoData: { percentage: 45, isActive: true },
  onViewDetails: () => console.log("Method is not provided to [PromoCard]")
};

export default PromoCard;

const Wrapper = styled.div`
  position: relative;
  height: 170px;
  border-radius: 20px;
  background: ${({ mainColor, isActive }) => isActive === '1' ? `${mainColor}10` : '#00000008'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 15px 25px;
  .left-round {
    position: absolute;
    left: -40px;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background: white;
  }
  .right-round {
    position: absolute;
    right: -40px;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    background: white;
  }
  .blocked-icon {
    position: absolute;
    font-size: 150px;
    opacity: 0.05;
  }
`;