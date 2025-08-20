import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { auth } from '../libs/Firebase.js'
import axios from '../libs/api'
import { onAuthStateChanged, getIdToken } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { getProjects } from '../store/projectSlice.js'
import { getBuyedproject } from '../store/projectSlice.js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AuthContext = createContext()
// export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({ children }) => {
    const navigate=useNavigate()
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
                    const response = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${tokenId}` } })
                    console.log(response.data.data);
                    localStorage.setItem('idtoken', tokenId)
                    setIdtoken(tokenId)
                    setUserprofile(response.data.data)
                    setFirebaseuser(user)
                    dispatch(getProjects())
                    dispatch(getBuyedproject())
                } catch (error) {
                    setUserprofile(null)
                    if(error.response.status==401||error.response.status==404){
            toast.warning('Please Login again')
            navigate('/login')
        }
        else{
            toast.error('something went wrong')
            navigate('/login')
        }
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
        const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
        localStorage.setItem('idtoken', token)
        setUserprofile(response.data.data)
        setIdtoken(token)
        dispatch(getProjects())
        dispatch(getBuyedproject())
    } catch (error) {
        if(error.response.status==401||error.response.status==404){
            toast.warning('Please Login again')
            navigate('/login')
        }
        else{
            toast.error('something went wrong')
            navigate('/login')
        }
    }
}

    return (
        <AuthContext.Provider value={{ firebaseuser, userprofile, idtoken, loading,fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }




