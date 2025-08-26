import React, { useContext, useState } from "react";
import style from "./Comment.module.css";
import { tokenContext } from "../../Context/TokenContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "../Toast/Toast";

export default function Comment({ data: c }) {
  const { userData } = useContext(tokenContext);
  const[editLoading,setEditLoading]=useState(false);
  const [showCommentMenu, setCommentMenu] = useState(false);
  const [showToast, setShowToast] = useState({show:false,status:'',msg:''});
  let refresh = useQueryClient();
  const edit = useForm({
    defaultValues: {
      content: ``,
    },
  });
  const [isEdit, setisEdit] = useState(false);
  const { register, handleSubmit } = edit;
  function updateComment(content) {
    setEditLoading(true);
    axios
      .put(`https://linked-posts.routemisr.com/comments/${c._id}`, content, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        if (data.message === "success") {
          setEditLoading(false);
          setShowToast({show:true,status:'success',msg:'comment updated successfully'});
          setTimeout(() => {
            setShowToast({
              show:false,
              status:'',
              msg:''
            });
          }, 2000);
          setisEdit(false);
          refresh.invalidateQueries({
            queryKey: ["getPosts"],
            refetchType: "active",
          });
          refresh.invalidateQueries({
            queryKey: ["userPosts"],
            refetchType: "active",
          });
          refresh.invalidateQueries({
            queryKey: ["singlePost"],
            refetchType: "active",
          });
        }
      })
      .catch((err) => {
        setEditLoading(false);
        console.log(err);
        setisEdit(false);
           setShowToast({show:true,status:'error',msg:`${err.response.data.error}`});
          setTimeout(() => {
            setShowToast({
              show:false,
              status:'',
              msg:``
            });
          }, 2000);
      });
  }
  function deleteComment(cid) {
  axios.delete(`https://linked-posts.routemisr.com/comments/${cid}`,{
    headers:{
      token:localStorage.getItem('token'),
    }
   }).then(({data})=>{
    if(data.message==='success'){
      setShowToast({show:true,status:'success',msg:'comment deleted successfully'});
          setTimeout(() => {
            setShowToast({
              show:false,
              status:'',
              msg:''
            });
          }, 2000);
        refresh.invalidateQueries({
            queryKey: ["getPosts"],
            refetchType: "active",
          });
          refresh.invalidateQueries({
            queryKey: ["userPosts"],
            refetchType: "active",
          });
          refresh.invalidateQueries({
            queryKey: ["singlePost"],
            refetchType: "active",
          });
    }
   }).catch((err)=>{
    console.error(err);
    setShowToast({show:true,status:'error',msg:`can't delete this comment`});
          setTimeout(() => {
            setShowToast({
              show:false,
              status:'',
              msg:``
            });
          }, 2000);
   })
  }
  return (
    <>
      {showToast.show ? (
        <Toast msg={showToast.msg} status={showToast.status} />
      ) : (
        ""
      )}
      <div
        onClick={() => {
          setCommentMenu(false);
        }}
        className="chat chat-start"
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src="https://linked-posts.routemisr.com/uploads/default-profile.png"
            />
          </div>
        </div>
        <div className="chat-bubble rounded-2xl poppins w-[90%] relative dark:bg-slate-600 dark:text-white">
          {c.commentCreator._id == userData._id ? (
            <span className="absolute end-0 top-0 p-2">
              <i
                onClick={(e) => {
                  setCommentMenu(true);
                  e.stopPropagation();
                }}
                className="fa-solid fa-ellipsis text-md text-slate-600 cursor-pointer dark:text-white"
              ></i>
              {showCommentMenu ? (
                <ul className="menu bg-base-200 rounded-box w-56 absolute top-0 end-[-150px]">
                  <li
                    onClick={() => {
                      deleteComment(c._id);
                    }}
                    className="text-red-400 flex flex-row cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can text-red-400 mx-2"></i>
                    Delete
                  </li>
                  <li
                    onClick={() => {
                      setisEdit(true);
                    }}
                    className="text-main flex flex-row cursor-pointer"
                  >
                    <i className="fa-solid fa-edit mx-2"></i>Edit
                  </li>
                </ul>
              ) : (
                ""
              )}
            </span>
          ) : (
            ""
          )}
          <div className="flex flex-col  gap-2">
            <span className="poppins font-bold">{c.commentCreator.name}</span>
            <span className="poppins font-light text-slate-500 overflow-clip relative dark:text-white">
              {isEdit ? (
                <form onSubmit={handleSubmit(updateComment)} className="w-full">
                  <input
                    {...register("content")}
                    type="text"
                    className="p-1 outline-main rounded poppins placeholder:italic placeholder:text-sm w-full"
                    autoFocus="true"
                    placeholder="Edit your comment"
                  />
                  <button className="absolute end-0 mt-1">
                   {editLoading ? <i className="fa-solid fa-spinner fa-spin  cursor-wait"></i> :  <i className="fa-regular fa-paper-plane text-main  cursor-pointer"></i>}
                  </button>
                  <i
                    onClick={() => {
                      setisEdit(false);
                    }}
                    className="fa-solid fa-close absolute end-0 mx-5 mt-2 cursor-pointer"
                  ></i>
                </form>
              ) : (
                c.content
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
