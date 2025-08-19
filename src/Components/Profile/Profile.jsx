import React, { useContext, useState } from "react";
import style from "./Profile.module.css";
import { tokenContext } from "../../Context/TokenContext";
import axios from "axios";
import { useEffect } from "react";
import { shortFormat } from "../Home/Home";
import { Link } from "react-router-dom";
import Post from "../Post/Post";
export default function Profile() {
  const { userData, isAuth } = useContext(tokenContext);
  const [userPosts, setUserPosts] = useState([]);
  const [isEmptyPosts, setIsEmptyPosts] = useState(false);
  function getUserPosts(token) {
    axios
      .get(
        "https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts?limit=10",
        {
          headers: {
            token: token,
          },
        }
      )
      .then(({ data }) => {
        if(data.message==='success'&&data.posts.length!=0){
          setUserPosts(data.posts);
        }else{
          setUserPosts(data.posts);
          setIsEmptyPosts(true);
        }
      })
      .catch(() => {
        console.log("error fetching user data");
      });
  }
  useEffect(() => {
    getUserPosts(isAuth);
  }, []);
  return (
    <>
      <div className=" w-full md:w-[75%] ms-auto m-10 p-2 flex flex-col gap-10 ">
        <div className="rounded-2xl shadow ">
          <div className="cover w-full  rounded-2xl h-[30vh] relative">
            <figure className="absolute bottom-[-30px] start-0   mx-5   ">
              {userData.photo ? (
                <img
                  src={userData.photo}
                  alt="pfp"
                  className="bg-slate-100 h-32 w-32 rounded-full"
                />
              ) : (
                <div className="skeleton h-32 w-32 rounded-full"></div>
              )}
            </figure>
          </div>
          <div className="profile-contents m-5 flex justify-between">
            <div className="username mt-10">
              {userData.name ? (
                <span className="font-bold poppins text-2xl">
                  {userData.name}
                </span>
              ) : (
                <div className="skeleton h-4 w-50 mt-10"></div>
              )}
              {userData.name ? (
                <span className="block text-slate-600 font-normal poppins">
                  @{userData.name.split(" ").pop()}
                </span>
              ) : (
                <div className="skeleton h-4 w-28 mt-5 mx-2"></div>
              )}
            </div>
            <div className="settings mt-6">
              <button className="p-2 rounded-3xl cursor-pointer hover:bg-violet-700 transition-all duration-300 bg-main text-white poppins mx-2">
                <i className="fa-solid fa-edit text-white text-md mx-2"></i>Edit
                Profile
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-10">
          <ul className="flex gap-3 border-b border-slate-300">
            <li className="p-3 border-b-2 border-main cursor-pointer">
              <span className="poppins text-lg">My Posts</span>
            </li>
            <li className="p-3 ">
              <span
                title="Currnetly under Develepment"
                className="poppins text-lg cursor-not-allowed"
              >
                Media
              </span>
            </li>
          </ul>
          {userPosts.length != 0 ? (
            userPosts.map((p) => {
              return (
              <Post key={p._id} data={p}/>
              );
            })
          ) : !isEmptyPosts ? (
            <div className="flex w-full flex-col gap-4 rounded-4xl p-5 shadow-md ">
              {" "}
              {/*Card */}
              <div className="flex items-center gap-4">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="flex flex-col gap-4 ">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>
              </div>
              <div className="flex flex-col gap-4 ">
                <div className="skeleton h-4 w-[100%]"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
              <div className="skeleton h-80 w-full"></div>
            </div>
          ): <div className="flex justify-center">
           <div>
             <span className="text-main text-4xl poppins font-bold">
              No Posts Yet !
            </span>
            <p className="text-slate-500 poppins font-light text-center">
              Say Hi to our Community!
            </p>
           </div>
          </div>
          }
        </div>
      </div>
    </>
  );
}
