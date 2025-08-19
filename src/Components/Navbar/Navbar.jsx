import React, { useContext } from 'react'
import style from './Navbar.module.css'
import { Link } from 'react-router-dom'
import { tokenContext } from '../../Context/TokenContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';



export default function Navbar() {
  const{isAuth,setIsAuth,userData,setUserData,showMenu,setShowMenu}=useContext(tokenContext);
  const nav=useNavigate();
  function logout(){
    localStorage.removeItem('token');
    setIsAuth(null);
    nav('/');
   
    
  }
 function getUserData(){
  axios.get('https://linked-posts.routemisr.com/users/profile-data',{
    headers:{
      token:isAuth,
    }
  }).then(({data})=>{
    setUserData(data.user);
  }).catch(()=>{console.log('error');
  })
 }
  useEffect(()=>{
getUserData();
  },[])


 
  return (
  <>
  <div className={`${ showMenu ? "blur":"" } navbar  bg-base-100 shadow-sm fixed top-0 z-10`}>
  <div className="flex-1">
    <Link to='' className=" poppins text-3xl font-bold text-main md:mx-16 cursor-pointer">Blogify</Link>
  </div>
  <div className="flex gap-2 md:mx-16">
    <button onClick={()=>{setShowMenu(true)}} className='hidden md:flex bg-[#4F39F6] p-3 rounded-4xl text-white mx-4 poppins cursor-pointer hover:bg-violet-800 transition-all duration-300'><i className='fa-solid fa-plus-circle mx-1.5 text-lg mt-1'></i>Create Post</button>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          {userData.photo ?  <img src={userData.photo} alt='user-profile' className="h-32 w-32 rounded-full"/> :  <div className="skeleton h-32 w-32 rounded-full"></div>}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-main">
        <li>
          <Link to='profile'>Profile</Link>
        </li>
        <li onClick={()=>{logout()}}><Link>Logout</Link></li>
      </ul>
    </div>
  </div>
</div>
{
  showMenu ? <div className='fixed inset-0 bg-[rgba(0,0,0,0.1)]  flex justify-center items-center  z-50'>
<div className=" w-[80%] md:w-1/2 p-5 bg-white rounded-2xl">
  <div className='border-b-2 border-slate-200 flex justify-between p-2'>
    <span className='poppins text-lg font-bold'>
      Create Post
    </span>
    <span>
      <i onClick={()=>{setShowMenu(false)}} className='fa-solid fa-close text-lg text-black font-light p-2 cursor-pointer'></i>
    </span>
  </div>
  <form >
    <textarea placeholder={`What's on your mind, ${userData.name.split(" ").shift()} ?`} className='resize-y w-full h-[100px] outline-0 p-5 placeholder:text-slate-400 placeholder:text-md'></textarea>
    <label htmlFor="imageinput">
      <i className='fa-solid fa-images cursor-pointer m-3 text-lg text-slate-400'></i>
    </label>
   <input id='imageinput' type="file" className="file-input file-input-ghost mx-2" />
   <div className='border-t-2 border-slate-200 flex justify-end p-2'>
    <button className='rounded-4xl bg-main p-3 cursor-pointer text-white poppins'>
      Post
    </button>
   </div>
  </form>
  
</div>
</div> : ""
}
  </>
  )
}
