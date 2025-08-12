import React from 'react'
import style from './SideBar.module.css'
import { Link, NavLink } from 'react-router-dom';
export default function SideBar() {
  return (
  <>
  <div className="md:hidden dock dock-md fixed bottom-0">
  <Link to='' end='true' >
    <button>
    <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt"><polyline points="1 11 12 2 23 11" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></polyline><path d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2"></path><line x1="12" y1="22" x2="12" y2="18" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2"></line></g></svg>
     <span className="dock-label">Home</span>
  </button>
  </Link>
  
  <button className="p-5 bg-main rounded-full h-[50px] w-[50px]">
   
  <i className='fa-solid fa-plus text-3xl l text-white'></i>
  </button>
  
 <Link to='profile' >
   <button className='flex flex-col'>
    <i className='fa-regular fa-user text-md my-0.5'></i>
   
       <span className="dock-label text-start">Profile</span>
    
   
  </button>
 </Link>
</div>
 <nav className='hidden md:flex md:flex-col fixed start-0 top-0 bottom-0 p-5  w-[20%] shadow'>
  <ul className='flex flex-col gap-3 pt-[70px] '>
    <li >
      <NavLink to='' end className=' block w-[80%] rounded-md hover:bg-slate-300 transition-all duration-300 text-main text-lg  p-2 '><i className='fa-regular fa-house mx-3'></i>Home</NavLink>
    </li>
     <li >
      <NavLink to='profile' className='block w-[80%] rounded-md hover:bg-slate-300 transition-all duration-300 text-main text-lg p-2'><i className='fa-regular fa-user mx-3'></i>Profile</NavLink>
    </li>
  </ul>
 </nav>
  </>
  )
}
