import React, { useState } from 'react';
import {
  Input,
  Textarea,
} from '@material-tailwind/react';
import { AiOutlineLoading, AiOutlinePlusCircle } from 'react-icons/ai';
import FaqCard from './FaqCard';
import { useDialogController } from '@/context/dialogueProvider';
import { useForm } from 'react-hook-form';
import { ConfigsApi } from '@/api/api';
import { toast } from 'react-toastify';
import { FiLoader } from 'react-icons/fi';
import * as yup from 'yup';
import { useDebounce } from '@/hooks/useDebounce';
import { Pagination } from '@mui/material';
import { isAllowedTo } from '@/utils';
import { Permissions } from '@/data/role-access-data';

const Faqs = ({
  className,
  ...props
}) => {
  const [_, dispatch] = useDialogController();

  // CREATE A FAQ
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    shouldUnregister: true,
    defaultValues: {
      quiz: "",
      answer: ""
    }
  });

  const [loading, setLoading] = useState(false);

  const onFormValidated = async (data) => {
    setLoading(true);

    await ConfigsApi.postFAQ(data)
      .then(({ data: response }) => {
        if (response?.success) {
          reset();
          toast.success("FAQ ajouté avec succès !");
          handleFetchData();
        } else {
          toast.error("Une erreur est survenue lors de la création du FAQ");
        }
      })
      .catch(_ => {
        toast.error("Une erreur est survenue lors de la création du FAQ");
      })
      .finally(() => setLoading(false));
  };

  // DELETE A FAQ
  const handleDelete = (faqId) => {
    if (!!faqId) {
      typeof dispatch === 'function' && dispatch({
        type: "SET_DIALOG",
        value: {
          active: true,
          view: "confirmAction",
          value: {
            title: "Suppression de FAQ",
            message: "Voulez-vous vraiment supprimer ce FAQ ? Notez que cette action est irréversible.",
            onConfirm: async () => {
              setFetching(true);
              await ConfigsApi.deleteFAQ(faqId)
                .then(({ data: response }) => {
                  if (response?.success) {
                    toast.success("FAQ supprimé avec succès !");
                    handleFetchData();
                  } else {
                    toast.error("Une erreur est survenue lors de la suppression du FAQ");
                  }
                })
                .catch(_ => {
                  toast.error("Une erreur est survenue lors de la suppression du FAQ");
                })
                .finally(() => setFetching(false));
            }
          }
        }
      });
    }
  };

  // FETCH FAQS
  const [fetching, setFetching] = useState(false);

  const [faqsData, setFaqsData] = useState([]);

  const sizePerPage = 6;

  const [meta, setMeta] = useState({
    currentPage: 1,
    perPage: sizePerPage,
    total: 0,
    totalPage: 0
  });

  const handleFetchData = async (forPage = meta?.currentPage, perPage = meta?.perPage) => {
    setFetching(true);
    await ConfigsApi.fetchAllFaqs(forPage, perPage)
      .then(({ data: response }) => {
        if (response?.success) {
          setFaqsData(Array.isArray(response?.data) ? response?.data : []);
          setMeta(old => ({
            ...old,
            currentPage: response?.meta?.currentPage,
            perPage: response?.meta?.perPage,
            total: response?.meta?.total,
            totalPage: response?.meta?.totalPage
          }));
        } else {
          setFaqsData([]);
          setMeta({ currentPage: 1, perPage: sizePerPage, total: 0, totalPage: 0 });
        }
      })
      .catch(err => {
        setFaqsData([]);
        setMeta({ currentPage: 1, perPage: sizePerPage, total: 0, totalPage: 0 });
      })
      .finally(() => setFetching(false));
  };

  useDebounce(
    () => handleFetchData(),
    300,
    [meta?.currentPage]
  );

  return (
    <div
      className={`w-full flex flex-col items-center text-black text-[14px] ${className ?? ''}`}
      {...props}
    >
      {isAllowedTo(Permissions.EDIT_SYSTEM_CONFIGS) &&
        <div className="w-full flex flex-col bg-white shadow-[0px_0px_10px_0px_#0002] rounded-[8px] p-[15px]">
          <p className="font-bold">Ajouter un FAQ</p>
          <div className="w-full flex items-start gap-[15px] mt-[15px]">
            <div className="flex-1">
              <Input
                label="Question ?"
                type="text" color="blue-gray" size="lg"
                error={!!errors?.quiz}
                {...register("quiz", { validate: validateQuiz })}
                onChange={e => setValue("quiz", e?.target?.value)}
              />
              {!!errors?.quiz?.message && <span className="text-[#FF0000] text-[12px]">{errors?.quiz?.message}</span>}
            </div>
            <button
              className="h-[42px] px-[15px] rounded-[5px] flex items-center justify-center bg-[#0F123E] text-white"
              onClick={handleSubmit(onFormValidated)}
            >
              Ajouter
              {loading ?
                <FiLoader className="text-[20px] ml-3 animate-spin" />
                :
                <AiOutlinePlusCircle className="text-[20px] ml-3" />
              }
            </button>
          </div>
          <div className="w-full mt-[15px]">
            <Textarea
              label="Réponse"
              rows={3}
              type="text" color="blue-gray" size="lg"
              error={!!errors?.answer}
              {...register("answer", { validate: validateAnswer })}
              onChange={e => setValue("answer", e?.target?.value)}
            />
            {!!errors?.answer?.message && <span className="text-[#FF0000] text-[12px]">{errors?.answer?.message}</span>}
          </div>
        </div>
      }
      <p className="font-bold mt-[50px] flex items-center">
        Liste des FAQs
        {fetching && <AiOutlineLoading size={15} className="ml-3 animate-spin text-[#0F123E]" />}
      </p>
      {Array.isArray(faqsData) && faqsData?.length > 0 ?
        <div className="w-full grid grid-cols-3 gap-[20px] mt-[20px]">
          {faqsData?.map((el, key) => (
            <FaqCard
              key={String(key)}
              data={el}
              onDelete={handleDelete}
              deletable={isAllowedTo(Permissions.EDIT_SYSTEM_CONFIGS)}
            />
          ))}
        </div>
        :
        <div className="flex-1 w-full flex items-center justify-center mt-[50px]">
          Aucune donnée
        </div>
      }
      {Array.isArray(faqsData) && faqsData?.length > 0 &&
        <Pagination
          variant="outlined" color='primary' size="small"
          count={meta?.totalPage}
          onChange={(_, value) => setMeta(old => ({ ...old, currentPage: value }))}
          className="self-center mt-[30px]"
        />
      }
    </div>
  );
};

export default Faqs;

export const validateQuiz = async (value) => {
  try {
    const schema = yup
      .string()
      .max(250, "Au maximum 250 caractères")
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

export const validateAnswer = async (value) => {
  try {
    const schema = yup
      .string()
      .max(500, "Au maximum 500 caractères")
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
