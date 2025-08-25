import React from "react";
import style from "./Toast.module.css";
export default function Toast({ msg, status }) {
  return (
    <>
      <div className="toast toast-top toast-center mt-15 z-50">
        <div className={`alert ${status==='success'?'alert-success':'alert-error'} shadow-lg`}>
          <span className="capitalize poppins text-md">{msg}</span>
        </div>
      </div>
    </>
  );
}
