import React, { useEffect, useState } from 'react'
import { Upload, Mail, Lock, User, UserCheck, Eye, EyeOff, Chrome } from 'lucide-react'
import { auth } from '../libs/Firebase.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'

    
// google signin funcality is left
const Signup = () => {
    const [form, setForm] = useState({ email: '', password: '', username: '', full_name: '' })
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [usernames, setUsernames] = useState([])
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true)
    const navigate=useNavigate()


    // to fetch all the username
    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/username')
                setUsernames(response.data.data || [])
            } catch (error) {
                console.error('Failed to fetch usernames:', error)
            }
        }
        fetchUsernames()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))

        if (name === 'username') {
            setIsUsernameAvailable(!usernames.includes(value))
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setProfilePhoto(file)
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => setPreviewImage(e.target.result)
            reader.readAsDataURL(file)
        } else {
            setPreviewImage(null)
        }
    }

    const googleSign = async () => {
        setLoading(true)
        let userCred = null
        try {
            const provider = new GoogleAuthProvider()
            userCred = await signInWithPopup(auth, provider)
            const idToken = await userCred.user.getIdToken()

            const formData = new FormData()
            formData.append('username', form.username)
            formData.append('full_name', form.full_name)
            formData.append('profile_photo', profilePhoto)

            const response = await axios.post('http://127.0.0.1:5000/api/auth/register', formData, {
                headers: { Authorization: `Bearer ${idToken}` }
            })

            if (response.status === 200) {
                console.log('User created successfully')
                navigate('/dashboard')
            } else {
                await userCred.user.delete()
                console.error('Backend failed, user deleted from Firebase')
            }
        } catch (error) {
            console.error('Google sign-in error:', error)
            if (userCred?.user) await userCred.user.delete()
        } finally {
            setLoading(false)
        }
    }

    const register = async () => {
        setLoading(true)
        let userCred = null
        try {
            userCred = await createUserWithEmailAndPassword(auth, form.email, form.password)
            const idToken = await userCred.user.getIdToken()
            console.log(idToken);
            localStorage.setItem('idtoken',idToken)
            const formData = new FormData()
            formData.append('username', form.username)
            formData.append('full_name', form.full_name)
            formData.append('profile_photo', profilePhoto)
            sendEmailVerification(auth.currentUser).then(()=>toast.info('check your mail to verify the email address')).catch((err)=>console.log(err)
            )

            const response = await axios.post('http://127.0.0.1:5000/api/auth/register', formData, {
                headers: { 'Authorization': `Bearer ${idToken}` }
            })

            if (response.status === 200) {
                navigate('/dashboard')
                // console.log('User created successfully')
            } else {
                await userCred.user.delete()
                console.error('Backend failed, user deleted from Firebase')
            }
        } catch (error) {
            console.error('Registration error:', error)
            if (userCred?.user) await userCred.user.delete(); localStorage.removeItem('idtoken')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]"></div>
            </div>

            {/* Main form container */}
            <div className="relative w-full max-w-md">
                <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 transform hover:scale-[1.02] transition-all duration-300">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <UserCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Join us and start your journey</p>
                    </div>

                    {/* Profile photo upload */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden group-hover:bg-gray-600 transition-colors">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-300" />
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <Upload className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Form fields */}
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email address"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                onChange={handleChange}
                                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Username */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="username"
                                placeholder="Username"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                            <p className={`text-sm ${isUsernameAvailable ? 'text-green-400' : 'text-red-400'} pl-2`}>
                                {form.username && (isUsernameAvailable ? 'Username is available' : 'Username is taken')}
                            </p>
                        </div>

                        {/* Full Name */}
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="full_name"
                                placeholder="Full Name"
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Register button */}
                    <button
                        onClick={register}
                        disabled={loading || !isUsernameAvailable}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-600"></div>
                        <span className="px-4 text-gray-400 text-sm">or</span>
                        <div className="flex-1 h-px bg-gray-600"></div>
                    </div>

                    {/* Google sign-in */}
                    <button
                        onClick={googleSign}
                        disabled={loading}
                        className="w-full py-3 bg-gray-700 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                        <Chrome className="w-5 h-5 mr-2" />
                        Continue with Google
                    </button>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                            Sign in
                        </a>
                    </p>
                </div>


            </div>
        </div>
    )
}

export default Signup