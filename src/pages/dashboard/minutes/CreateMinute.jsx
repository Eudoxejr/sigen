
/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { produce } from "immer"
import {
	Card,
	CardBody,
	CardHeader,
	Typography,
	Tooltip,
	Button,
	Input,
	Textarea
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlinePercentage, AiFillEuroCircle } from "react-icons/ai";
import { BsCardImage } from "react-icons/bs";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Switch from '@mui/material/Switch';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoriesApi, ClientApi, CollaboApi, FoldersApi } from "@/api/api";
import BeatLoader from "react-spinners/BeatLoader";
import { useDropzone } from 'react-dropzone'
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { RiForbidLine } from "react-icons/ri";
import { toast } from 'react-toastify';

import NextedParty2 from '@/components/common/nextedParty2';
import NextedInformation from '@/components/common/nextedInformation';
import NextedInformationDone from '@/components/common/nestedInformationDone'
import { uploadFile } from '@/utils/uploadS3';
import { v4 as uuidv4 } from 'uuid';

import { useDialogueStore } from '@/store/dialogue.store';

import TemplateEdit from './components/templateEditor';
// import { RenderIf } from "@/components/common";
// import { Permissions } from "@/data/role-access-data";


const MinuteCreate = () => {
    return (
        // <RenderIf allowedTo={Permissions.ADD_TRANSPORT_MEAN}>
            <TemplateEdit/>
        // </RenderIf>
    );
}

export default MinuteCreate;
