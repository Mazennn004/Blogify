import React, { useContext, useState } from 'react'
import style from './ChangePassword.module.css'
import { Fade } from 'react-awesome-reveal'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { tokenContext } from '../../Context/TokenContext'
import axios from 'axios'

export default function ChangePassword({setChangePassword,userData,setEditProfileToast}) {
  const{setIsAuth,setShowMenu}=useContext(tokenContext);
  const[changePassLoading,setChangePassLoading]=useState(false);
  const[responseError,setResponseError]=useState({isApiError:false,msg:''});
  const[newPasswordInput,setNewPassword]=useState('');
const schema=z.object({
  password:z.string().min(1,'Old Password is required *').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'Invalid Password *'),
  newPassword:z.string().regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character *").refine((val)=>{return val===newPasswordInput},'Passwords do not match *')
});
const changePass= useForm({
  defaultValues:{
  password:"",
  newPassword:""
  },
  resolver:zodResolver(schema),
 })
  async function confirmChangePassword(values){
    setChangePassLoading(true);
  try{
const{data}=await axios.patch(`https://linked-posts.routemisr.com/users/change-password`,values,{
    headers:{
      token:localStorage.getItem('token'),
    }
  })
  if(data.message==='success'){
     setIsAuth(data.token);
  localStorage.setItem('token',data.token);
   setChangePassLoading(false);
  setShowMenu({isShow:false,target:''});
  setEditProfileToast({visible:true,msg:'Password Changed Successfully',status:'success'});
  setTimeout(()=>{ setEditProfileToast({visible:false,msg:'',status:''});},3000);
  }
  }catch(err){
     setChangePassLoading(false);
    setResponseError({isApiError:true,msg:`${err.response.data.error}`});
  }

 }
 const{register,handleSubmit,formState}=changePass;

 
  return (
  <Fade direction='right'>
    <form onSubmit={handleSubmit(confirmChangePassword)} className='flex justify-center items-center'>
  <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  <legend className="fieldset-legend">Change Password</legend>

  <label className="label">Old Password</label>
  <input {...register('password')} type="password" className={`input ${formState.errors.password && 'focus:outline-red-400 border-red-400'}`} placeholder="Old Password" />
{formState.errors.password && <span className='text-red-400 poppins mt-2 text-sm'>{formState.errors.password.message}</span>}
  <label className="label">New Password</label>
  <input {...register('newPassword')} type="password" className={`input ${formState.errors.newPassword && 'focus:outline-red-400 border-red-400'}`}  placeholder="New Password" />
{formState.errors.newPassword && <span className='text-red-400 poppins mt-2 text-sm'>{formState.errors.newPassword.message}</span>}
  <label className="label">Confirm New Password</label>
  <input onChange={(e)=>{setNewPassword(e.target.value)}} type="password" className={`input`} placeholder="Confirm New Password" />
{userData.passwordChangedAt  &&   <span className='my-3 poppins text-slate-400'>Last updaated on {new Date(userData.passwordChangedAt).toLocaleDateString()}</span>}
  <span onClick={()=>{setChangePassword(false)}} className='text-slate-400 text-md hover:underline text-center mt-4 cursor-pointer'>Back</span>
 { responseError.isApiError && <span className='text-red-400 capitalize text-center poppins mt-2 text-sm'>{responseError.msg} *</span>}
  <button className='p-4 bg-main poppins rounded-xl  text-white cursor-pointer mt-5 hover:bg-[#2563eb] transition-all duration-300'>
    {changePassLoading ? <i className="fa-solid fa-spinner fa-spin  cursor-wait"></i> : 'Change Password'}
  </button>
  
</fieldset>
  </form>
  </Fade>
  )
}
