  import { useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import { yupResolver } from '@hookform/resolvers/yup';
  import * as yup from "yup";
  import { useMutation } from "@tanstack/react-query";
  import { useNavigate, Link } from "react-router-dom";
  import { AuthApi } from "@/api/api";
  import { handleBackendErrors } from "@/utils/handleHandler";
  import { useSearchParams } from "react-router-dom";
  import { FaRegEye, FaRegEyeSlash  } from "react-icons/fa6";
//   import { useUserStore } from "@/store/user.store"
  
  
  export function ResetPsw() {
  
    // const navigate = useNavigate();

    const [searchParams] = useSearchParams();
  
    const schema = yup.object({
        token: yup.string().required(),
        password: yup.string()
        .required('Le mot de passe est requis')
        .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/, 'Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial, et faire au moins 8 caractères de longueur'),
        password_confirmation: yup.string()
        .required('La confirmation du mot de passe est requise')
        .oneOf([yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    }).required();
  
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        token: searchParams.get("token")
      }
    });
  
    const { mutate, isLoading } = useMutation({
  
      mutationFn: async (data) => {
        return AuthApi.resetPsw(data)
      },
      gcTime: 0,
      onSuccess: async (response) => {
        console.log(response);
      },
      onError: ({ response }) => {
        const errorTraited = handleBackendErrors(response.data)
        setError('root.serverError', {
          message: errorTraited || response?.data?.message 
        })
      }
  
    })
  
    const handleClick = async (data) => {
      mutate(data)
    };

    const [hidepasw, sethidepasw] = useState(true);
    const [hidepasw2, sethidepasw2] = useState(true);
  
  
    return (
  
      <div className="flex justify-center items-center flex-row w-screen h-screen bg-[#F2F2F2] " >
  
        <div className="flex flex-col md:flex-row shadow overflow-hidden rounded-lg w-[92%] h-[80%] md:w-[70%] lg:w-[65%] md:h-[70%] bg-white" >
  
          <div className="flex no-scrollbar rounded-t-lg overflow-scroll flex-col bg-[#fff] justify-center items-center px-[12px] order-last md:order-first self-center w-[92%] h-[80%] md:w-[50%] md:h-full" >
  
            <h3 className="text-[#000] font-sans text-lg md:text-xl px-[5px] md:px-[15px] font-bold" >Nouveau mot de passe</h3>
  
            <form className="mt-[20px] bg-white w-[100%] md:w-[90%] px-[2.5%] justify-center flex-col flex pb-8 no-scrollbar" onSubmit={handleSubmit(handleClick)}>
  
              {errors.root?.serverError &&
                <p className="flex justify-center text-xs mb-[10px] text-red-600" >{errors.root?.serverError.message}</p>
              }

              {/* <p className=" text-[13px] mb-7" >Entrez l'adresse mail pour recevoir un email de réinitilisation:</p> */}
  
                <div className="mt-[20px]">
                    <label className="block font-sans text-gray-700 text-[12px] ml-2 font-medium mb-2 " htmlFor="password">
                        Nouveau mot de passe
                    </label>
                    <Controller
                        render={({
                        field: { onChange, onBlur, value, name, ref },
                        fieldState: {error, invalid},
                        }) => (
                          <>
                            <div
                              // onChange={onChange} value={value}
                              className="h-[45px] flex justify-center items-center border rounded-[50px] bg-[#E8F0FE] w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            >
                              <input
                                onChange={onChange} value={value}
                                className=" flex flex-1 h-full text-[13px] bg-[#E8F0FE] text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="password" 
                                type={hidepasw ? "password" : "text"} 
                                placeholder="******************" 
                              />

                              <button onClick={() => sethidepasw((hide) => !hide)} className=" w-[35px] h-[35px] justify-center item-center" >
                                {hidepasw ? <FaRegEyeSlash /> : <FaRegEye />}
                              </button>

                            </div>
                            {error && <span className="text-[10px] ml-3 mt-[5px] text-red-600">{error.message}</span>}
                          </>
                        )}
                        name="password"
                        control={control}
                    />
                </div>


                <div className="mt-[20px]">
                    <label className="block font-sans text-gray-700 text-[12px] ml-2 font-medium mb-2 " htmlFor="password">
                        Confirmer mot de passe
                    </label>
                    <Controller
                        render={({
                        field: { onChange, onBlur, value, name, ref },
                        fieldState: {error, invalid},
                        }) => (
                          <>
                          <div
                            // onChange={onChange} value={value}
                            className="h-[45px] flex justify-center items-center border rounded-[50px] bg-[#E8F0FE] w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                          >
                              <input
                                onChange={onChange} value={value}
                                className=" flex flex-1 h-full text-[13px] bg-[#E8F0FE] text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="password" 
                                type={hidepasw2 ? "password" : "text"} 
                                placeholder="******************" 
                              />

                              <button onClick={() => sethidepasw2((hide) => !hide)} className=" w-[35px] h-[35px] justify-center item-center" >
                                {hidepasw2 ? <FaRegEyeSlash /> : <FaRegEye />}
                              </button>

                            </div>
                            {error && <span className="text-[10px] ml-3 mt-[5px] text-red-600">{error.message}</span>}
                          </>
                        )}
                        name="password_confirmation"
                        control={control}
                    />
                </div>
  
              <div className="mt-[24px] flex items-center justify-center rounded-md">
                <input disabled={isLoading} className="cursor-pointer disabled:bg-[#E8F0FE] disabled:text-gray-700 bg-primary items-center font-medium w-full rounded-[50px] linearback text-white h-[48px]" type="submit" value={isLoading ? "Chargement..." : "Modifier le mot de passe"} />
              </div>
  
            </form>
  
          </div>
  
          <div className="flex flex-col justify-center items-center order-first md:order-last w-full h-[20%] md:w-[50%] bg-slate-400 md:h-full" >
            <img className="object-cover w-full h-screen" src="/img/sigen/iStock-1476520043.jpg" />
          </div>
  
        </div>
  
      </div>
  
    );
  }
  
  export default ResetPsw;
  