import React, { useEffect, useState } from "react";
import style from "./Post.module.css";
import { Link } from "react-router-dom";
import { shortFormat } from './../Home/Home';
import { useContext } from "react";
import { tokenContext } from "../../Context/TokenContext";
import Comment from "../Comment/Comment";

export default function Post({data:p}) {
 const{userData}=useContext(tokenContext); 
const [comments,setComments]=useState(p.comments);

return (
    <>
      <div className="flex w-full flex-col gap-4 rounded-2xl shadow-md  ">
        {" "}
        {/*Card Post*/}
      
          <div className="p-5 ">
            <div className="flex items-center justify-between gap-4 ">
              <div className="flex gap-4">
                <img
                  src={p.user.photo}
                  className="h-16 w-16 shrink-0 rounded-full"
                  alt="profile-pic"
                />{" "}
                {/*profile image */}
                <div className="flex flex-col">
                  <h2 className="poppins font-bold">{p.user.name}</h2>{" "}
                  {/* Name */}
                  <div className="poppins mt-0 text-slate-400 text-sm flex gap-1">
                    <span>@{p.user.name.split(" ").pop()} .</span>
                    <span> {shortFormat(p.createdAt)}</span>
                  </div>{" "}
                  {/* @name*/}
                </div>
              </div>
              <div>
                <i className="fa-solid fa-ellipsis cursor-pointer text-slate-500 text-lg"></i>
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              {/*Post Content*/}
              <div className="p-2 w-[100%]">
                <p className="poppins text-lg font-light overflow-clip">
                  {p.body}
                </p>
              </div>
            </div>
            {p.image ? (
               <Link to={`/home/singlepost/${p._id}`}>
              <img
                src={p.image}
                className="w-full rounded-3xl"
                loading="lazy"
                alt="post-image"
              />
              </Link>
            ) : (
              ""
            )}
          </div>
          <div className="bg-slate-100 p-3 ">
            <ul className="poppins p-2 text-slate-500 flex gap-5">
              <li>
                <i className="fa-regular fa-heart mx-1 text-lg cursor-pointer hover:text-red-600 hover:scale-[105%] transition-all duration-300"></i>
                {comments.length}
              </li>
              <li>
                <Link to={`/home/singlepost/${p._id}`}>
                  <i className="fa-regular fa-comment mx-1 text-lg cursor-pointer hover:text-main transition-all duration-300 hover:scale-[105%]"></i>
                  {comments.length}
                </Link>
              </li>
            </ul>
          </div>
       
        {comments.length != 0 ? (
          <div className="p-5">
            <span className="poppins text-lg font-bold">
              Comments ({comments.length <= 2 ? comments.length : "2"})
            </span>
            {p.comments.length > 2 ? (
           [comments[0],comments[1]].map((c,i)=>{
            return (<Comment key={i} data={c}/>)
           })
            ) : (
              comments.map((c, i) => {
                return (
                 <Comment key={i} data={c} />
                );
              })
            )}
            <div className="comment-input flex flex-row mt-5">
              <div className="w-12 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src={userData.photo}
                />
              </div>
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder={
                    comments.length == 0
                      ? "Be the first to Comment..!"
                      : "Write a Comment..!"
                  }
                  className="mx-2 rounded-3xl w-full p-3 bg-slate-200 focus:outline-main placeholder:font-[poppins] placeholder:text-slate-600"
                />
                <i className="text-main text-lg fa-regular fa-paper-plane absolute end-0 top-[20px] mx-2 cursor-pointer"></i>
              </div>
            </div>
          </div>
        ) : (
          <div className="comment-input flex flex-row m-3">
            <div className="w-12 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://linked-posts.routemisr.com/uploads/default-profile.png"
              />
            </div>
            <form className="w-full relative">
              <input
                type="text"
                placeholder={
                  comments.length == 0
                    ? "Be the first to Comment..!"
                    : "Write a Comment..!"
                }
                className="mx-2  rounded-3xl w-full p-3 bg-slate-200 focus:outline-main placeholder:font-[poppins] placeholder:text-slate-600"
              />
              <i className="text-main text-lg fa-regular fa-paper-plane absolute end-0 top-[20px] mx-2 cursor-pointer"></i>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
