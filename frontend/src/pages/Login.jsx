import React, { useState } from 'react'
import { auth } from '../libs/Firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'

const Login = () => {

    const [email, setemail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const emailsignin = async () => {
        try {

            const usecred = await signInWithEmailAndPassword(auth, email, password)
            const user = usecred.user
            if (user) {
                navigate('/dashboard')
            }

        } catch (error) {
            console.log(error);


        }
    }

    const googlesignIn = async () => {
        try {

            const authprovder = new GoogleAuthProvider()
            const usercred = await authprovder(auth, authprovder)

            const user = usercred.user
            if (user) {
                navigate('/dashboard')
            }


        } catch (error) {
            console.log(error);


        }
    }




    return (
        <div>


            email:
            <input type="email" value={email} onChange={(e) => setemail(e.target.value)} />
            password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={emailsignin}>Submit</button>





        </div>
    )
}

export default Login
