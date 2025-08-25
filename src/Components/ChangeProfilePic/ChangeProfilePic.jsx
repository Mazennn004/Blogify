import React ,{useState,useContext} from 'react'
import style from './ChangeProfilePic.module.css'
import { tokenContext } from "../../Context/TokenContext";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Fade } from 'react-awesome-reveal';
import ChangePassword from './../ChangePassword/ChangePassword';
import { useQueryClient } from '@tanstack/react-query';
import { compressImage, convertImageToJPEG } from '../CreatePost/CreatePost';
export default function ChangeProfilePic() {
  const refresh = useQueryClient();
  const { setShowMenu, userData,setEditProfileToast } = useContext(tokenContext);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [showSaveButton, setShowSaveBtn] = useState(false);
    const[loadingEditProfile,setloadingEditProfile]=useState(false)
    const[changePassword,setChangePassword]=useState(false);
    const pfp=useForm({
    defaultValues:{
      photo:'',
    }
  });
  const{register,handleSubmit}=pfp;
    function handlePicChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
      setShowSaveBtn(true);
    }
  }
  async function changeProfilePic(values) {
    console.log(values);
    
    setloadingEditProfile(true);
    const formData = new FormData();
    const handledImg= await convertImageToJPEG(values.photo[0]);
    const finalImg= await compressImage(handledImg);
    formData.append("photo", finalImg);
   try{
    const {data}=await axios.put('https://linked-posts.routemisr.com/users/upload-photo',formData,{
      headers:{
        token:localStorage.getItem('token'),
      }
    })
    if(data.message==='success'){
      setloadingEditProfile(false);
      setShowMenu(false);
      refresh.invalidateQueries({queryKey:['getUserData'],refetchType:'active'});
      setEditProfileToast({visible:true,msg:'Profile Picture Updated',status:'success'});
      setTimeout(() => {
        setEditProfileToast({visible:false,msg:'',status:''});
      }, 3000);
    }
   }catch(err){
    console.log(err);
    setEditProfileToast({visible:true,msg:'Error Updating Profile Picture',status:'error'});
    setTimeout(() => {
      setEditProfileToast({visible:false,msg:'',status:''});
    }, 3000);
    setloadingEditProfile(false);
    setShowMenu(false);

   }
    

  }
  return (
  <>
 {
  changePassword ? <ChangePassword setEditProfileToast={setEditProfileToast} userData={userData} setChangePassword={setChangePassword}/> :<Fade direction='left'>
  <form onSubmit={handleSubmit(changeProfilePic)} className="row">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
              <input
                {...register("photo",{onChange:(e)=>handlePicChange(e)})}
                type="file"
                id="profilePic"
                className="hidden"
                accept="image/*"
              />
              <label htmlFor="profilePic">
                <div
                  className="avatar cursor-pointer "
                  title="Change Profile Picture"
                >
                  <div className="ring-main ring-offset-base-100 w-24 hover:bg-[rgba(0,0,0,0.6)]  transition-all duration-300 rounded-full ring-2 ring-offset-2">
                    <img
                      src={
                        profilePicPreview ? profilePicPreview : userData.photo
                      }
                      alt="profile-pic"
                    />
                  </div>
                </div>
              </label>
              <span className="poppins text-md font-light text-center text-slate-500 mt-3">
                @{userData.name.split(" ").pop().toLowerCase()}
              </span>
            </div>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend poppins">
                Account Details
              </legend>

              <label className="label">Name</label>
              <input
                readOnly={true}
                type="text"
                className="input cursor-not-allowed placeholder:text-white"
                placeholder={userData.name}
                value={userData.name}
              />

              <label className="label">ID</label>
              <input
                readOnly={true}
                type="text"
                className="input cursor-not-allowed placeholder:text-white"
                placeholder={userData._id}
                value={userData._id}
              />

              <label className="label poppins">Email</label>
              <input
                value={userData.email}
                readOnly={true}
                type="text"
                className="input cursor-not-allowed placeholder:text-white"
                placeholder={userData.email}
              />
              <span onClick={()=>{setChangePassword(true)}} className="text-slate-500 text-sm mt-5 poppins hover:underline cursor-pointer">
                Change Password
              </span>
            </fieldset>
            {showSaveButton && (
              <button className="p-2 mt-5 w-full bg-main text-white rounded-lg poppins font-semibold cursor-pointer hover:bg-[#2563eb] transition-all duration-300">
               { loadingEditProfile? <i className="fa-solid fa-spinner fa-spin"></i>:'Save Changes'}
              </button>
            )}
          </form>
 </Fade>
 }
  </>
  )
}
