import {
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";
  import { useForm, Controller } from "react-hook-form";
  import { yupResolver } from '@hookform/resolvers/yup';
  import * as yup from "yup";
  import { useMutation } from "@tanstack/react-query";
  import { useNavigate, Link } from "react-router-dom";
  import { AuthApi } from "@/api/api";
  import { handleBackendErrors } from "@/utils/handleHandler";
  import { toast } from 'react-toastify';
//   import { useUserStore } from "@/store/user.store"

  
  
  export function ForgotPsw() {
  
    const navigate = useNavigate();
  
    const schema = yup.object({
      email: yup.string().email('Entrez un mail valide').required('Entrez un email')
    }).required();
  
    const { control, handleSubmit, setError, formState: { errors } } = useForm({
      resolver: yupResolver(schema)
    });
  
    const { mutate, isLoading, isSuccess } = useMutation({
  
      mutationFn: async (data) => {
        return AuthApi.forgetPsw(data)
      },
      gcTime: 0,
      onSuccess: async (response) => {
        toast.success('Un mail de restauration vous a été envoyer.', {
          position: "top-right",
          autoClose: 8000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      },
      onError: ({ response }) => {
        const errorTraited = handleBackendErrors(response.data)
        setError('root.serverError', {
          message: errorTraited || "Une erreur s'est produite"
        })
      }
  
    })
  
    const handleClick = async (data) => {
      mutate(data)
    };
  
  
    return (
  
      <div className="flex justify-center items-center flex-row w-screen h-screen bg-[#F2F2F2] " >
  
        <div className="flex flex-col md:flex-row shadow overflow-hidden rounded-lg w-[92%] h-[80%] md:w-[70%] lg:w-[65%] md:h-[70%] bg-white" >
  
          <div className="flex no-scrollbar rounded-t-lg overflow-scroll flex-col bg-[#fff] justify-center items-center px-[12px] order-last md:order-first self-center w-[92%] h-[80%] md:w-[50%] md:h-full" >
  
            <h3 className="text-[#000] font-sans text-lg md:text-xl px-[5px] md:px-[15px] font-bold" >Mot de passe oublié</h3>
  
            <form className="mt-[20px] bg-white w-[100%] md:w-[90%] px-[2.5%] justify-center flex-col flex pb-8 no-scrollbar" onSubmit={handleSubmit(handleClick)}>
  
              {errors.root?.serverError &&
                <p className="flex justify-center text-xs mb-[10px] text-red-600" >{errors.root?.serverError.message}</p>
              }

                <p className=" text-[13px] mb-7" >Entrez l'adresse mail pour recevoir un email de réinitilisation</p>
    
                <div className="mb-4">
    
                  <Controller  
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, error },
                    }) => (
                      <>
                        <input
                          onChange={onChange} value={value}
                          className="h-[45px] text-[13px] border rounded-[50px] bg-[#E8F0FE] w-full px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email"
                        />
                        {error && <span className="text-[10px] ml-3 mt-[5px] text-red-600" >{error.message}</span>}
                      </>
                    )}
                    name="email"
                    control={control}
                  />
                </div>
    
                <div className="mt-[2px] flex items-center justify-center rounded-md">
                  <input disabled={isLoading} className="cursor-pointer disabled:bg-[#E8F0FE] disabled:text-gray-700 bg-primary items-center font-medium w-full rounded-[50px] linearback text-white h-[48px]" type="submit" value={isLoading ? "Chargement..." : "Envoyer"} />
                </div>

              <button disabled={isLoading} onClick={() => navigate('../login')} className=" self-center mt-5 text-center text-neutral-800 text-[13px] font-medium font-montserrat underline " >
                Me connecter
              </button>
  
            </form>
  
          </div>
  
          <div className="flex flex-col justify-center items-center order-first md:order-last w-full h-[20%] md:w-[50%] bg-slate-400 md:h-full" >
            <img className="object-cover w-full h-screen" src="/img/sigen/iStock-1476520043.jpg" />
          </div>
  
        </div>
  
      </div>
  
    );
  }
  
  export default ForgotPsw;
  