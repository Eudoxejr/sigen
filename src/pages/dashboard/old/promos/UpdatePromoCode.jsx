import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlinePercentage } from 'react-icons/ai';
import styled from '@emotion/styled';
import { Switch } from '@mui/material';
import { useDialogController } from '@/context/dialogueProvider';
import { BsTrash3 } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { PromosApi } from '@/api/api';
import { toast } from 'react-toastify';
import { FiLoader } from 'react-icons/fi';
import { validateCode, validateDesc, validateEndDate, validateNumberOfUse, validatePercentage, validateStartDate } from './CreatePromoCode';
import dayjs from 'dayjs';
import { RenderIf } from '@/components/common/render.if';
import { Permissions } from '@/data/role-access-data';
import { isAllowedTo } from '@/utils';


const UpdatePromoCode = () => {
  const navigate = useNavigate();

  const [_, dispatch] = useDialogController();

  const { state: params } = useLocation();

  const { id: promoCodeId } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      code: params?.promoCode?.value,
      percent: params?.promoCode?.percent,
      validyStart: dayjs(params?.promoCode?.validyStart).format("YYYY-MM-DD"),
      validyEnd: dayjs(params?.promoCode?.validyEnd).format("YYYY-MM-DD"),
      numberOfUses: params?.promoCode?.numberOfUses,
      isActive: params?.promoCode?.active,
      description: params?.promoCode?.description
    }, shouldUnregister: true
  });

  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    typeof dispatch === 'function' && dispatch({
      type: "SET_DIALOG",
      value: {
        active: true,
        view: "confirmAction",
        value: {
          title: "Suppression de code promo",
          message: `Voulez-vous vraiment supprimer le code ${params?.promoCode?.value} ? Notez que cette action est irréversible.`,
          onConfirm: async () => {
            if (!!promoCodeId) {
              setDeleting(true);
              await PromosApi.deletePromoCode(promoCodeId)
                .then(({ data: response }) => {
                  if (response?.success) {
                    toast.success(`Le code promo ${params?.promoCode?.value} a été supprimé avec succès !`);
                    navigate(-1);
                  } else {
                    toast.error("Une erreur est survenue lors de la suppression du code promo");
                  }
                })
                .catch(err => {
                  toast.error("Une erreur est survenue lors de la suppression du code promo");
                })
                .finally(() => setDeleting(false));
            } else {
              toast.warn("Impossible de supprimer le code promo. Veuillez recharger la page.")
            }
          }
        }
      }
    });
  };

  const [loading, setLoading] = useState(false);

  /**
   * Called when all the form is well validated
   */
  const onFormValidated = async data => {
    setLoading(true);

    await PromosApi.updatePromoCode(promoCodeId, {
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
          toast.success(`Le code promo a été mis à jour avec succès !`);
          navigate(-1);
        } else {
          toast.error(`Une erreur est survenue lors de la mise à jour du code promo`);
        }
      })
      .catch(err => {
        toast.error(`Une erreur est survenue lors de la mise à jour du code promo`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <RenderIf allowedTo={Permissions.VIEW_A_PROMO_CODE_DETAILS}>
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
                Code: #{params?.promoCode?.value}
              </Typography>
            </div>
            {isAllowedTo(Permissions.DELETE_PROMO_CODE) &&
              <button
                className="h-[40px] px-4 rounded-[5px] flex items-center gap-[5px] bg-white text-[#D95A4C] text-[14px]"
                onClick={deleting ? null : handleDelete}
              >
                Supprimer
                {deleting ?
                  <FiLoader size={17} className="ml-3 animate-spin" />
                  :
                  <BsTrash3 size={17} className="ml-3" />
                }
              </button>
            }
          </CardHeader>
          <CardBody className="p-4 pt-3 h-[calc(100vh-210px)] overflow-auto shadow-none flex flex-col text-black text-[14px]">
            <div className="w-full flex flex-col">
              {isAllowedTo(Permissions.EDIT_PROMO_CODE) &&
                <p
                  className="text-center w-[600px] leading-[30px] self-center mb-5"
                >Vous pouvez modifier les informations du code promo et sauvegarder vos modifications en cliquant sur le bouton <span className="font-bold text-black">[ Mettre à jour ]</span> au bas de la page</p>
              }
              <div className="w-[630px] mt-5">
                <Input
                  label="Code promo"
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
              <p className="mt-[40px]">Pourcentage de réduction attribué à ce code ? (1 - 100)</p>
              <div className="w-[300px] h-[40px] mt-5 flex items-center border-[1px] border-[#0F123E55] rounded-[5px] font-bold overflow-hidden">
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
              <p className="mt-[40px]">Période de validité de ce code</p>
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
              <p className="mt-[40px]">Nombre d'utilisation par utilisateur</p>
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
              {isAllowedTo(Permissions.EDIT_PROMO_CODE) &&
                <div className="w-full flex flex-col items-center text-[14px] my-[50px]">
                  <SubmitButton
                    className={loading ? "loading" : ""}
                    onClick={handleSubmit(onFormValidated)}
                  >
                    Mettre à jour
                    {loading && <FiLoader size={20} className="ml-4 animate-spin" />}
                  </SubmitButton>
                </div>
              }
            </div>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default UpdatePromoCode;

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