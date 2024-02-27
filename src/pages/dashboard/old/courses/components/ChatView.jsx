import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import ChaffeurIcon from '/img/chauffeur.png';
import dayjs from 'dayjs'

const LeftMessage = ({message}) => {
  return (
    <div className="w-full flex-col items-start pl-[15px] pr-[80px] text-[#717171] relative mt-[25px]">
      <div className="w-[40px] h-[40px] p-[3px] bg-white rounded-full absolute top-[-25px] left-[20px]">
        <div className="w-full h-full bg-[#0F123E] rounded-full p-[3px]">
          <img src={ChaffeurIcon} className="h-full w-full object-fit" />
        </div>
      </div>
      <div className="text-[14px] p-3 bg-[#F7F7F7] rounded-[15px] pt-[20px]">
        {message.text}
      </div>
      <p className="text-[12px] mt-[5px]">
        {
          dayjs(message.createdAt).isSame(dayjs(), 'day')
          ? `Aujourd'hui, ${dayjs(message.createdAt).format('HH:mm')}`
          : dayjs(message.createdAt).format('dddd, D MMM [à] HH:mm')
        }
        </p>
    </div>
  );
};

const RightMessage = () => {
  return (
    <div className="w-full flex-col items-end pr-[15px] pl-[80px] text-[#717171]">
      <div className="text-[14px] p-3 bg-[#0F123E] text-white rounded-[15px]">
        Lorem ipsum dolor sit amet consectetur. Facilisis posuere facilisi feugiat consequat imperdiet malesuada viverra morbi orci. Porttitor faucibus et consectetur non. Lacus sociis semper vitae sem.
      </div>
      <p className="text-[12px] mt-[5px] text-end">Aujourd'hui, 12:00</p>
    </div>
  );
};

const DateSeperator = () => <div className="w-full py-[10px] text-center text-[13px] text-black border-b-[1px] border-[#F6F6F6]">
  27 Juillet 2023
</div>;

const ChatView = ({messages}) => {
  const ref = useRef();

  const resetScroll = () => {
    ref.current.scrollTo({
      top: 300000,
      left: 0,
      behavior: "instant"
    });
  };

  useEffect(() => {
    resetScroll();
  }, []);

  return (
    <div className="h-full w-full flex flex-col text-[14px]">
      <div className="h-[50px] flex items-center justify-center px-4 bg-[#0F123E] text-white font-bold">
        Conversation entre le transporteur et le client
      </div>
      <Content ref={ref}>
        {messages.map((message) => (
          message.sender.role === "DRIVER" ?
          <LeftMessage message={message} />
          :
          <RightMessage message={message} />
        ))}
      </Content>
    </div>
  );
};

export default ChatView;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  overflow-y: auto;
  padding: 15px 0px 100px 0px;
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    border: 0px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #ddd;
    border-radius: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 0px;
  }
`;