import React, { useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate,Navigate } from 'react-router-dom'
import { useContext } from 'react'
import Sidebar from './Sidebar'
import { ToastContainer } from 'react-toastify'
import { auth } from '../libs/Firebase'
import LoadingComponent from './Loading'

import { onAuthStateChanged } from 'firebase/auth'
const Protectedroute = ({ children }) => {
    const navigate=useNavigate()
    const { firebaseuser, userprofile, loading } = useContext(AuthContext)
    const[isAllowed,setisAllowed]=useState(false)
    const [checking, setChecking] = useState(true)
    useEffect(()=>{
       const unsubscribe = onAuthStateChanged(auth,async (user) => {
        if (user) {
          await user.reload(); 
          if (user.emailVerified) { 
            setisAllowed(true);
          } else {
            console.log("Email is not verifed");
            setisAllowed(false);
          }
        }
        setChecking(false)
         // Done checking
      });

      return () => unsubscribe();

    },[])
    if (loading|| checking) return <div><LoadingComponent message='loading'/></div>
    if (!firebaseuser) return <Navigate to={'/login'} />
    if(firebaseuser &&!userprofile){
      return <LoadingComponent message='fetching your details'/>
    }
    if(!(userprofile.IsprofileCompletd)) return <Navigate to={'/complete-profile'}/>
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
