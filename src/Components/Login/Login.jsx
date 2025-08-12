import React, { useContext, useEffect, useState } from "react";
import style from "./Login.module.css";
import { Link, redirect, useNavigate } from "react-router-dom";
import image from "../../assets/Login-img.png";
import { useForm } from "react-hook-form";
import { Fade } from "react-awesome-reveal";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios from "axios";
import { tokenContext } from "../../Context/TokenContext";

export default function Login() {
  const schema = z.object({
    email: z.email("Enter valid email address *"),
    password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'Please Enter Valid Password *'),
  });
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  let{isAuth,setIsAuth}=useContext(tokenContext);
  const[loading,setLoading]=useState(false);
  const[apiError,setApiError]=useState({status:false,msg:""});
  const { register, handleSubmit, formState } = form;
const navigate=useNavigate();
useEffect(()=>{
if(isAuth){
  navigate('home');
  
}
},[])
  async function handleLogin(account) {
    setLoading(true);
   try{
    const {data}=await axios.post('https://linked-posts.routemisr.com/users/signin',account);
    if(data.message==='success'){
      setLoading(false);
      localStorage.setItem('token',data.token);
      setIsAuth(data.token)
      navigate('home');
      
      }else{
        throw new Error();
      }
   
    
   }
   catch({response}){
    setLoading(false)
console.log(response.data.error,response.status);
setApiError({status:true,msg:response.data.error});




   }
  }




  return (
    <Fade direction="left" duration={800}>
      <div className="row h-screen overflow-hidden">
        <div className="w-full md:w-1/2 my-auto">
          <header className="flex flex-col  items-center">
            <Fade direction="up">
              <h1 className=" poppins text-4xl font-bold  text-main">
                Blogify
              </h1>
            </Fade>
            <Fade direction="left" duration={1000} delay={500}>
              <h2 className="poppins text-3xl font-bold  mt-6">
                Welcome Back!
              </h2>
            </Fade>
            <span className="text-slate-600 text-[16px] mt-4 ">
              Don't have an account?{" "}
              <Link to="signup">
                <span className="text-main font-semibold">Sign Up</span>
              </Link>
            </span>
          </header>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="mt-10 flex flex-col p-5"
          >
            <label htmlFor="email" className="poppins w-[80%] mx-auto">
              Email Address
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="user@email.com"
              className={`${
                formState.errors.email ? " border border-red-500" : ""
              } outline-1 w-[80%] mx-auto  rounded p-2 outline-slate-100 shadow-md focus:outline-2 focus:outline-slate-300`}
            />
            {formState.errors.email ? (
              <p className="text-sm font-light text-center mt-0.5 text-red-500">
                {formState.errors.email.message}
              </p>
            ) : (
              ""
            )}
            <label htmlFor="password" className="poppins w-[80%] mx-auto mt-5">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="Password"
              placeholder="Password"
              className={`${
                formState.errors.password ? " border border-red-500" : ""
              } outline-1 w-[80%] mx-auto  rounded p-2 outline-slate-100 shadow-md focus:outline-2 focus:outline-slate-300`}
            />
            {formState.errors.password ? (
              <p className="text-sm font-light text-center mt-0.5 text-red-500">
                {formState.errors.password.message}
              </p>
            ) : (
              ""
            )}
            <div className="flex justify-between mt-3 w-[80%] mx-auto">
              <label htmlFor="remember">
                <input
                type="checkbox"
                  id="remember"
                  className="mx-1 shadow"
                />
                Remember me
              </label>

              <span className="text-[#8327f9] md:font-medium cursor-pointer sm:text-sm">
                Forget Password?
              </span>
            </div>
            {
              apiError.status ? <span className=" font-light text-center my-2 bg-red-100 border-accent  rounded-lg capitalize text-lg text-red-500">
                {apiError.msg}
              </span>:''
            }
            <button disabled={loading} className="disabled:bg-slate-600 disabled:cursor-not-allowed p-2 rounded-lg bg-[#8327f9] mt-5 text-white cursor-pointer w-[80%] mx-auto">
             {loading ? <i className="fa-solid fa-spinner fa-spin"></i>: 'Log In'}
            </button>
          </form>
        </div>
        <div className="hidden md:w-1/2 md:flex md:bg-black">
          <img src={image} alt="" className="relative bottom-[25px]" />
        </div>
      </div>
    </Fade>
  );
}
