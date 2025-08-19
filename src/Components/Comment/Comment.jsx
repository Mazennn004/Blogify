import React, { useContext,useState } from 'react'
import style from './Comment.module.css'
import { tokenContext } from '../../Context/TokenContext';
export default function Comment({data:c}) {
  const{userData}=useContext(tokenContext);
  const[showCommentMenu,setCommentMenu]=useState(false)
  return (
  <>
 <div onClick={()=>{setCommentMenu(false)

 }}  className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="https://linked-posts.routemisr.com/uploads/default-profile.png"
                        />
                      </div>
                    </div>
                    <div className="chat-bubble rounded-2xl poppins w-[90%] relative">
                      {c.commentCreator._id == userData._id ? (
                        <span className="absolute end-0 top-0 p-2">
                          <i onClick={(e)=>{setCommentMenu(true)
                            e.stopPropagation()}} className="fa-solid fa-ellipsis text-md text-slate-600 cursor-pointer"></i>
                          {
                            showCommentMenu ? <ul className="menu bg-base-200 rounded-box w-56 absolute top-0 end-[-150px]">
  <li className='text-red-400 flex flex-row cursor-pointer'><i className='fa-solid fa-trash-can text-red-400 mx-2'></i>Delete</li>
  <li className='text-main flex flex-row cursor-pointer'><i className='fa-solid fa-edit mx-2'></i>Edit</li>
</ul>:''
                          }
                        </span>
                      ) : (
                        ""
                      )}
                      <div className="flex flex-col gap-2">
                        <span className="poppins font-bold">
                          {c.commentCreator.name}
                        </span>
                        <span className="poppins font-light text-slate-500 overflow-clip">
                          {c.content}
                        </span>
                      </div>
                    </div>
                  </div>
  </>
  )
}
