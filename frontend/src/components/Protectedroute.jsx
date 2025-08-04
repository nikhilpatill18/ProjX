import React, { useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate,Navigate } from 'react-router-dom'
import { useContext } from 'react'
import Sidebar from './Sidebar'
import { ToastContainer } from 'react-toastify'
import { auth } from '../libs/Firebase'

import { onAuthStateChanged } from 'firebase/auth'
const Protectedroute = ({ children }) => {
    const navigate=useNavigate()
    const { firebaseuser, userprofile, loading } = useContext(AuthContext)
    const[isAllowed,setisAllowed]=useState(false)
    useEffect(()=>{
       const unsubscribe = onAuthStateChanged(auth,async (user) => {
        console.log(user.emailVerified);
        
        if (user) {
        //   await user.reload(); // Make sure we get the latest status
          if (user.emailVerified) {            
            setisAllowed(true);
          } else {
            setisAllowed(false);
          }
        }
         // Done checking
      });

      return () => unsubscribe();

    },[])
    if (loading) return <div>loading...</div>
    if (!firebaseuser) return <Navigate to={'/login'} />
    if(!isAllowed)return <Navigate to={'/verify-email'} />
    return (
        <div className='flex h-screen '>
            <ToastContainer />
            <Sidebar />
            <div className='flex-1 overflow-auto'>{children}</div>

        </div>
    )
}

export default Protectedroute
