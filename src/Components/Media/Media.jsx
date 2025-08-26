import React, { useContext, useState } from "react";
import style from "./Media.module.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { tokenContext } from "../../Context/TokenContext";
import { useNavigate } from "react-router-dom";
export default function Media() {
  const nav=useNavigate();
  const{setShowMenu,showMenu}=useContext(tokenContext);
  function handleImage(i) {
   setShowMenu({isShow:true,target:'viewUserPostImage',data:i})

    
  }
  function getUserPostMedia() {
    return axios.get(
      `https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts?limit=10`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
  }
  const { data ,isLoading,isError} = useQuery({
    queryKey: ["userPosts"],
    queryFn: getUserPostMedia,
    select:(data)=>data?.data?.posts.map((p)=>{return p.image}).reverse()
  });
 

  if(isError){
    nav('/home/networkerror');
  }

  return (
    <>
    
      <div className={`${data?.length===0 && 'justify-center'} row w-full`}>
        {isLoading ?  [1,2,3,4,5,6].map((s,i)=>{
          return (
            <div className='w-1/3' key={i}>
  <div className="inner p-1 md:p-3">
  <div className="skeleton bg-slate-200 h-[150px] w-full dark:bg-slate-600"></div>
  </div>
  </div>
          )
        })        
        : data?.length===0 ? <div className="flex justify-center">
              <div>
                <span className="text-main text-4xl poppins font-bold">
                  No Media Yet !
                </span>
                <p className="text-slate-500 poppins font-light text-center">
                  No Media Posted
                </p>
              </div>
            </div>:
        data?.map((img,i) => { if(img){
          return (
            <div className="w-1/3" key={i}>
              <div className="inner p-1 md:p-3">
                <img
                  src={img}
                  alt="Post image"
                  onClick={() => {
                    handleImage(img);
                  }}
                  className="w-full rounded-xl h-[150px] md:h-[300px] object-cover cursor-pointer"
                />
              </div>
            </div>
          );}else{return}
        })}
      </div>
    </>
  );
}
