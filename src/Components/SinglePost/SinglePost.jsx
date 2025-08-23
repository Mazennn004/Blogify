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
  const { userData, showMenu, setShowMenu } = useContext(tokenContext);
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["singlePost"],
    queryFn: () => getSinglePost(id),
    select: (data) => data?.data?.post,
  });

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

      <div className=" w-full md:w-[50%] mx-auto m-10 p-5 flex flex-col gap-10 ">
        <div
          key={data?._id}
          className="flex w-full flex-col gap-4 rounded-2xl shadow-md bg-white"
        >
          <input
            type="text"
            hidden
            className="hidden"
            {...register("post")}
            value={`${data?._id}`}
          />{" "}
          {/*Card Post*/}
          <div className="p-5">
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
              <div>
                <i className="fa-solid fa-ellipsis cursor-pointer text-slate-500 text-lg"></i>
              </div>
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
          <div className="bg-slate-100 p-3 ">
            <ul className="poppins p-2 text-slate-500 flex gap-5">
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
            <div className="w-12 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src={userData.photo}
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
                className="mx-2 rounded-3xl w-full p-3 bg-slate-200 focus:outline-main placeholder:font-[poppins] placeholder:text-slate-600"
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

      {isLoading && (
        <div className=" w-full md:w-[50%] mx-auto m-10 p-5 flex flex-col gap-10 ">
          <div className="flex w-full flex-col gap-4 rounded-4xl p-5 shadow-md bg-white">
            {" "}
            {/*Card Post*/}
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>{" "}
              {/*profile image */}
              <div className="flex flex-col gap-4 ">
                <div className="skeleton h-4 w-20"></div> {/* Name */}
                <div className="skeleton h-4 w-28"></div> {/* @name*/}
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              {/*Post Content*/}
              <div className="skeleton h-4 w-[100%]"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
            <div className="skeleton h-80 w-full"></div> {/* Post image*/}
          </div>
        </div>
      )}
    </>
  );
}
