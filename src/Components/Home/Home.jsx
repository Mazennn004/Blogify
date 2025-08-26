import React, { useContext, useState } from "react";
import style from "./Home.module.css";
import { useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { tokenContext } from "../../Context/TokenContext";
import Post from "./../Post/Post";
import { useQuery } from "@tanstack/react-query";
dayjs.extend(relativeTime);
export function shortFormat(dateString) {
  const diffSeconds = dayjs().diff(dayjs(dateString), "second");
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = dayjs().diff(dayjs(dateString), "minute");
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = dayjs().diff(dayjs(dateString), "hour");
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = dayjs().diff(dayjs(dateString), "day");
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = dayjs().diff(dayjs(dateString), "week");
  if (diffWeeks < 4) return `${diffWeeks}w ago`;

  const diffMonths = dayjs().diff(dayjs(dateString), "month");
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = dayjs().diff(dayjs(dateString), "year");
  return `${diffYears}y ago`;
}

export default function Home() {
  const loadingCards = [1, 2, 3];

  const nav = useNavigate();

  function getAllPosts() {
    return axios
      .get(`https://linked-posts.routemisr.com/posts?limit=50`, {
        headers: {
          token: localStorage.getItem("token"),
        },
        params:{
          sort:'-createdAt',
        }
      })
      .then((res) => res.data);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    retry:1,
  });

  if (isLoading) {
    return (
      <>
        <div className=" w-full md:w-[50%] mx-auto m-4 p-3 flex flex-col gap-10 ">
          {loadingCards.map((c, i) => {
            return (
              <div
                key={i}
                className="flex w-full flex-col gap-4 rounded-4xl p-5 shadow-md bg-white dark:bg-slate-900"
              >
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
            );
          })}
        </div>
      </>
    );
  }
  if (isError) {
    nav("/home/networkerror");
  }

  return (
    <>
      <div className=" w-full md:w-[50%] mx-auto m-4 p-3 flex flex-col gap-10">
        {data?.posts.map((p) => {
          return <Post key={p._id} data={p} />;
        })}
      </div>
    </>
  );
}
