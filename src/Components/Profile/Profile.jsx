import React, { useContext, useState } from "react";
import style from "./Profile.module.css";
import { tokenContext } from "../../Context/TokenContext";
import { NavLink, Outlet } from "react-router-dom";
import Toast from './../Toast/Toast';

export default function Profile() {
  const { userData ,setShowMenu,editProfileToast} = useContext(tokenContext);
  
return (
    <>
      {editProfileToast.visible && <Toast msg={editProfileToast.msg} status={editProfileToast.status}/>}
      <div className=" w-full md:w-[75%] ms-auto m-10 p-2 flex flex-col gap-10 ">
        <div className="rounded-2xl shadow dark:bg-slate-900 dark:text-white">
          <div className="cover w-full  rounded-2xl h-[30vh] relative">
            <figure className="absolute bottom-[-30px] start-0 mx-5 ">
              {userData.photo ? (
                <img
                  src={userData.photo}
                  alt="pfp"
                  className="bg-slate-100 h-32 w-32 rounded-full"
                />
              ) : (
                <div className="skeleton h-32 w-32 rounded-full dark:bg-slate-600"></div>
              )}
            </figure>
          </div>
          <div className="profile-contents m-5 flex justify-between">
            <div className="username mt-10">
              {userData.name ? (
                <span className="font-bold poppins text-2xl">
                  {userData.name}
                </span>
              ) : (
                <div className="skeleton h-4 w-50 mt-10 dark:bg-slate-600"></div>
              )}
              {userData.name ? (
                <span className="block text-slate-600 font-normal poppins">
                  @{userData.name.split(" ").pop()}
                </span>
              ) : (
                <div className="skeleton h-4 w-28 mt-5 mx-2 dark:bg-slate-600"></div>
              )}
            </div>
            <div className="settings mt-6">
              <button onClick={()=>{setShowMenu({isShow:true,target:'editProfile'});
            }} className="p-2 rounded-3xl cursor-pointer hover:bg-violet-700 transition-all duration-300 bg-main text-white poppins mx-2">
                <i className="fa-solid fa-edit text-white text-md mx-2"></i>Edit
                Profile
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-10">
          <ul className="flex gap-3 border-b border-slate-300 dark:text-white">
            <li className="py-3">
              <NavLink to='/home/profile' end className={({ isActive }) =>
          isActive ? "poppins text-lg p-3 border-b-2 border-main cursor-pointer" : "poppins text-lg p-3 cursor-pointer"}>My Posts</NavLink>
            </li>
            <li className="py-3">
              <NavLink
              to='/home/profile/media'
                className={({ isActive }) =>
          isActive ? "poppins text-lg p-3 border-b-2 border-main cursor-pointer" : "poppins text-lg p-3 cursor-pointer"}
              >
                Media
              </NavLink>
            </li>
          </ul>
     <div>
      <Outlet/>
     </div>
        </div>
      </div>
    </>
  );
}
