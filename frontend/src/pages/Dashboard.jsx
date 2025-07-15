import React, { use } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'
import { auth } from '../libs/Firebase'
import { signOut } from 'firebase/auth'
// import { NavLink } from 'react-router-dom'
const Dashboard = () => {
    const { userprofile } = useContext(AuthContext)
    console.log(userprofile);


    const handlelogout = async () => {
        try {
            await signOut(auth)

        }
        catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='text-red-700'>
            Dashboard
            <button onClick={handlelogout}>logout</button>

        </div>
    )
}

export default Dashboard
