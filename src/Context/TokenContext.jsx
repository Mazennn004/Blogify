import { createContext, useState } from "react";

export let tokenContext = createContext();


export default function TokenContextProvider(props) {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState({});
  const[editProfileToast,setEditProfileToast]=useState({visible:false,msg:'',status:''});
  const[showMenu,setShowMenu]=useState({isShow:false,target:''});

  return (
    <tokenContext.Provider value={{ isAuth, setIsAuth, userData, setUserData,showMenu ,setShowMenu,editProfileToast,setEditProfileToast}}>
      {props.children}
    </tokenContext.Provider>
  );
}
