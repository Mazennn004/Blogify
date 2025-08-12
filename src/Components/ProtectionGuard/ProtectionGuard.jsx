import React from 'react'
import style from './ProtectionGuard.module.css'
import { Navigate } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
export default function ProtectionGuard(props) {
 if(localStorage.getItem('token')){
return (props.children)
 }
 else{
 return <NotFound direction={'/'}/>
 }
  
}
