import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import {
    User,
    Mail,
    Calendar,
    Github,
    Edit,
    Save,
    X,
    Camera,
    Shield,
    CheckCircle,
    AlertCircle,
    Settings,
    MapPin,
    Briefcase,
    DollarSign,
    ShoppingCart,
    IndianRupee,
    ExternalLink
} from 'lucide-react'
import axios from '../libs/api'

const UserProfile = () => {
    const { idtoken, userprofile, setUserProfile: setContextUserProfile } = useContext(AuthContext)

    const [userProfile, setUserProfile] = useState(userprofile)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [verifyingGithub, setVerifyingGithub] = useState(false)

    useEffect(() => {
        if (userprofile) {
            setUserProfile(userprofile)
            setEditForm({
                full_name: userprofile.full_name || userprofile.fullname || '',
                username: userprofile.username || ''
            })
        }
    }, [userprofile])

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset form if canceling
            setEditForm({
                full_name: userProfile.full_name || userProfile.fullname || '',
                username: userProfile.username || ''
            })
        } else {
            // Initialize form with current values when starting to edit
            setEditForm({
                full_name: userProfile.full_name || userProfile.fullname || '',
                username: userProfile.username || ''
            })
        }
        setIsEditing(!isEditing)
    }

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            // Map form data back to API expected format
            const updateData = {
                full_name: editForm.full_name,
                username: editForm.username
            }
            
            const response = await axios.put('/api/user/profile', updateData, {
                headers: {
                    'Authorization': `Bearer ${idtoken}`,
                    'Content-Type': 'application/json'
                }
            })
            
            // Update userProfile with the response data
            const updatedProfile = {
                ...userProfile,
                full_name: response.data.data.fullname || response.data.data.full_name,
                fullname: response.data.data.fullname || response.data.data.full_name,
                username: response.data.data.username
            }
            
            setUserProfile(updatedProfile)
            
            // Also update the context if needed
            if (setContextUserProfile) {
                setContextUserProfile(updatedProfile)
            }
            
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
            // You might want to show an error message to the user here
            alert('Failed to update profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleVerifyGithub = async () => {
        setVerifyingGithub(true)
        try {
            // Redirect to GitHub OAuth or verification endpoint
            // This would typically redirect to your backend GitHub OAuth endpoint
            window.location.href = '/api/auth/github/verify'
        } catch (error) {
            console.error('Failed to initiate GitHub verification:', error)
            alert('Failed to start GitHub verification. Please try again.')
        } finally {
            setVerifyingGithub(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="bg-gray-800 rounded-xl p-8 mb-8">
                            <div className="flex items-center space-x-6">
                                <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-8 bg-gray-700 rounded mb-4 w-1/3"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                        <div className="flex items-center space-x-6 mb-4 lg:mb-0">
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden">
                                    {userProfile.profile_photo ? (
                                        <img
                                            src={userProfile.profile_photo}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-white" />
                                    )}
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editForm.full_name || ''}
                                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                                            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="text"
                                            value={editForm.username || ''}
                                            onChange={(e) => handleInputChange('username', e.target.value)}
                                            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Username"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold text-white mb-2">
                                            {userProfile.full_name || userProfile.fullname || userProfile.username}
                                        </h1>
                                        <p className="text-gray-400 mb-2">@{userProfile.username}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                                            <div className="flex items-center space-x-1">
                                                <Mail className="w-4 h-4" />
                                                <span>{userProfile.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Joined {new Date(userProfile.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? 'Saving...' : 'Save'}</span>
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        disabled={saving}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleEditToggle}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* GitHub Verification Section */}
                    <div className="mt-6">
                        {userProfile.github_username ? (
                            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Github className="w-5 h-5 text-gray-300" />
                                    <div>
                                        <span className="text-gray-300">GitHub: @{userProfile.github_username}</span>
                                        {userProfile.github_verified ? (
                                            <div className="flex items-center space-x-1 text-green-400 mt-1">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm">Verified</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-1 text-yellow-400 mt-1">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-sm">Not Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!userProfile.github_verified && (
                                    <button
                                        onClick={handleVerifyGithub}
                                        disabled={verifyingGithub}
                                        className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Shield className="w-4 h-4" />
                                        <span>{verifyingGithub ? 'Verifying...' : 'Verify'}</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                                <div className="flex items-center space-x-3">
                                    <Github className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <span className="text-gray-300">GitHub Account</span>
                                        <p className="text-sm text-gray-400 mt-1">Connect your GitHub account to verify your projects</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleVerifyGithub}
                                    disabled={verifyingGithub}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Github className="w-4 h-4" />
                                    <ExternalLink className="w-3 h-3" />
                                    <span>{verifyingGithub ? 'Connecting...' : 'Verify GitHub Account'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Briefcase className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Projects Sold</p>
                                <p className="text-2xl font-bold text-white">{userProfile.soldProject || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Projects Purchased</p>
                                <p className="text-2xl font-bold text-white">{userProfile.buyedProject || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-yellow-500/20 rounded-lg">
                                <IndianRupee className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Sales</p>
                                <p className="text-2xl font-bold text-white">₹{userProfile.total_sale || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <Settings className="w-5 h-5" />
                        <span>Account Information</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <div className="bg-gray-700 rounded-lg px-3 py-2 text-gray-300">
                                {userProfile.full_name || userProfile.fullname || 'Not provided'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                            <div className="bg-gray-700 rounded-lg px-3 py-2 text-gray-300">
                                @{userProfile.username}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <div className="bg-gray-700 rounded-lg px-3 py-2 text-gray-300">
                                {userProfile.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Account Created</label>
                            <div className="bg-gray-700 rounded-lg px-3 py-2 text-gray-300">
                                {new Date(userProfile.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile