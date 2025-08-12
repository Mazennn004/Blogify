import { createContext, useState } from "react";

export let tokenContext = createContext();


export default function TokenContextProvider(props) {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState({});

  return (
    <tokenContext.Provider value={{ isAuth, setIsAuth, userData, setUserData }}>
      {props.children}
    </tokenContext.Provider>
  );
}
