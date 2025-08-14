import { createContext, useState } from "react";

export let tokenContext = createContext();


export default function TokenContextProvider(props) {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState({});
  const[showMenu,setShowMenu]=useState(false);

  return (
    <tokenContext.Provider value={{ isAuth, setIsAuth, userData, setUserData,showMenu ,setShowMenu}}>
      {props.children}
    </tokenContext.Provider>
  );
}
