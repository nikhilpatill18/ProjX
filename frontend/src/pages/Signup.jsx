import React, { useState } from 'react'
import { auth } from '../libs/Firebase.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import axios from 'axios'
const Signup = () => {
    const [form, setForm] = useState({ email: '', password: '', username: '', full_name: '' })
    const [profile_photo, setProfilePhotot] = useState(null)
    const [loading, setloading] = useState(null)
    const handleChange = async (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const register = async (e) => {
        setloading(true)
        try {
            const usercred = await createUserWithEmailAndPassword(auth, form.email, form.password)
            const Idtoken = await usercred.user.getIdToken()
            const formData = new FormData()
            formData.append('username', form.username)
            formData.append('full_name', form.full_name)
            formData.append('profile_photo', profile_photo)
            const response = await axios.post('http://127.0.0.1:5000/api/auth/register', formData, { headers: { 'Authorization': `Bearer ${Idtoken}` } })
            console.log(response);
            if (res.status === 200) {
                console.log('User created in backend too')
            } else {
                await usercred.user.delete()
                console.error('Backend failed, user deleted from Firebase')
            }

        } catch (error) {

            console.log(error);
            // (error)

        }
    }
    return (
        <div>
            <h2>Register</h2>
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="password" placeholder="Password" type="password" onChange={handleChange} />
            <input name="username" placeholder="Username" onChange={handleChange} />
            <input name="full_name" placeholder="Full Name" onChange={handleChange} />
            <input type="file" accept="image/*" onChange={(e) => setProfilePhotot(e.target.files[0])} />
            <button onClick={register} disabled={loading}>Register</button>



        </div>
    )
}

export default Signup
