import React, { useEffect, useState } from 'react'
import { Upload, User, UserCheck, School, Save, ArrowLeft } from 'lucide-react'
import { auth } from '../libs/Firebase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CompleteProfile = () => {
    const [form, setForm] = useState({ username: '', full_name: '', college_name: '' })
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [currentProfileImage, setCurrentProfileImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [usernames, setUsernames] = useState([])
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true)
    const navigate = useNavigate()


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

    const updateProfile = async () => {
        setLoading(true)
        try {
            const user = auth.currentUser
            if (!user) {
                navigate('/login')
                return
            }

            const idToken = await user.getIdToken()
            const formData = new FormData()
            console.log(idToken);
            formData.append('username', form.username)
            formData.append('full_name', form.full_name)
            formData.append('college_name', form.college_name)
            
            if (profilePhoto) {
                formData.append('profile_photo', profilePhoto)
            }

            const response = await axios.post('http://127.0.0.1:5000/api/auth/complete-profile', formData, {
                headers: { 
                    'Authorization': `Bearer ${idToken}`,
                }
            })

            if (response.status === 200) {
                toast.success('Profile updated successfully!')
                navigate('/dashboard')
            } else {
                toast.error('Failed to update profile')
            }
        } catch (error) {
            console.error('Profile update error:', error)
            toast.error('Profile update failed')
        } finally {
            setLoading(false)
        }
    }

    const isFormValid = () => {
        return form.username.trim() && 
               form.full_name.trim() && 
               form.college_name.trim() && 
               isUsernameAvailable
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
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="absolute top-6 left-6 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                        >
                         <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <UserCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Complete Profile</h2>
                        <p className="text-gray-400">Update your profile information</p>
                    </div>

                    {/* Profile photo upload */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-0.5 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden group-hover:bg-gray-600 transition-colors">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : currentProfileImage ? (
                                        <img src={currentProfileImage} alt="Current" className="w-full h-full object-cover" />
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
                        {/* Username */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="username"
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                            {form.username && (
                                <p className={`text-sm mt-1 pl-2 ${isUsernameAvailable ? 'text-green-400' : 'text-red-400'}`}>
                                    {isUsernameAvailable ? 'Username is available' : 'Username is taken'}
                                </p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="full_name"
                                placeholder="Full Name"
                                value={form.full_name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* College Name */}
                        <div className="relative">
                            <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="college_name"
                                placeholder="College Name"
                                value={form.college_name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Update button */}
                    <button
                        onClick={updateProfile}
                        disabled={loading || !isFormValid()}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Updating Profile...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <Save className="w-5 h-5 mr-2" />
                                Update Profile
                            </div>
                        )}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Need help?{' '}
                        <a href="/support" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CompleteProfile