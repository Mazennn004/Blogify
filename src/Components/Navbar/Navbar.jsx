import React, { useContext, useState } from "react";
import style from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { tokenContext } from "../../Context/TokenContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import CreatePost from "../CreatePost/CreatePost";
import Modal from "./../Modal/Modal";
import { useQuery } from "@tanstack/react-query";
import Toast from "../Toast/Toast";

export default function Navbar() {
  const[userDataError,setUserDataError]=useState(false);
  const { isAuth, setIsAuth, userData, setUserData, showMenu, setShowMenu ,setCreatePostToast,createPostToast} =
    useContext(tokenContext);
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    setIsAuth(null);
    nav("/");
  }
  function getUserData() {
    return axios.get("https://linked-posts.routemisr.com/users/profile-data", {
        headers: {
          token: isAuth,
        },
      })
      
  }

  const {isSuccess,data,isError} = useQuery({
    queryKey: ["getUserData"],
    queryFn: getUserData,
    staleTime:1000*60*60,
    retry:false,
  });

  useEffect(() => {
    if(isSuccess && data?.data?.user) {
      setUserData(data.data.user);
      setUserDataError(false); 
    }else if(isError){
     setUserDataError(true);
    }
  }, [isSuccess, data,isError]);

  return (
    <>
      <div
        className={`${
          showMenu.isShow ? "blur" : ""
        } navbar  bg-base-100 shadow-sm fixed top-0 z-10`}
      >
        <div className="flex-1">
          <Link
            to=""
            className=" poppins text-3xl font-bold text-main md:mx-16 cursor-pointer"
          >
            Blogify
          </Link>
        </div>
        <div className="flex gap-2 md:mx-16">
          <button
            onClick={() => {
              setShowMenu({ isShow: true, target: "createPost" });
            }}
            className="hidden md:flex bg-[#4F39F6] p-3 rounded-4xl text-white mx-4 poppins cursor-pointer hover:bg-violet-800 transition-all duration-300"
          >
            <i className="fa-solid fa-plus-circle mx-1.5 text-lg mt-1"></i>
            Create Post
          </button>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {userData.photo ? (
                  <img
                    src={userData.photo}
                    alt="user-profile"
                    className="h-32 w-32 rounded-full"
                  />
                ) : (
                  <div className="skeleton h-32 w-32 rounded-full"></div>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-main"
            >
              <li>
                <Link to="profile">Profile</Link>
              </li>
              <li
                onClick={() => {
                  logout();
                }}
              >
                <Link>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showMenu.isShow ? <Modal target={showMenu.target} data={showMenu.data}/> : ""}
      {userDataError && <Toast msg={'Error Fetching User Data'} status={'error'}/>}
     { createPostToast.visible && <Toast msg={createPostToast.msg} status={createPostToast.status}/>}
    </>
  );
}
