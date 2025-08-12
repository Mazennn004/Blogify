import React from "react";
import style from "./NotFound.module.css";
import { useNavigate } from 'react-router-dom';
export default function NotFound(props) {
  const nav=useNavigate();
 
  
  return (
    <>
      <div className="flex items-center justify-center h-screen flex-col">
        <h1 className="text-8xl text-main font-extrabold poppins">404</h1>
        <p className="text-5xl text-black font-bold poppins mt-3 text-center">
          Lost in the Cosmos?
        </p>
        <p className="text-slate-700 poppins mt-5 text-center md:w-[50%]">
          It looks like this page is floating in the galaxy far, far away, The
          page you are looking for does not exist or have been moved
        </p>
        <button onClick={()=>{ nav(`${props.direction}`)
        }} className="p-4 mt-4 rounded-4xl bg-blue-800 border-0 cursor-pointer hover:bg-main transition-all duration-500  text-white poppins">
          <i className="fa-solid fa-home mx-2"></i> Go Back Home
        </button>
      </div>
    </>
  );
}
