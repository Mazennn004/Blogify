import React, { createContext, useState } from 'react'

export let themeContext=createContext();
export default function ThemeContextProvider(props) {
   const[theme,setTheme]=useState(localStorage.getItem('theme'));
  return (
    <themeContext.Provider value={{theme,setTheme}}>
        {props.children}
    </themeContext.Provider>
  )
}
