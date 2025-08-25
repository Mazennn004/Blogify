import React, { useContext, useState } from "react";
import style from "./EditProfile.module.css";
import { tokenContext } from "../../Context/TokenContext";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import ChangeProfilePic from './../ChangeProfilePic/ChangeProfilePic';
import ChangePassword from './../ChangePassword/ChangePassword';
export default function EditProfile() {
  const { setShowMenu } = useContext(tokenContext);
  return (
    <>
    
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)]  flex justify-center items-center  z-50">
        <div className=" w-[80%] md:w-1/2 p-5 bg-white  rounded-2xl overflow-hidden">
          <div className="border-b-2 border-slate-200 flex justify-between p-2">
            <span className="poppins text-lg font-bold">Edit Profile</span>
            <span>
              <i
                onClick={() => {
                  setShowMenu({ isShow: false, target: "" });
                }}
                className="fa-solid fa-close text-lg text-black font-light p-2 cursor-pointer"
              ></i>
            </span>
          </div>
          <ChangeProfilePic/>
        </div>
      </div>
    </>
  );
}
