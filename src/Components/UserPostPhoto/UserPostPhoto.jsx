import React, { useContext } from "react";
import style from "./UserPostPhoto.module.css";
import { tokenContext } from "../../Context/TokenContext";
export default function UserPostPhoto({ img }) {
  const{setShowMenu}=useContext(tokenContext);
  
  return (
    <>
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)]  flex justify-center items-center  z-50">
        <div className=" w-[80%] md:w-1/2  bg-white rounded-2xl relative">
          <span className="absolute top-0 end-0 m-3">
              <i
                onClick={() => {
                  setShowMenu({ isShow: false, target: "" });
                }}
                className="fa-solid fa-close text-lg text-white font-light p-2 cursor-pointer"
              ></i>
            </span>
            <img src={img} alt="PostImage" className="w-full rounded-xl"/>
        </div>
      </div>
    </>
  );
}
