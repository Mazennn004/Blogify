import React from 'react'
import style from './MainLayout.module.css'
import Navbar from './../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import SideBar from './../SideBar/SideBar';

export default function MainLayout() {
  return (
  <>
<Navbar/>
<div className="relative pt-[70px]">
  <Outlet/>
</div>
<SideBar/>
  </>
  )
}
