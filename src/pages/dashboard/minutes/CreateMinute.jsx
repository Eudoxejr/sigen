
/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { produce } from "immer"

import TemplateEdit from './components/templateEditor';



const MinuteCreate = () => {
    return (
        // <RenderIf allowedTo={Permissions.ADD_TRANSPORT_MEAN}>
            <TemplateEdit/>
        // </RenderIf>
    );
}

export default MinuteCreate;
