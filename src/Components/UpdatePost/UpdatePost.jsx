import React, { useContext, useEffect, useState } from "react";
import style from "./UpdatePost.module.css";
import { tokenContext } from "../../Context/TokenContext";
import { useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";
import axios from "axios";
import z, { set } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from "@tanstack/react-query";
import { fi } from "zod/v4/locales";
import { compressImage, convertImageToJPEG } from "../CreatePost/CreatePost";
 
export default function UpdatePost({ data:p }) {

  
  const refetch=useQueryClient();
  const { userData, setShowMenu ,setCreatePostToast } = useContext(tokenContext);
  const [postImagePreview, setPostImagePreview] = useState(false);
  const[updatePostLoading,setUpdatePostLoading]=useState(false);
  const schema=z.object({
    body:z.string().min(3,'Post body is required *'),
    image:z.any().optional(),
  })
  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
   resolver:zodResolver(schema)
  });
  const { handleSubmit, register, formState ,setValue} = form;

  function imagePreview(event) {
    const images = event.target.files[0];
    if (images) {
      setPostImagePreview(URL.createObjectURL(images));
    }
  }
  
  async function updatePost(values) {
    console.log(values);
    
    setUpdatePostLoading(true);
    let { image, body } = values;
  
    const formData=new FormData();
    formData.append('body',body);
    if(image){
    const handledImg = await convertImageToJPEG(image[0]);
    const finalImg = await compressImage(handledImg);
      formData.append('image',finalImg);
    }
    try{
      const{data}=await axios.put(`https://linked-posts.routemisr.com/posts/${p._id}`,formData,{
        headers:{
          token:localStorage.getItem('token'),
        }
      })
      if(data.message==='success'){
      setUpdatePostLoading(false);
     setShowMenu({ isShow: false, target: "" });
     setCreatePostToast({visible:true,msg:'Updated successfully',status:'success'});
     setTimeout(()=>{
      setCreatePostToast({visible:false,msg:'',status:''});
     },3000)
     refetch.invalidateQueries({queryKey:['getPosts'],refetchType:'active'});
     refetch.invalidateQueries({queryKey:['userPosts'],refetchType:'active'});
      refetch.invalidateQueries({queryKey:['singlePost'],refetchType:'active'});
      }
    }catch(err){
    console.log(err);
    
      setUpdatePostLoading(false);
      setShowMenu({ isShow: false, target: "" });
      setCreatePostToast({visible:true,msg:`Error submiting Post, image size maybe large, or type not supported 413`,status:'error'});
       setTimeout(()=>{
      setCreatePostToast({visible:false,msg:'',status:''});
     },3000)
      
    }
  }
useEffect(() => {
  setValue('body',p.body);
  if(p.image){
    setPostImagePreview(p.image);
  }
},[]);
  
  return (
    <>
   
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)]  flex justify-center items-center  z-50">
        <div className=" w-[80%] md:w-1/2 p-5 bg-white rounded-2xl">
          <div className="border-b-2 border-slate-200 flex justify-between p-2">
            <span className="poppins text-lg font-bold">Update Post</span>
            <span>
              <i
                onClick={() => {
                  setShowMenu({ isShow: false, target: "" });
                }}
                className="fa-solid fa-close text-lg text-black font-light p-2 cursor-pointer"
              ></i>
            </span>
          </div>
          <form onSubmit={handleSubmit(updatePost)}>
            <textarea
              {...register("body")}
              placeholder={`${p.body}`}
              className={`${formState.errors.body && 'border-[1px] rounded-xl border-red-500'} resize-y w-full h-[100px] outline-0 p-5 placeholder:text-slate-400 placeholder:text-md`}
            ></textarea>
            {formState.errors.body && <p className="text-red-500 poppins text-light text-sm ml-2">{formState.errors.body.message}</p>}
            <label htmlFor="imageinput">
              <i className="fa-solid fa-images cursor-pointer m-3 text-lg text-slate-400"></i>
            </label>
            <input
              type="file"
              id="imageinput"
              className="hidden"
              accept="image/*"
              {...register('image', {
                onChange: (e) => {
                  imagePreview(e);
                
                  
                },
              })}
            />
            {postImagePreview && (
              <div className="w-[50%] mb-2 max-h-[500px] overflow-y-hidden rounded-2xl shadow m-auto post-preview">
                <img
                  src={postImagePreview}
                  alt="post-preview"
                  className="w-full"
                />
              </div>
            )
               }


            <div className="border-t-2 border-slate-200 flex justify-end p-2">
              <button className="rounded-4xl bg-main p-3 cursor-pointer text-white poppins">
                {updatePostLoading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
