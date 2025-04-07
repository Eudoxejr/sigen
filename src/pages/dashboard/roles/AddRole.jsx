import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineLoading } from "react-icons/ai";
import styled from "@emotion/styled";
import { Checkbox } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoleApi } from "@/api/api";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
// import { handleBackendErrors } from "@/utils/error-handler"; // si tu as ce genre de helper

const sxStyle = {
  color: "#0F123E",
  "&.Mui-checked": {
    color: "#0F123E",
  },
};

const schema = yup.object({
  roleName: yup.string().required("Le nom du rôle est requis"),
  permissions: yup.array().of(yup.number()).min(1, "Sélectionnez au moins une permission"),
});

const AddRole = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roleName: "",
      permissions: [],
    },
    resolver: yupResolver(schema),
  });

  const {
    isLoading,
    data: permissionList,
  } = useQuery({
    queryKey: ["getPermission"],
    queryFn: RoleApi.getPermission,
  });

  const { mutate, isLoading: isLoadingMutate } = useMutation({
    mutationFn: RoleApi.createRole,
    onSuccess: () => {
      toast.success("Rôle créé avec succès", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });

      queryClient.invalidateQueries(["getRoles"]);
      navigate(-1);
    },
    onError: ({ response }) => {
      // const errorTraited = handleBackendErrors(response.data);
      // setError("root.serverError", {
      //   message: errorTraited || "Une erreur s'est produite",
      // });
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    mutate({
      name: data.roleName,
      permissions: data.permissions,
    });
  };

  return (
    <div className="my-4 flex w-full flex-1 flex-col">
      <div className="flex items-center">
        <Tooltip content="Retour">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary"
          >
            <AiOutlineArrowLeft className="text-white" size={16} />
          </button>
        </Tooltip>
        <Typography
          variant="h6"
          className="text-[14px] text-blue-gray-700"
          color="blue-gray"
        >
          Ajout d'un rôle
        </Typography>
      </div>
      <Card className="mt-2">
        {isLoading ? (
          <div className="flex h-[calc(100vh-230px)] w-full items-center justify-center">
            <AiOutlineLoading className="animate-spin" size={40} />
          </div>
        ) : (
          <CardBody className="flex h-[calc(100vh-180px)] flex-col overflow-auto p-4 pt-3 text-[14px] text-black shadow-none">
            <p className="mb-5 max-w-[600px] self-center text-center leading-[30px]">
              Veuillez remplir convenablement les différents champs présentés
              sur cette page, et cocher les accès à activer pour ce rôle. Puis
              cliquez sur le bouton{" "}
              <span className="font-bold text-black">[ Enregistrer ]</span>
            </p>

            <div className="mt-5 w-[400px]">
              <Controller
                name="roleName"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Entrez le titre du rôle"
                    {...field}
                    type="text"
                    color="blue-gray"
                    size="lg"
                    error={!!errors.roleName}
                  />
                )}
              />
              {errors.roleName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.roleName.message}
                </p>
              )}
            </div>

            <p className="mt-[30px]">
              Cochez les accès auxquels a droit un utilisateur ayant ce rôle
            </p>

            <div className="mt-4 flex w-full flex-wrap items-center">
              <Controller
                name="permissions"
                control={control}
                render={({ field }) => {
                  const { value, onChange } = field;

                  const togglePermission = (id) => {
                    if (value.includes(id)) {
                      onChange(value.filter((v) => v !== id));
                    } else {
                      onChange([...value, id]);
                    }
                  };

                  return permissionList?.map((perm) => (
                    <div key={perm.id} className="flex w-1/2 items-center px-3 py-1">
                      <Checkbox
                        checked={value.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        color="success"
                        size="small"
                        sx={sxStyle}
                      />
                      <p
                        className="cursor-pointer leading-[30px]"
                        onClick={() => togglePermission(perm.id)}
                      >
                        {perm.permission_description ?? ""}
                      </p>
                    </div>
                  ));
                }}
              />
              {errors.permissions && (
                <p className="text-red-500 text-sm mt-2 w-full">{errors.permissions.message}</p>
              )}
            </div>

            <div className="my-[50px] flex w-full flex-col items-center text-[14px]">
              <SubmitButton
                className={isLoadingMutate ? "loading" : ""}
                onClick={handleSubmit(onSubmit)}
              >
                Enregistrer
                {isLoadingMutate && (
                  <FiLoader size={20} className="ml-4 animate-spin" />
                )}
              </SubmitButton>
            </div>
          </CardBody>
        )}
      </Card>
    </div>
  );
};

export default AddRole;

const SubmitButton = styled.button`
  height: 50px;
  width: 350px;
  background: #0f123e;
  color: white;
  border: 2px solid #0000;
  border-radius: 7px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  &.loading {
    background: white !important;
    color: #0f123e !important;
    border: 2px solid #0f123e !important;
    transition: all 0.2s ease-in-out;
  }
  &:hover {
    background: #0f123eee;
    color: white;
    border: 2px solid #0000;
    transition: all 0.2s ease-in-out;
  }
`;
