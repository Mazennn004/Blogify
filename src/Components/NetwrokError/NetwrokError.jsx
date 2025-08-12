import React, { useEffect } from 'react'
import style from './NetwrokError.module.css'
import { useNavigate } from 'react-router-dom'

export default function NetwrokError() {
 
  const nav=useNavigate();
 
  return (
  <>
 <div className="flex items-center justify-center h-screen flex-col">
        <h1 className="text-8xl text-red-600 font-extrabold poppins">!!!</h1>
        <p className="text-5xl text-black font-bold poppins mt-3 text-center">
          Oops!
        </p>
        <p className="text-slate-700 poppins mt-5 text-center md:w-[50%]">
          Check your Internet Connection, or try again later.
        </p>
        <button onClick={()=>{ nav(`/home`)
        }} className="p-4 mt-4 rounded-4xl bg-red-500 border-0 cursor-pointer hover:bg-red-400 transition-all duration-500  text-white poppins">
          <i className="fa-solid fa-home mx-2"></i> Go Back Home
        </button>
      </div>
  </>
  )
}
