import React from 'react';
import { isAllowedTo } from '@/utils';

const RenderIf = ({ allowedTo, children, placeholder }) => {
  return (
    !isAllowedTo(allowedTo) ?
      (
        placeholder ??
        <div className="w-full flex items-center justify-center pt-[100px]">
          Vous n'êtes pas autorisés à accéder au contenu de cette page
        </div>
      )
      :
      children
  );
};

export default RenderIf;