import React, { useContext, useState } from "react";
import style from "./Home.module.css";
import { useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { tokenContext } from "../../Context/TokenContext";
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
      .get("https://linked-posts.routemisr.com/posts?page=146", {
        headers: { token: localStorage.getItem("token") },
        timeout: 20000,
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
                <div
                  key={p._id}
                  className="flex w-full flex-col gap-4 rounded-2xl shadow-md  "
                >
                  {" "}
                  {/*Card Post*/}
                  <Link to={`singlepost/${p._id}`}>
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
                        <img
                          src={p.image}
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
                          {p.comments.length}
                        </li>
                        <li>
                          <span to={`singlepost/${p._id}`}>
                            <i className="fa-regular fa-comment mx-1 text-lg cursor-pointer hover:text-main transition-all duration-300 hover:scale-[105%]"></i>
                            {p.comments.length}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </Link>
                  {p.comments.length != 0 ? (
                    <div className="p-5">
                      <span className="poppins text-lg font-bold">
                        Comments (
                        {p.comments.length <= 2 ? p.comments.length : "2"})
                      </span>
                      {p.comments.length > 2 ? (
                        <>
                          <div className="chat chat-start">
                            <div className="chat-image avatar">
                              <div className="w-10 rounded-full">
                                <img
                                  alt="Tailwind CSS chat bubble component"
                                  src="https://linked-posts.routemisr.com/uploads/default-profile.png"
                                />
                              </div>
                            </div>
                            <div className="chat-bubble rounded-2xl poppins w-[90%] relative">
                              {p.comments[0].commentCreator._id ==
                              userData._id ? (
                                <span className="absolute end-0 top-0 p-2">
                                  <i className="fa-solid fa-ellipsis text-md text-slate-600"></i>
                                </span>
                              ) : (
                                ""
                              )}
                              <div className="flex flex-col gap-2 ">
                                <span className="poppins font-bold ">
                                  {p.comments[0].commentCreator.name}
                                </span>
                                <span className="poppins font-light text-slate-500">
                                  {p.comments[0].content}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="chat chat-start">
                            <div className="chat-image avatar">
                              <div className="w-10 rounded-full">
                                <img
                                  alt="Tailwind CSS chat bubble component"
                                  src="https://linked-posts.routemisr.com/uploads/default-profile.png"
                                />
                              </div>
                            </div>
                            <div className="chat-bubble rounded-2xl poppins w-[90%] relative">
                              {p.comments[1].commentCreator._id ==
                              userData._id ? (
                                <span className="absolute end-0 top-0 p-2">
                                  <i className="fa-solid fa-ellipsis text-md text-slate-600"></i>
                                </span>
                              ) : (
                                ""
                              )}
                              <div className="flex flex-col gap-2">
                                <span className="poppins font-bold">
                                  {p.comments[1].commentCreator.name}
                                </span>
                                <span className="poppins font-light text-slate-500">
                                  {p.comments[1].content}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        p.comments.map((c, i) => {
                          return (
                            <div key={i} className="chat chat-start">
                              <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                  <img
                                    alt="Tailwind CSS chat bubble component"
                                    src="https://linked-posts.routemisr.com/uploads/default-profile.png"
                                  />
                                </div>
                              </div>
                              <div className="chat-bubble rounded-2xl poppins w-[90%] relative">
                                {c.commentCreator._id == userData._id ? (
                                  <span className="absolute end-0 top-0 p-2">
                                    <i className="fa-solid fa-ellipsis text-md text-slate-600"></i>
                                  </span>
                                ) : (
                                  ""
                                )}
                                <div className="flex flex-col gap-2">
                                  <span className="poppins font-bold">
                                    {c.commentCreator.name}
                                  </span>
                                  <span className="poppins font-light text-slate-500 overflow-clip">
                                    {c.content}
                                  </span>
                                </div>
                              </div>
                            </div>
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
                              p.comments.length == 0
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
                      <div className="w-full relative">
                        <input
                          type="text"
                          placeholder={
                            p.comments.length == 0
                              ? "Be the first to Comment..!"
                              : "Write a Comment..!"
                          }
                          className="mx-2  rounded-3xl w-full p-3 bg-slate-200 focus:outline-main placeholder:font-[poppins] placeholder:text-slate-600"
                        />
                        <i className="text-main text-lg fa-regular fa-paper-plane absolute end-0 top-[20px] mx-2 cursor-pointer"></i>
                      </div>
                    </div>
                  )}
                </div>
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
