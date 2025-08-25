import { useState, useEffect, useContext } from "react";

import "./App.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login/Login";
import MainLayout from "./Components/MainLayout/MainLayout";
import SignUp from "./Components/SignUp/SignUp";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import NotFound from "./Components/NotFound/NotFound";
import ProtectionGuard from "./Components/ProtectionGuard/ProtectionGuard";
import { tokenContext } from "./Context/TokenContext";
import NetwrokError from "./Components/NetwrokError/NetwrokError";
import SinglePost from "./Components/SinglePost/SinglePost";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ChangeProfilePic from "./Components/ChangeProfilePic/ChangeProfilePic";
const query = new QueryClient();

function App() {
  const { isAuth } = useContext(tokenContext);
  const routes = createBrowserRouter([
    { index: true, element: <Login /> },
    { path: "signup", element: <SignUp /> },
    {
      path: "home",
      element: (
        <ProtectionGuard>
          <MainLayout />
        </ProtectionGuard>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectionGuard>
              <Home />
            </ProtectionGuard>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectionGuard>
              <Profile />
            </ProtectionGuard>
          ),
        },
        {
          path: "singlepost/:id",
          element: (
            <ProtectionGuard>
              <SinglePost />
            </ProtectionGuard>
          ),
        },
        {
          path: "networkerror",
          element: (
            <ProtectionGuard>
              <NetwrokError />
            </ProtectionGuard>
          ),
        },
        { path: "*", element: <NotFound direction={"/home"} /> },
      ],
    },
    { path: "*", element: <NotFound direction={isAuth ? "/home" : "/"} /> },
  ]);

  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={routes}></RouterProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
