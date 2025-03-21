import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlinePercentage } from 'react-icons/ai';
import styled from '@emotion/styled';
import { Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PromosApi } from '@/api/api';
import { toast } from 'react-toastify';
import { FiLoader } from 'react-icons/fi';
import dayjs from 'dayjs';
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';


const CreatePromoCode = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ shouldUnregister: true });

  const [loading, setLoading] = useState(false);

  /**
   * Called when all the form is well validated
   */
  const onFormValidated = async data => {
    setLoading(true);

    await PromosApi.postPromoCode({
      value: data?.code,
      percent: parseInt(data?.percent),
      validyStart: data?.validyStart,
      validyEnd: !!data?.validyEnd ? data?.validyEnd : "",
      numberOfUses: parseInt(data?.numberOfUses),
      active: data?.isActive,
      description: data?.description
    })
      .then(({ data: response }) => {
        if (response?.success) {
          toast.success(`Le code promo a été ajouté avec succès !`);
          navigate(-1);
        } else {
          toast.error(`Une erreur est survenue lors de l'ajout du code promo`);
        }
      })
      .catch(err => {
        toast.error(`Une erreur est survenue lors de l'ajout du code promo`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <RenderIf allowedTo={Permissions.ADD_PROMO_CODE}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row items-center justify-between ">
            <div className='flex items-center' >
              <Tooltip content="Retour">
                <button onClick={() => navigate(-1)} className=" bg-blue-gray-700 w-[40px] h-[40px] mr-3 rounded-full flex justify-center items-center" >
                  <AiOutlineArrowLeft color='white' size={18} />
                </button>
              </Tooltip>
              <Typography variant="h6" color="blue-gray">
                Ajout d'un code promo
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none flex flex-col text-black text-[14px]">
            <div className="w-full flex flex-col">
              <p
                className="text-center w-[600px] leading-[30px] self-center mb-5"
              >Veuillez remplir convenablement les différents champs présentés sur cette page puis cliquez sur le bouton <span className="font-bold text-black">[ Enregistrer ]</span></p>
              <div className="w-[630px] mt-5">
                <Input
                  label="Entrez le code promo"
                  type="text" color="blue-gray" size="lg"
                  error={!!errors?.code}
                  {...register("code", { validate: validateCode })}
                  onChange={e => setValue("code", String(e?.target?.value).toUpperCase())}
                />
                {!!errors?.code?.message && <span className="text-[#FF0000] text-[12px]">{errors?.code?.message}</span>}
              </div>
              <div className="w-[630px] mt-5">
                <Input
                  label="Entrez une description pour le code promo"
                  type="text" color="blue-gray" size="lg"
                  error={!!errors?.description}
                  {...register("description", { validate: validateDesc })}
                  onChange={e => setValue("description", e?.target?.value)}
                />
                {!!errors?.description?.message && <span className="text-[#FF0000] text-[12px]">{errors?.description?.message}</span>}
              </div>
              <p className="mt-[40px]">Quel est le Pourcentage de réduction attribué à ce code ? (1 - 100)</p>
              <div
                className={`w-[300px] h-[40px] mt-5 flex items-center rounded-[5px] font-bold overflow-hidden`}
                style={{ border: `1px solid ${!!errors?.percent ? '#F00' : '#0F123E55'}` }}
              >
                <input
                  type="number"
                  className="outline-none flex-1 h-full px-3"
                  placeholder="0"
                  {...register("percent", { validate: validatePercentage })}
                  onChange={e => setValue("percent", e?.target?.value)}
                />
                <div className="h-full w-[40px] flex items-center justify-center border-l-[1px] border-[#0F123E55]">
                  <AiOutlinePercentage size={20} />
                </div>
              </div>
              {!!errors?.percent?.message && <span className="text-[#FF0000] text-[12px] mt-1">{errors?.percent?.message}</span>}
              <p className="mt-[40px]">Quelle est la période de validité de ce code ?</p>
              <div className="flex w-full items-center gap-[20px]">
                <div className="w-[300px] mt-5">
                  <Input
                    label="Date de début"
                    type="date" color="blue-gray" size="lg"
                    error={!!errors?.validyStart}
                    {...register("validyStart", { validate: validateStartDate })}
                    onChange={e => setValue("validyStart", e?.target?.value)}
                  />
                  {!!errors?.validyStart?.message && <span className="text-[#FF0000] text-[12px]">{errors?.validyStart?.message}</span>}
                </div>
                <div className="w-[300px] mt-5">
                  <Input
                    label="Date de fin"
                    type="date" color="blue-gray" size="lg"
                    error={!!errors?.validyEnd}
                    {...register("validyEnd", { validate: validateEndDate })}
                    onChange={e => setValue("validyEnd", e?.target?.value)}
                  />
                  {!!errors?.validyEnd?.message && <span className="text-[#FF0000] text-[12px]">{errors?.validyEnd?.message}</span>}
                </div>
              </div>
              <p className="mt-[40px]">Combien de fois ce code sera-t-il utilisé par utilisateur ?</p>
              <div className="w-[300px] mt-5">
                <Input
                  label="Nombre d'utilisation"
                  type="number" color="blue-gray" size="lg"
                  error={!!errors?.numberOfUses}
                  {...register("numberOfUses", { validate: validateNumberOfUse })}
                  onChange={e => setValue("numberOfUses", e?.target?.value)}
                />
                {!!errors?.numberOfUses?.message && <span className="text-[#FF0000] text-[12px]">{errors?.numberOfUses?.message}</span>}
              </div>
              <p className="mt-[40px]">Le code est-il actif ? </p>
              <div className="flex w-full items-center gap-[30px]">
                Non
                <Switch
                  defaultChecked
                  {...register("isActive")}
                  onChange={(_, status) => setValue("isActive", status)}
                />
                Oui
              </div>
              <div className="w-full flex flex-col items-center text-[14px] my-[50px]">
                <SubmitButton
                  className={loading ? "loading" : ""}
                  onClick={handleSubmit(onFormValidated)}
                >
                  Enregistrer
                  {loading && <FiLoader size={20} className="ml-4 animate-spin" />}
                </SubmitButton>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default CreatePromoCode;

const SubmitButton = styled.button`
  height: 50px;
  width: 350px;
  background: #0F123E;
  color: white;
  border: 2px solid #0000;
  border-radius: 7px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  &.loading {
    background: white !important;
    color: #0F123E !important;
    border: 2px solid #0F123E !important;;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    background: #0F123EEE;
    color: white;
    border: 2px solid #0000;
    transition: all 0.2s ease-in-out;
  }
`;

export const validateCode = (value) => {
  if (!!value) {
    if (String(value).length >= 4) {
      return true;
    } else {
      return "Minimum 4 caractères";
    }
  } else {
    return "Code requis";
  }
};

export const validateDesc = async (value) => {
  try {
    const schema = yup
      .string()
      .max(500, "500 caractères au maximum")
      .required()

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return true;
    }
  } catch (error) {
    return error?.message;
  }
};

export const validatePercentage = async (value) => {
  try {
    const schema = yup
      .number()
      .min(0, "Doit être supérieur à 0")
      .max(100, "Doit être inférieur ou égale à 100")
      .required()

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return "Le pourcentage est requis";
    }
  } catch (error) {
    return error?.message;
  }
};

export const validateStartDate = async (value) => {
  try {
    const schema = yup
      .date()
      .required("Date de départ requise")
      .min(dayjs().subtract(1, "day").toDate(), `Doit être au plus tôt le ${dayjs().format("DD/MM/YYYY")}`);

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return "La date de début est requise";
    }
  } catch (error) {
    return error?.message;
  }
};

export const validateEndDate = async (value, formValues) => {
  try {
    let startDate = dayjs(formValues?.validyStart, "YYYY-MM-DD");

    if (!startDate.isValid()) {
      startDate = dayjs()
    }

    const schema = yup
      .date()
      .required("Date de fin requise")
      .min(startDate.toDate(), `Doit être au plus tôt le ${startDate.format("DD/MM/YYYY")}`);

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return "La date de fin est requise";
    }
  } catch (error) {
    return error?.message;
  }
};

export const validateNumberOfUse = async value => {
  try {
    const schema = yup
      .number()
      .min(0, "Doit être supérieur à 0")
      .required()

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return "Le nombre d'utilisation est requis";
    }
  } catch (error) {
    return error?.message;
  }
};