import React from "react";
import style from "./Modal.module.css";
import CreatePost from "./../CreatePost/CreatePost";
import UpdatePost from "./../UpdatePost/UpdatePost";
import EditProfile from './../EditProfile/EditProfile';
export default function Modal({ target ,data}) {
  
  if (target === "createPost") {
    return (
      <>
        <CreatePost />
      </>
    );
  }
  if (target === "updatePost") {
    return (
      <>
        <UpdatePost data={data}/>
      </>
    );
  }
  if(target ==='editProfile'){
    return (<>
    <EditProfile/>
    </>)
  }
}
