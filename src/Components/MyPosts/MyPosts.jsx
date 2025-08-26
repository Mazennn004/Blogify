import React , { useContext, useState }from 'react'
import style from './MyPosts.module.css'
import { tokenContext } from "../../Context/TokenContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Post from "../Post/Post";
import { useQuery } from "@tanstack/react-query";
export default function MyPosts() {
  const { isAuth} = useContext(tokenContext);
  function getUserPosts(token) {
    return axios.get(
      "https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts?limit=10",
      {
        headers: {
          token: token,
        },
      }
    );
  }
    const nav = useNavigate();
      let { data, isLoading, isError } = useQuery({
    queryKey: ["userPosts"],
    queryFn: () => {
      return getUserPosts(isAuth);
    },
    retry:1,
    select:(data)=>data?.data?.posts.reverse()
  });
    if (isError) {
    nav("/home/networkerror");
  }
  return (
  <div className='md:w-[80%] md:mx-auto flex flex-col gap-3'>
 {isLoading && (
            <div className="flex w-full flex-col gap-4 rounded-4xl p-5 shadow-md bg-white dark:bg-slate-900">
              {" "}
              {/*Card */}
              <div className="flex items-center gap-4">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full dark:bg-slate-600"></div>
                <div className="flex flex-col gap-4">
                  <div className="skeleton h-4 w-20 dark:bg-slate-600"></div>
                  <div className="skeleton h-4 w-28 dark:bg-slate-600"></div>
                </div>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="skeleton h-4 w-[100%] dark:bg-slate-600"></div>
                <div className="skeleton h-4 w-1/2 dark:bg-slate-600"></div>
              </div>
              <div className="skeleton h-80 w-full dark:bg-slate-600"></div>
            </div>
          )}
          {data?.length === 0 ? (
            <div className="flex justify-center">
              <div>
                <span className="text-main text-4xl poppins font-bold">
                  No Posts Yet !
                </span>
                <p className="text-slate-500 poppins font-light text-center">
                  Say Hi to our Community!
                </p>
              </div>
            </div>
          ) : (data?.map((p) => {
              return <Post key={p._id} data={p} />;
            })
          )}
  </div>
  )
}
