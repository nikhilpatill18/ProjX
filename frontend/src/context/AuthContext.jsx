import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { auth } from '../libs/Firebase.js'
import axios from 'axios'
import { onAuthStateChanged, getIdToken } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { getProjects } from '../store/projectSlice.js'
import { getBuyedproject } from '../store/projectSlice.js'
import { Navigate } from 'react-router-dom'

const AuthContext = createContext()
// export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({ children }) => {
    const [firebaseuser, setFirebaseuser] = useState(null)
    const [userprofile, setUserprofile] = useState(null)
    const [idtoken, setIdtoken] = useState(null)
    const [loading, setloading] = useState(true)
    const dispatch = useDispatch()
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseuser(user)
            if (user) {
                try {
                    console.log(user);
                    const tokenId = await getIdToken(user)
                    const response = await axios.get('http://127.0.0.1:5000/api/auth/me', { headers: { Authorization: `Bearer ${tokenId}` } })
                    console.log(response.data.data);
                    localStorage.setItem('idtoken', tokenId)
                    setIdtoken(tokenId)
                    setUserprofile(response.data.data)
                    setFirebaseuser(user)
                    dispatch(getProjects())
                    dispatch(getBuyedproject())
                } catch (error) {
                    console.log(error);
                    setUserprofile(null)
                }
            }
            else {
                setFirebaseuser(null)
                setUserprofile(null)
            }
            setloading(false)
        })
        return () => unsubscribe()
    }, [])

    
const fetchUserProfile = async () => {
    const token = await auth.currentUser?.getIdToken()
    if (!token) return
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
        localStorage.setItem('idtoken', token)
        setUserprofile(response.data.data)
        setIdtoken(token)
        dispatch(getProjects())
        dispatch(getBuyedproject())
    } catch (error) {
        console.error("Failed to fetch user profile:", error)
    }
}

    return (
        <AuthContext.Provider value={{ firebaseuser, userprofile, idtoken, loading,fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }




