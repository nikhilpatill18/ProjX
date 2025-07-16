import React from 'react'
// import { useAuth } from '../context/AuthContext'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import Sidebar from './Sidebar'
import { ToastContainer } from 'react-toastify'
const Protectedroute = ({ children }) => {
    const { firebaseuser, userprofile, loading } = useContext(AuthContext)
    console.log(loading);






    if (loading) return <div>loading...</div>

    if (!firebaseuser) return <Navigate to={'/login'} />

    return (
        <div className='flex h-screen '>
            <ToastContainer />
            <Sidebar />
            <div className='flex-1 overflow-auto'>{children}</div>

        </div>
    )
}

export default Protectedroute
