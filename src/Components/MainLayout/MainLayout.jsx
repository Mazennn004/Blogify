import React, { useContext } from 'react'
import style from './MainLayout.module.css'
import Navbar from './../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import SideBar from './../SideBar/SideBar';
import { tokenContext } from '../../Context/TokenContext';

export default function MainLayout() {
  const{showMenu}=useContext(tokenContext)
  return (
  <>
<Navbar/>
<div  className={`relative pt-[70px] md:pb-1 ${ showMenu.isShow ? "blur":"" }`}>
  <Outlet/>
</div>
<SideBar/>
  </>
  )
}
