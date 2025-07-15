import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { auth } from '../libs/Firebase.js'
import axios from 'axios'
import { onAuthStateChanged, getIdToken } from 'firebase/auth'

const AuthContext = createContext()
// export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({ children }) => {
    const [firebaseuser, setFirebaseuser] = useState(null)
    const [userprofile, setUserprofile] = useState(null)
    const [idtoken, setIdtoken] = useState(null)
    const [loading, setloading] = useState(true)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setFirebaseuser(user)
            if (user) {
                try {
                    const tokenId = await getIdToken(user)
                    const response = await axios.get('http://127.0.0.1:5000/api/auth/me', { headers: { Authorization: `Bearer ${tokenId}` } })
                    console.log(response.data.data);
                    setIdtoken(tokenId)
                    setUserprofile(response.data.data)
                    setFirebaseuser(response.data.data)
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




