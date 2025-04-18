import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "@/api/api";
import { handleBackendErrors } from "@/utils/handleHandler";
import { useUserStore } from "@/store/user.store"

import { FaRegEye, FaRegEyeSlash  } from "react-icons/fa6";



export function SignIn() {

  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const schema = yup.object({
    email: yup.string().email('Entrez un mail valide').required('Entrez un email'),
    password: yup.string().required('Entrez un password')
  }).required();

  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const { mutate, isLoading } = useMutation({

    mutationFn: async (data) => {
      return AuthApi.login(data)
    },
    gcTime: 0,
    onSuccess: async (response) => {
      setUser(response)
      navigate("/");
    },
    onError: ({ response }) => {
      setError('root.serverError', {
        message: handleBackendErrors(response.data, "Une erreur s'est produite lors de la connexion")
      })
    }

  })

  const handleClick = async (data) => {
    mutate(data)
  };

  const [hidepasw, sethidepasw] = useState(true);


  return (

    <div className="flex justify-center items-center flex-row w-screen h-screen bg-[#F2F2F2] " >

      <div className="flex flex-col md:flex-row shadow overflow-hidden rounded-lg w-[92%] h-[80%] md:w-[70%] lg:w-[65%] md:h-[70%] bg-white" >

        <div className="flex no-scrollbar rounded-t-lg overflow-scroll flex-col bg-[#fff] justify-center items-center px-[12px] order-last md:order-first self-center w-[92%] h-[80%] md:w-[50%] md:h-full" >

          <h3 className="text-[#000] font-sans text-lg md:text-xl px-[5px] md:px-[15px] font-bold" >Connectez-vous à SIGEN</h3>

          <div className="mt-[20px] bg-white w-[100%] md:w-[90%] px-[2.5%] pb-8 no-scrollbar" >

            {errors.root?.serverError &&
              <p className="flex justify-center text-xs mb-[10px] text-red-600" >Email ou password éronné</p>
            }

            <div className="mb-4">

              <label className="block font-sans text-gray-700 text-[12px] ml-2 font-medium mb-2" htmlFor="email">
                Email
              </label>
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

            <div className="mt-[20px]">
              <label className="block font-sans text-gray-700 text-[12px] ml-2 font-medium mb-2 " htmlFor="password">
                Mot de passe
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

                      <button onClick={(e) => sethidepasw((hide) => !hide)} className=" w-[35px] h-[35px] justify-center item-center" >
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

            <div className=" mt-3 " >
              <Link to={"../forgot-password"} className="text-center text-neutral-800 text-[11px] font-medium self-start font-montserrat underline">Mot de passe oublié</Link>
            </div>

            <div className="mt-[30px] flex items-center justify-center rounded-md">
              <button onClick={handleSubmit(handleClick)} disabled={isLoading} className=" disabled:bg-[#E8F0FE] disabled:text-gray-700 bg-primary items-center font-medium w-full rounded-[50px] linearback text-white h-[48px]" >{isLoading ? "Chargement..." : "Me Connecter"}</button>
            </div>

          </div>

        </div>

        <div className="flex flex-col justify-center items-center order-first md:order-last w-full h-[20%] md:w-[50%] bg-slate-400 md:h-full" >
          <img className="object-cover w-full h-screen" src="/img/sigen/iStock-1476520043.jpg" />
        </div>

      </div>

    </div>

  );
}

export default SignIn;
