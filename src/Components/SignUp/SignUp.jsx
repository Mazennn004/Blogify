import React, { useContext, useEffect } from "react";
import style from "./SignUp.module.css";
import {Fade} from "react-awesome-reveal";
import { Link, Navigate, useNavigate } from "react-router-dom";
import image from "../../assets/signup-img.png";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { tokenContext } from "../../Context/TokenContext";
export default function SignUp() {
    let{isAuth,setIsAuth}=useContext(tokenContext);
    useEffect(()=>{
    if(isAuth){
      navigate('/home');
      
    }
    },[])
  const schema = z
    .object({
      name: z
        .string()
        .min(3, "Name must be more than 3 charachtars *")
        .max(30, "Name must be lesss than 30 charachtars *"),
      email: z.email("Enter valid email address *"),
      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character *"
        ),
      rePassword: z.string(),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}/, "Enter Valid Date *")
        .refine((date) => {
          const userDate = new Date(date);
          const now = new Date();
          return userDate < now;
        }, "Can't be a future date *"),
      gender: z.enum(["male", "female"], "Please Enter Your Gender *"),
    })
    .refine(
      (obj) => {
        return obj.password === obj.rePassword;
      },
      {
        error: "Password dont match *",
        path: ["rePassword"],
      }
    );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
  });
  let { register, handleSubmit, formState } = form;
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState({
    status: false,
    msg: "",
  });
  const navigate=useNavigate();

  async function handleSignUp(userAccount) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        userAccount);

      if (data.message === "success") {
        setIsLoading(false);
        navigate('/');
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error.response.data.error);
      setIsLoading(false);
      setApiError({
        status: true,
        msg: `${error.response.data.error}`,
      });
    }
  }
  return (
    <>
<Fade direction="right" duration={800} >
  <div  className="row h-screen">
        <div className="w-full md:w-1/2 my-auto order-last">
          <header className="flex flex-col place-items-center ">
            <h2 className="poppins text-3xl font-bold  ">
              Create your account
            </h2>
            <span className="text-slate-600 text-[16px] mt-4 ">
              Already have an account?
              <Link to="/">
                <span className="text-main font-semibold mx-2">Log In</span>
              </Link>
            </span>

            
          </header>
          <form
            onSubmit={handleSubmit(handleSignUp)}
            className="mt-10 flex flex-col p-3  "
          >
            <label htmlFor="name" className="poppins w-[80%] mx-auto">
              Full Name
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              placeholder="Name"
              className={`${
                formState.errors.name ? " border border-red-500" : ""
              } outline-1 w-[80%] mx-auto  rounded p-2 outline-slate-100 shadow-md focus:outline-2 focus:outline-slate-300`}
            />
            {formState.errors.name ? (
              <p className="text-sm font-light text-center mt-0.5 text-red-500">
                {formState.errors.name.message}
              </p>
            ) : (
              ""
            )}

            <label htmlFor="email" className="poppins w-[80%] mx-auto mt-5">
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
              {" "}
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
            <label
              htmlFor="repassword"
              className="poppins w-[80%] mx-auto mt-5"
            >
              Confirm Password
            </label>
            <input
              {...register("rePassword")}
              id="repassword"
              type="Password"
              placeholder="rePassword"
              className={`${
                formState.errors.rePassword ? " border border-red-500" : ""
              } outline-1 w-[80%] mx-auto  rounded p-2 outline-slate-100 shadow-md focus:outline-2 focus:outline-slate-300`}
            />
            {formState.errors.rePassword ? (
              <p className="text-sm font-light text-center mt-0.5 text-red-500">
                {formState.errors.rePassword.message}
              </p>
            ) : (
              ""
            )}
            <label htmlFor="datebirth" className="poppins w-[80%] mx-auto mt-5">
              Date Of Birth
            </label>
            <input
              {...register("dateOfBirth")}
              type="date"
              className={`${
                formState.errors.dateOfBirth ? " border border-red-500" : ""
              } input w-[80%] mx-auto `}
              id="datebirth"
            />
            {formState.errors.dateOfBirth ? (
              <p className="text-sm font-light text-center mt-0.5 text-red-500">
                {formState.errors.dateOfBirth.message}
              </p>
            ) : (
              ""
            )}
            <div className="flex flex-row w-[80%] mx-auto mt-4 justify-center">
              <label htmlFor="male">Male</label>
              <input
                type="radio"
                {...register("gender")}
                value="male"
                id="male"
                className="mx-4"
              />

              <label htmlFor="female">Female</label>
              <input
                type="radio"
                {...register("gender")}
                value="female"
                id="female"
                className="mx-4"
              />
            </div>
            {formState.errors.gender ? (
              <p className="text-sm font-light text-center mt-0.5 text-red-500">
                {formState.errors.gender.message}
              </p>
            ) : (
              ""
            )}
{apiError.status ? (
              <span className=" font-light text-center my-2 bg-red-100 border-accent  rounded-lg capitalize text-lg text-red-500">
                {apiError.msg}!
              </span>
            ) : (
              ""
            )}
            <button
              disabled={isLoading ? true : false}
              className="p-2 rounded-lg bg-main mt-5 disabled:cursor-not-allowed disabled:bg-slate-600 text-white cursor-pointer w-[80%] mx-auto"
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "Sign Up"
              )}
            </button>
            <span className="text-slate-500 text-sm w-[80%] mx-auto mt-3">
              By creating an account, you agree to our{" "}
              <span className="font-bold cursor-pointer">
                Terms of Services & Privacy policy
              </span>
            </span>
          </form>
        </div>
        <div  className="hidden md:w-1/2 md:flex ">
          <img src={image} alt="" className="w-full" />
        </div>
      </div>
</Fade>
      
    </>
  );
}
