import React, { useEffect, useState } from 'react';
import {
  Input,
} from '@material-tailwind/react';
import styled from '@emotion/styled';
import { ConfigsApi } from '@/api/api';
import { AiOutlineLoading } from 'react-icons/ai';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { isAllowedTo } from '@/utils';
import { Permissions } from '@/data/role-access-data';

const InfosGenerales = ({
  className,
  ...props
}) => {
  // GENERAL INFOS
  const [loading, setLoading] = useState(false);

  const [generalInfos, setGeneralInfos] = useState({
    facebook: "",
    instagram: "",
    appStore: "",
    playStore: "",
    telephone: "",
    email: ""
  });

  const handleFetchGeneralInfos = async () => {
    setLoading(true);
    await ConfigsApi.fetchGeneralConfigs()
      .then(({ data: response }) => {
        if (response?.success) {
          setGeneralInfos({
            facebook: response?.data?.facebook ?? "",
            instagram: response?.data?.instagram ?? "",
            appStore: response?.data?.appStore ?? "",
            playStore: response?.data?.playStore ?? "",
            telephone: response?.data?.telephone ?? "",
            email: response?.data?.email ?? "",
          });
        } else {
          setGeneralInfos({ facebook: "", instagram: "", appStore: "", playStore: "", telephone: "", email: "" });
        }
      })
      .catch(_ => {
        setGeneralInfos({ facebook: "", instagram: "", appStore: "", playStore: "", telephone: "", email: "" });
      })
      .finally(() => setLoading(false));
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm({
    shouldUnregister: true,
    values: generalInfos,
  });

  const onFormValidated = async (data) => {
    setLoading(true);

    await ConfigsApi.updateGeneralConfigs(data)
      .then(({ data: response }) => {
        if (response?.success) {
          toast.success("Les informations générales ont été mises à jour !");
        } else {
          toast.error("Une erreur est survenue lors de l'enregistrement des informations générales");
        }
      })
      .catch(_ => {
        toast.error("Une erreur est survenue lors de l'enregistrement des informations générales");
      })
      .finally(() => setLoading(false));
  };


  // DRIVER DELAY
  const [loadingDriverDelay, setLoadingDriverDelay] = useState(false);

  const [driverDelay, setDriverDelay] = useState("0");

  const [driverDelayError, setDriverDelayError] = useState("");

  const handleFetchLateDelay = async () => {
    setLoadingDriverDelay(true);
    await ConfigsApi.fetchDriverLateDuration()
      .then(({ data: response }) => {
        if (response?.success) {
          setDriverDelay(response?.data?.value);
        } else {
          setDriverDelay("0");
        }
      })
      .catch(_ => {
        setDriverDelay("0");
      })
      .finally(() => setLoadingDriverDelay(false));
  };

  const handleUpdateLateDelay = async () => {
    const error = await validateConfigValue(driverDelay);

    if (error === true) {
      setDriverDelayError("");

      setLoadingDriverDelay(true);

      await ConfigsApi.updateDriverLateDuration(driverDelay)
        .then(({ data: response }) => {
          if (response?.success) {
            toast.success("La durée de retard d'un transporteur a été mise à jour !");
          } else {
            toast.error("Une erreur est survenue lors de l'enregistrement de la durée de retard d'un transporteur");
          }
        })
        .catch(_ => {
          toast.error("Une erreur est survenue lors de l'enregistrement de la durée de retard d'un transporteur");
        })
        .finally(() => setLoadingDriverDelay(false));
    } else {
      setDriverDelayError(error);
    }
  };

  // CANCEL DELAY
  const [loadingCancelDelay, setLoadingCancelDelay] = useState(false);

  const [cancelDelay, setCancelDelay] = useState("0");

  const [cancelDelayError, setCancelDelayError] = useState("");

  const handleFetchCancelDelay = async () => {
    setLoadingCancelDelay(true);
    await ConfigsApi.fetchCancelDuration()
      .then(({ data: response }) => {
        if (response?.success) {
          setCancelDelay(response?.data?.value);
        } else {
          setCancelDelay("0");
        }
      })
      .catch(_ => {
        setCancelDelay("0");
      })
      .finally(() => setLoadingCancelDelay(false));
  };

  const handleUpdateCancelDelay = async () => {
    const error = await validateConfigValue(cancelDelay);

    if (error === true) {
      setCancelDelayError("");

      setLoadingCancelDelay(true);

      await ConfigsApi.updateCancelDuration(cancelDelay)
        .then(({ data: response }) => {
          if (response?.success) {
            toast.success("La durée d'annulation d'une demande de réservation a été mise à jour !");
          } else {
            toast.error("Une erreur est survenue lors de l'enregistrement de la durée d'annulation d'une demande de réservation");
          }
        })
        .catch(_ => {
          toast.error("Une erreur est survenue lors de l'enregistrement de la durée d'annulation d'une demande de réservation");
        })
        .finally(() => setLoadingCancelDelay(false));
    } else {
      setCancelDelayError(error);
    }
  };

  // RAYON D'ACCÈS
  const [loadingRayon, setLoadingRayon] = useState(false);

  const [rayonAccess, setRayonAccess] = useState("0");

  const [rayonAccessError, setRayonAccessError] = useState("");

  const handleFetchRayonAccess = async () => {
    setLoadingRayon(true);
    await ConfigsApi.fetchAccessRayon()
      .then(({ data: response }) => {
        if (response?.success) {
          setRayonAccess(response?.data?.value);
        } else {
          setRayonAccess("0");
        }
      })
      .catch(_ => {
        setRayonAccess("0");
      })
      .finally(() => setLoadingRayon(false));
  };

  const handleUpdateRayonAccess = async () => {
    const error = await validateConfigValue(rayonAccess);

    if (error === true) {
      setRayonAccessError("");

      setLoadingRayon(true);

      await ConfigsApi.updateAccessRayon(rayonAccess)
        .then(({ data: response }) => {
          if (response?.success) {
            toast.success("Le rayon d'accès a été mise à jour !");
          } else {
            toast.error("Une erreur est survenue lors de l'enregistrement du rayon d'accès");
          }
        })
        .catch(_ => {
          toast.error("Une erreur est survenue lors de l'enregistrement du rayon d'accès");
        })
        .finally(() => setLoadingRayon(false));
    } else {
      setRayonAccessError(error);
    }
  };


  useEffect(() => {
    Promise.all([
      handleFetchGeneralInfos(),
      handleFetchLateDelay(),
      handleFetchCancelDelay(),
      handleFetchRayonAccess(),
    ]);
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-center text-black ${className ?? ''}`}
      {...props}
    >
      <p className="w-full text-[16px] flex items-center">
        Informations générales
        {loading && <AiOutlineLoading size={15} color="#0F123E" className="ml-3 animate-spin" />}
      </p>
      <div className="w-full flex items-center flex-wrap mt-[20px]">
        <div className="w-1/2 px-3 mb-[30px]">
          <Input
            label="Lien vers Facebook"
            type="url" color="blue-gray" size="lg"
            error={!!errors?.facebook}
            {...register("facebook", { validate: validateLink })}
            onChange={e => setValue("facebook", e?.target?.value)}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
          {!!errors?.facebook?.message && <span className="text-[#FF0000] text-[12px]">{errors?.facebook?.message}</span>}
        </div>
        <div className="w-1/2 px-3 mb-[30px]">
          <Input
            label="Lien vers Instragram"
            type="url" color="blue-gray" size="lg"
            error={!!errors?.instagram}
            {...register("instagram", { validate: validateLink })}
            onChange={e => setValue("instagram", e?.target?.value)}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
          {!!errors?.instagram?.message && <span className="text-[#FF0000] text-[12px]">{errors?.instagram?.message}</span>}
        </div>
        <div className="w-1/2 px-3 mb-[30px]">
          <Input
            label="Lien de téléchargement sur AppStore"
            type="url" color="blue-gray" size="lg"
            error={!!errors?.appStore}
            {...register("appStore", { validate: validateLink })}
            onChange={e => setValue("appStore", e?.target?.value)}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
          {!!errors?.appStore?.message && <span className="text-[#FF0000] text-[12px]">{errors?.appStore?.message}</span>}
        </div>
        <div className="w-1/2 px-3 mb-[30px]">
          <Input
            label="Lien de téléchargement sur Google PlayStore"
            type="url" color="blue-gray" size="lg"
            error={!!errors?.playStore}
            {...register("playStore", { validate: validateLink })}
            onChange={e => setValue("playStore", e?.target?.value)}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
          {!!errors?.playStore?.message && <span className="text-[#FF0000] text-[12px]">{errors?.playStore?.message}</span>}
        </div>
        <div className="w-1/2 px-3">
          <Input
            label="Numéro de téléphone de contact"
            type="tel" color="blue-gray" size="lg"
            error={!!errors?.telephone}
            {...register("telephone", { validate: validatePhone })}
            onChange={e => setValue("telephone", e?.target?.value)}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
          {!!errors?.telephone?.message && <span className="text-[#FF0000] text-[12px]">{errors?.telephone?.message}</span>}
        </div>
        <div className="w-1/2 px-3">
          <Input
            label="Adresse mail de contact"
            type="email" color="blue-gray" size="lg"
            error={!!errors?.email}
            {...register("email", { validate: validateEmail })}
            onChange={e => setValue("email", e?.target?.value)}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
          {!!errors?.email?.message && <span className="text-[#FF0000] text-[12px]">{errors?.email?.message}</span>}
        </div>
      </div>
      {isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS) &&
        <SubmitButton
          className={`w-[350px] mt-[30px]`}
          onClick={handleSubmit(onFormValidated)}
        >
          Enregistrer les modifications
        </SubmitButton>
      }
      <p className="w-full mt-[70px] text-[16px] flex items-center">
        Durée de retard d'un transporteur (en minutes)
        {loadingDriverDelay && <AiOutlineLoading size={15} color="#0F123E" className="ml-3 animate-spin" />}
      </p>
      <div className="w-full flex items-start mt-3 gap-[20px]">
        <div className="flex-1">
          <Input
            label="Durée de retard"
            type="number" color="blue-gray" size="lg"
            value={driverDelay}
            min={0}
            onChange={e => setDriverDelay(e?.target?.value)}
            error={!!driverDelayError}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
          {!!driverDelayError && <span className="text-[#FF0000] text-[12px]">{driverDelayError}</span>}
        </div>
        {isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS) &&
          <SubmitButton
            className={`w-[200px]`}
            onClick={loadingDriverDelay ? null : handleUpdateLateDelay}
          >
            Enregistrer
          </SubmitButton>
        }
      </div>
      <p className="w-full mt-[70px] text-[16px] flex items-center">
        Durée pour l'annulation d'une demande de réservation (en minutes)
        {loadingCancelDelay && <AiOutlineLoading size={15} color="#0F123E" className="ml-3 animate-spin" />}
      </p>
      <div className="w-full flex items-start mt-3 gap-[20px]">
        <div className="flex-1">
          <Input
            label="Durée d'annulation"
            type="number" color="blue-gray" size="lg"
            value={cancelDelay}
            min={0}
            onChange={e => setCancelDelay(e?.target?.value)}
            error={!!cancelDelayError}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
        </div>
        {isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS) &&
          <SubmitButton
            className={`w-[200px]`}
            onClick={loadingCancelDelay ? null : handleUpdateCancelDelay}
          >
            Enregistrer
          </SubmitButton>
        }
      </div>
      <p className="w-full mt-[70px] text-[16px] flex items-center">
        Rayon d'accès à un transporteur (en mètres)
        {loadingRayon && <AiOutlineLoading size={15} color="#0F123E" className="ml-3 animate-spin" />}
      </p>
      <div className="w-full flex items-start mt-3 gap-[20px]">
        <div className="flex-1">
          <Input
            label="Rayon d'accès"
            type="number" color="blue-gray" size="lg"
            value={rayonAccess}
            min={0}
            onChange={e => setRayonAccess(e?.target?.value)}
            error={!!rayonAccessError}
            readOnly={!isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS)}
          />
        </div>
        {isAllowedTo(Permissions.EDIT_GENERAL_INFORMATIONS_CONFIGS) &&
          <SubmitButton
            className={`w-[200px]`}
            onClick={loadingRayon ? null : handleUpdateRayonAccess}
          >
            Enregistrer
          </SubmitButton>
        }
      </div>
    </div>
  );
};

export default InfosGenerales;

const SubmitButton = styled.button`
  height: 45px;
  background: #0F123E;
  color: white;
  border: 2px solid #0000;
  border-radius: 7px;
  transition: all 0.2s ease-in-out;
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

const validateConfigValue = async (value = "") => {
  if (!!value) {
    try {
      const schema = yup
        .number()
        .min(0, "Doit être supérieur à 0")
        .integer("Doit être un entier")
        .required()

      await schema.validate(value);
      return true;
    } catch (error) {
      return error?.message;
    }
  } else {
    return "Champs requis";
  }
};

export const validateLink = async (value) => {
  try {
    const schema = yup
      .string()
      .url("Cet URL est invalide")
      .required()

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return "Champs requis";
    }
  } catch (error) {
    return error?.message;
  }
};

export const validateEmail = async (value) => {
  try {
    const schema = yup
      .string()
      .email("Adresse mail invalide")
      .required()

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return "Email requis";
    }
  } catch (error) {
    return error?.message;
  }
};

export const validatePhone = async (value) => {
  try {
    const schema = yup
      .string()
      .min(8, "Numéro de téléphone invalide")
      .max(20, "Numéro de téléphone invalide")
      .required()

    if (!!value) {
      await schema.validate(value);
      return true;
    } else {
      return "Téléphone requis";
    }
  } catch (error) {
    return error?.message;
  }
};