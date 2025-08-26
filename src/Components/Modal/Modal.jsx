import React from "react";
import style from "./Modal.module.css";
import CreatePost from "./../CreatePost/CreatePost";
import UpdatePost from "./../UpdatePost/UpdatePost";
import EditProfile from './../EditProfile/EditProfile';
import UserPostPhoto from './../UserPostPhoto/UserPostPhoto';
export default function Modal({ target ,data}) {
  if(target==="viewUserPostImage"){
    return (
      <>
      <UserPostPhoto img={data}/>
      </>
    )
  }
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
