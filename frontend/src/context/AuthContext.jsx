import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { auth } from '../libs/Firebase.js'
import axios from 'axios'
import { onAuthStateChanged, getIdToken } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { getProjects } from '../store/projectSlice.js'
import { getBuyedproject } from '../store/projectSlice.js'

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
            console.log(user.emailVerified);
            
            console.log(user);
            
            setFirebaseuser(user)
            if (user) {
                // console.log(user);

                try {
                    const tokenId = await getIdToken(user)
                    const response = await axios.get('http://127.0.0.1:5000/api/auth/me', { headers: { Authorization: `Bearer ${tokenId}` } })
                    console.log(response.data.data);
                    localStorage.setItem('idtoken', tokenId)
                    setIdtoken(tokenId)
                    setUserprofile(response.data.data)
                    setFirebaseuser(response.data.data)
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
    return (
        <AuthContext.Provider value={{ firebaseuser, userprofile, idtoken, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }




