import React, { useContext, useState } from "react";
import style from "./Home.module.css";
import { useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { tokenContext } from "../../Context/TokenContext";
import Post from './../Post/Post';
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
  const { userData } = useContext(tokenContext);
  const [posts, setPosts] = useState([]);
  const nav = useNavigate();
  function getAllPosts() {
    axios
      .get("https://linked-posts.routemisr.com/posts?page=193", {
        headers: { token: localStorage.getItem("token") },
        timeout:30000,
      })
      .then(({ data }) => {
        if (data.posts.length === 0) {
          nav("/home/networkerror");
          console.error("error Feteching Data, length===0");
        } else if (data.message === "success") {
          setPosts(data.posts.reverse());
        }
      })
      .catch((error) => {
        console.error(
          error,
          error.code ? error.code : "",
          error.message ? error.message : ""
        );
        nav("/home/networkerror");
      });
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      <div className=" w-full md:w-[50%] mx-auto m-10 p-5 flex flex-col gap-10 ">
        {posts.length != 0
          ? posts.map((p) => {
              return (
              <Post key={p.id} data={p} />
              );
            })
          : loadingCards.map((l, i) => {
              return (
                <div
                  key={i}
                  className="flex w-full flex-col gap-4 rounded-4xl p-5 shadow-md"
                >
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
              );
            })}
      </div>
    </>
  );
}
