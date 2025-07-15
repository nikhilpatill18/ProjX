import React, { use } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'
const Dashboard = () => {
    const { userprofile } = useContext(AuthContext)
    console.log(userprofile);



    return (
        <div>
            Dashboard

        </div>
    )
}

export default Dashboard
