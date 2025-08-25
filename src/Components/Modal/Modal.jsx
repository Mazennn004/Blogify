import React from "react";
import style from "./Modal.module.css";
import CreatePost from "./../CreatePost/CreatePost";
import UpdatePost from "./../UpdatePost/UpdatePost";
import EditProfile from './../EditProfile/EditProfile';
export default function Modal({ target }) {
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
        <UpdatePost />
      </>
    );
  }
  if(target ==='editProfile'){
    return (<>
    <EditProfile/>
    </>)
  }
}
