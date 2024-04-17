
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

import htmlToDraft from 'html-to-draftjs'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js'

import TemplateEdit from './components/templateEditor';
// import { RenderIf } from "@/components/common";
// import { Permissions } from "@/data/role-access-data";


const MinuteCreate = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setBackdrop } = useDialogueStore()


    const schema = yup.object({

        categoryId: yup.string().trim("Sélectionner une catégorie svp").required("Sélectionner une catégorie svp"),

    }).required();


    const {control, setValue, handleSubmit, setError, formState:{ errors, isDirty } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
        }
    });

    const { fields:fieldSubCategory, append:appendSubCategory, remove:removeSubCategory } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "subCategories", // unique name for your Field Array
    });


    const watchSubCategories = useWatch({
        control: control,
        name: "subCategories"
    })


    const getCient = async (inputValue) => {
        const res = await ClientApi.getClient(1, 12, inputValue)
        return res.data.map((data) => { return { label: data?.civility !== 'Structure' ? data.firstname+' '+data.lastname : data.denomination, value: data.id } })
    };
    const loadOptionsClient = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCient(inputValue))
        }
    );


    const onCategorieChange = (value) => {

        // setValue('subCategories', val.other.subCategories, {shouldDirty: true})
        const newValue = value.map((val) => { 
            return {
                ...val,
                ...!val?.is_multi_parts ? {informationDone: val.informationRequested.map((informationRequestedItem) => {
                    return {
                        informationRequestedId: informationRequestedItem?.id,
                        key: informationRequestedItem?.question,
                        value: ''
                    }
                }) } : null ,
                ...val?.is_multi_parts ? {partyInvolved: val?.partyInvolved.map((val2) => {
                    return { 
                        ...val2, 
                        "informationDone": val?.party_involved_are_customer ? 
                            [{ key: val2?.party_title, value: ''}]
                        : val.informationRequested.map((informationRequestedItem) => {
                            return {
                                informationRequestedId: informationRequestedItem?.id,
                                key: informationRequestedItem?.question,
                                value: ''
                            }
                        })
                    }
                }) } : null ,
            }
        })

        setValue('subCategories', newValue, {shouldDirty: true})

    }



    const getCat = async (inputValue) => {
        const res = await CategoriesApi.getCategories(1, 8, inputValue)
        return res.data.map((data) => { return { label: data.category_name, value: data.id, other: data } })
    };
    const loadOptionsCategorie = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCat(inputValue))
        }
    );



    const getCol = async (inputValue) => {
        const res = await CollaboApi.getCollabo(1, 12, inputValue)
        return res.data.map((data) => { return { label: data.firstname+' '+data.lastname, value: data.id, other: data } })
    };
    const loadOptionsCol = (inputValue) => 
        new Promise((resolve) => {
            resolve(getCol(inputValue))
        }
    );


    const {mutate, isLoading} = useMutation({

        mutationFn: async (data) => {
            return FoldersApi.createFolders(data)
        },
        gcTime:0,
        onSuccess: (response) => {
            navigate(-1)
            toast.success('Dossiers créé avec succès', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            // queryClient.setQueriesData(["getAllCategories"], (dataCat) => {
            //     const nextData = produce(dataCat, draftData => {
            //         draftData.data.unshift(response.data)
            //         draftData.meta.total = dataCat.meta.total+1
            //     })
            //     return nextData;
            // })

            setBackdrop({active: false})

        },
        onError: ({response}) => {
            setError('root.serverError', { 
                message: response.data.msg || "Une erreur s'est produite lors de la création du dossiers"
                // message: "Une erreur s'est produite lors de la connexion"
            })
            toast.error('Une Erreur s\'est produite', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            setBackdrop({active: false})
        }

    })


    const handleClick = async (data) => {

        const html = draftToHtml(convertToRaw(data.content.getCurrentContent()));
        data.content = html

        console.log('====================================');
        console.log(html);
        console.log('====================================');
        // setBackdrop({active: true})
        // mutate(data)
    };


    return (

        // <RenderIf allowedTo={Permissions.ADD_TRANSPORT_MEAN}>

            <TemplateEdit/>

        // </RenderIf>

    );
}

export default MinuteCreate;
