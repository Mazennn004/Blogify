import React, { useContext } from 'react'
import style from './CreatePost.module.css'
import { tokenContext } from '../../Context/TokenContext';
export default function CreatePost() {
  const{userData,setShowMenu}=useContext(tokenContext);
  return (
  <>
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)]  flex justify-center items-center  z-50">
          <div className=" w-[80%] md:w-1/2 p-5 bg-white rounded-2xl">
            <div className="border-b-2 border-slate-200 flex justify-between p-2">
              <span className="poppins text-lg font-bold">Create Post</span>
              <span>
                <i
                  onClick={() => {
                    setShowMenu({isShow:false,target:''});
                  }}
                  className="fa-solid fa-close text-lg text-black font-light p-2 cursor-pointer"
                ></i>
              </span>
            </div>
            <form>
              <textarea
                placeholder={`What's on your mind, ${userData.name
                  .split(" ")
                  .shift()} ?`}
                className="resize-y w-full h-[100px] outline-0 p-5 placeholder:text-slate-400 placeholder:text-md"
              ></textarea>
              <label htmlFor="imageinput">
                <i className="fa-solid fa-images cursor-pointer m-3 text-lg text-slate-400"></i>
              </label>
              <input
                id="imageinput"
                type="file"
                className="file-input file-input-ghost mx-2"
              />
              <div className="border-t-2 border-slate-200 flex justify-end p-2">
                <button className="rounded-4xl bg-main p-3 cursor-pointer text-white poppins">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
  </>
  )
}
