import React, { useContext, useState ,useRef} from "react";
import style from "./Home.module.css";
import { useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link, useNavigate } from "react-router-dom";
import { tokenContext } from "../../Context/TokenContext";
import Post from "./../Post/Post";
import { useQuery,useInfiniteQuery } from "@tanstack/react-query";
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

  const LIMIT = 10; // change per page size

  // fetch function for a given pageParam
  async function fetchPosts({ pageParam = 1 }) {
    const res = await axios.get(`https://linked-posts.routemisr.com/posts`, {
      headers: {
        token: localStorage.getItem("token"),
      },
      params: {
        limit: LIMIT,
        page: pageParam,
        sort: "-createdAt",
      },
    });
    // normalize result to include nextPage
    const payload = res.data;
    // try to infer next page: if API returns page/totalPages use them; otherwise derive from posts length
    const currentPage = payload.page ?? pageParam;
    let nextPage = undefined;
    if (payload.totalPages != null) {
      nextPage = currentPage < payload.totalPages ? currentPage + 1 : undefined;
    } else {
      nextPage = (payload.posts?.length ?? 0) === LIMIT ? currentPage + 1 : undefined;
    }
    return { posts: payload.posts ?? [], nextPage };
  }

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getPosts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    retry: 1,
  });

  // flatten pages
  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  // intersection observer sentinel
  const loadMoreRef = useRef(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, hasNextPage, isFetchingNextPage]);

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
        {posts.map((p) => {
          return <Post key={p._id} data={p} />;
        })}

        {/* sentinel element observed by IntersectionObserver */}
        <div ref={loadMoreRef} style={{ height: 1 }} />

        {/* optional loader / manual load more */}
        {isFetchingNextPage && (
          <div className="text-center py-4"><i className="fa-solid fa-spinner fa-spin"></i></div>
        )}
        {!hasNextPage && posts.length > 0 && (
          <div className="text-center py-4 text-slate-500">No more posts</div>
        )}
      </div>
    </>
  );
}
// ...existing code...
