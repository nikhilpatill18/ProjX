import React from 'react'
// import { useAuth } from '../context/AuthContext'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
const Protectedroute = ({ children }) => {
    const { firebaseuser, userprofile, loading } = useContext(AuthContext)
    console.log(loading);






    if (loading) return <div>loading...</div>

    if (!firebaseuser) return <Navigate to={'/login'} />

    return (
        <div>
            {children}

        </div>
    )
}

export default Protectedroute
