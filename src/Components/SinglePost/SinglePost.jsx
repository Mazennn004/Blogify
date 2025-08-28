import React, { useContext } from "react";
import style from "./SinglePost.module.css";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { shortFormat } from "./../Home/Home";
import { tokenContext } from "../../Context/TokenContext";
import { useForm } from "react-hook-form";
import Comment from "../Comment/Comment";
import Toast from "../Toast/Toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const query = useQueryClient();
  const [isPosted, setisPosted] = useState(false);
  const [Error, setIsError] = useState({
    status: false,
    msg: "",
  });
  const [Loading, setIsLoading] = useState(false);
  const { userData, showMenu, setShowMenu,setCreatePostToast } = useContext(tokenContext);
  const nav = useNavigate();
  const form = useForm({
    defaultValues: {
      content: "",
      post: `${id}`,
    },
  });

  let { register, handleSubmit } = form;

  function getSinglePost(pid) {
    return axios.get(`https://linked-posts.routemisr.com/posts/${pid}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }
  async function postComment(value) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/comments",
        value,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.message === "success") {
        form.reset();
        setIsLoading(false);
        query.invalidateQueries({
          queryKey: ["singlePost"],
          refetchType: "active",
        });
        setisPosted(true);
        setTimeout(() => {
          setisPosted(false);
        }, 3000);
      }
    } catch (error) {
      console.log("error posting comment", error.message);
      setIsLoading(false);
      setIsError({
        status: true,
        msg: `${error.response.data.error}`,
      });
      setTimeout(() => {
        setIsError({
          status: false,
          msg: "",
        });
      }, 1000);
    }
  }
   async function deletePost(){
    try{
      const {data}=await axios.delete(`https://linked-posts.routemisr.com/posts/${id}`,{
        headers:{
          token:localStorage.getItem('token'),
        }
      })
      if(data.message==='success'){
        nav('/home');
        setCreatePostToast({visible:true,msg:'Post Deleted successfully',status:'success'});
        setTimeout(()=>{
           setCreatePostToast({visible:false,msg:'',status:''});
        },3000);
        query.invalidateQueries({queryKey:['getPosts'],refetchType:'active'});
        query.invalidateQueries({queryKey:['userPosts'],refetchType:'active'});
      }
     
    }catch(err){
      console.error(err);
       setCreatePostToast({visible:true,msg:'Could not Delete Post',status:'error'});
        setTimeout(()=>{
           setCreatePostToast({visible:false,msg:'',status:''});
        },3000);
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["singlePost"],
    queryFn: () => getSinglePost(id),
    select: (data) => data?.data?.post,
  });
  if(isLoading){
    return(
      
        <div className=" w-full md:w-[50%] mx-auto m-10 p-5 flex flex-col gap-10 md:pb-[100px]">
          <div className="flex w-full flex-col gap-4 rounded-4xl p-5 shadow-md bg-white dark:bg-slate-900">
            {" "}
            {/*Card Post*/}
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full dark:bg-slate-600"></div>{" "}
              {/*profile image */}
              <div className="flex flex-col gap-4 ">
                <div className="skeleton h-4 w-20 dark:bg-slate-600"></div> {/* Name */}
                <div className="skeleton h-4 w-28 dark:bg-slate-600"></div> {/* @name*/}
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              {/*Post Content*/}
              <div className="skeleton h-4 w-[100%] dark:bg-slate-600"></div>
              <div className="skeleton h-4 w-1/2 dark:bg-slate-600"></div>
            </div>
            <div className="skeleton h-80 w-full dark:bg-slate-600"></div> {/* Post image*/}
          </div>
        </div>
      
    )

  }

  if (isError) {
    nav("/home/networkerror");
  }
  return (
    <>
      {isPosted ? (
        <Toast msg={`comment sent succesfully`} status={"success"} />
      ) : Error.status ? (
        <Toast msg={Error.msg} status={"error"} />
      ) : (
        ""
      )}

      <div  className=" w-full md:w-[50%] mx-auto m-10 p-5 flex flex-col gap-10 md:pb-[300px]">
        <div
          key={data?._id}
          className="flex w-full flex-col gap-4 rounded-2xl shadow-md bg-white dark:bg-slate-900 dark:text-white "
        >
          <input
            type="text"
            hidden
            className="hidden"
            {...register("post")}
            value={`${data?._id}`}
          />{" "}
          {/*Card Post*/}
          <div  className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                <img
                  src={data?.user.photo}
                  className="h-16 w-16 shrink-0 rounded-full"
                  alt="profile-pic"
                />{" "}
                {/*profile image */}
                <div className="flex flex-col">
                  <h2 className="poppins font-bold">{data?.user.name}</h2>{" "}
                  {/* Name */}
                  <div className="poppins mt-0 text-slate-400 text-sm flex gap-1">
                    <span>@{data?.user.name.split(" ").pop()} .</span>
                    <span> {shortFormat(data?.createdAt)}</span>
                  </div>{" "}
                  {/* @name*/}
                </div>
              </div>
               {userData._id == data?.user._id ? (
              <div className="dropdown dropdown-top">
                <div tabIndex={0} role="button" className="cursor-pointer m-1">
                  <i className="fa-solid fa-ellipsis text-slate-400 text-lg"></i>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm dark:text-slate-600"
                >
                  <li onClick={()=>{setShowMenu({isShow:true,target:'updatePost',data:data})
                  
                  }}>
                    <span className="poppins"><i className="fa-solid fa-edit text-md mx-2 text-main"></i> Edit</span>
                  </li>
                  <li onClick={()=>{deletePost();
                  }}>
                     <span className="poppins"><i className="fa-solid fa-trash text-md mx-2 text-red-400"></i> Delete</span>
                  </li>
                </ul>
              </div>
            ) : (
              ""
            )}
            </div>
            <div className="flex flex-col gap-4 ">
              {/*Post Content*/}
              <div className="p-2 w-[100%]">
                <p className="poppins text-lg font-light overflow-clip">
                  {data?.body}
                </p>
              </div>
            </div>
            {data?.image ? (
              <img
                src={data?.image}
                className="w-full rounded-3xl"
                loading="lazy"
                alt="post-image"
              />
            ) : (
              ""
            )}
          </div>
          <div className="bg-slate-100 p-3 dark:bg-slate-700">
            <ul className="poppins p-2 text-slate-500 flex gap-5 ">
              <li>
                <i className="fa-regular fa-heart mx-1 text-lg cursor-pointer hover:text-red-600 hover:scale-[105%] transition-all duration-300"></i>
                {data?.comments.length}
              </li>
              <li>
                <span>
                  <i className="fa-regular fa-comment mx-1 text-lg cursor-pointer hover:text-main transition-all duration-300 hover:scale-[105%]"></i>
                  {data?.comments.length}
                </span>
              </li>
            </ul>
          </div>
          <div className="comment-input flex flex-row mt-5 p-3">
            <div className="w-12 h-12 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src={userData.photo}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <form
              onSubmit={handleSubmit(postComment)}
              className="w-full relative"
            >
              <input
                {...register("content")}
                type="text"
                placeholder={
                  data?.comments.length == 0
                    ? "Be the first to Comment..!"
                    : "Write a Comment..!"
                }
                className="mx-2 rounded-3xl w-full p-3 bg-slate-200 dark:bg-slate-800 focus:outline-main placeholder:font-[poppins] placeholder:text-slate-600 dark:placeholder:text-slate-300"
              />
              <input
                type="text"
                className="hidden"
                {...register("post")}
                value={`${post._id}`}
              />

              <button>
                {Loading ? (
                  <i className="fa-solid fa-spinner fa-spin absolute end-0 top-[20px]"></i>
                ) : (
                  <i className="text-main text-lg fa-regular fa-paper-plane absolute end-0 top-[20px] mx-2 cursor-pointer"></i>
                )}
              </button>
            </form>
          </div>
          {data?.comments.length != 0 ? (
            <div className="p-5">
              <span className="poppins text-lg font-bold">
                Comments ({data?.comments.length})
              </span>
              {data?.comments.map((c, i) => {
                return <Comment key={i} data={c} />;
              })}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      
    </>
  );
}
