import React, { useContext, useState } from 'react'
import {
    ArrowLeft,
    Upload,
    Code,
    Cpu,
    Save,
    Eye,
    Plus,
    X,
    Monitor,
    Smartphone,
    Server,
    Database,
    Cloud,
    Zap,
    Wrench,
    CheckCircle,
    XCircle,
    Github,
    DollarSign,
    Clock,
    Layers,
    AArrowDown
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

const AddProject = () => {
    const navigate = useNavigate()
    const { idtoken, userprofile } = useContext(AuthContext)
    const [category, setCategory] = useState('SOFTWARE')
    const [is_verified, setIsVerified] = useState(false)
    const [analyze, setanalyze] = useState(false)
    const [images, setImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [github_verified, setGithubverified] = useState(userprofile.github_verified)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration_hour: '',
        complexity: '',
        price: '',
        repo_url: '',
        subject: '',
        tech_stack: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        setImages(prev => [...prev, ...files])

        // Create previews
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    url: e.target.result,
                    name: file.name
                }])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove))
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleSoftware = () => {
        // Add software project logic here
        console.log('Adding software project:', formData)
    }

    const handleHardware = () => {
        // Add hardware project logic here
        console.log('Adding hardware project:', formData)
    }

    const verifySoftwareProject = async () => {
        if (github_verified) {
            setanalyze(true)
            const response = await axios.post('http://127.0.0.1:5000/api/projects/anayze-repo', { 'repo_url': formData.repo_url }, {
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${idtoken}`
                }
            })
            if (response.status === 200) {
                setIsVerified(true)
                setanalyze(false)
                toast.success('Project verified')
            }
            else if (response.status == 404) {
                navigate('/signup')
            }
            else if (response.status == 401) {
                navigate('/login')
            }
            else {
                setIsVerified(false)
                toast.error('Not able to Verify the Project')
            }
        }
        else{
            toast.info('Please verify Your Github Acoount from Profile')
        }

        // Add verification logic here
    }

    const verifyHardwareProject = () => {
        // Add verification logic here
        setIsVerified(true)
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <NavLink to={'/dashboard'} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-400" />
                        </NavLink>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Add New Project</h1>
                            <p className="text-gray-400">Create and showcase your latest work</p>
                        </div>
                    </div>
                </div>

                {/* Category Selection */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Project Category</h2>
                    <div className="relative">
                        <select
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none"
                        >
                            <option value="SOFTWARE">SOFTWARE</option>
                            <option value="HARDWARE">HARDWARE</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {category === 'SOFTWARE' ? (
                                <Code className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Cpu className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
                    <div className="flex items-center space-x-3">
                        {is_verified ? (
                            <>
                                <CheckCircle className="w-6 h-6 text-green-400" />
                                <span className="text-green-400 font-semibold">Project is verified</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-6 h-6 text-red-400" />
                                <span className="text-red-400 font-semibold">Project is not verified</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Project Form */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">
                        {category === 'SOFTWARE' ? 'Software Project Details' : 'Hardware Project Details'}
                    </h2>

                    <div className="space-y-6">
                        {/* Project Title */}
                        <div>
                            <label className="block text-white font-medium mb-2">Project Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter your project title"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white font-medium mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your project in detail..."
                                rows="4"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                            />
                        </div>

                        {/* Duration, Complexity, Price Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-white font-medium mb-2 flex items-center space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Duration (Hours)</span>
                                </label>
                                <input
                                    type="number"
                                    name="duration_hour"
                                    value={formData.duration_hour}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 40"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-white font-medium mb-2 flex items-center space-x-2">
                                    <Layers className="w-4 h-4" />
                                    <span>Complexity</span>
                                </label>
                                <select
                                    name="complexity"
                                    value={formData.complexity}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                >
                                    <option value="">Select complexity</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white font-medium mb-2 flex items-center space-x-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Price ($)</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 99"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-white font-medium mb-2">Subject/Category</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="e.g., Web Development, IoT, Machine Learning"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        {/* Software-specific fields */}
                        {category === 'SOFTWARE' && (
                            <>
                                <div>
                                    <label className="block text-white font-medium mb-2 flex items-center space-x-2">
                                        <Github className="w-4 h-4" />
                                        <span>Repository URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="repo_url"
                                        value={formData.repo_url}
                                        onChange={handleInputChange}
                                        placeholder="https://github.com/username/repo"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">Tech Stack</label>
                                    <input
                                        type="text"
                                        name="tech_stack"
                                        value={formData.tech_stack}
                                        onChange={handleInputChange}
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                    />
                                </div>

                                {/* Single Image Upload for Software */}
                                <div>
                                    <label className="block text-white font-medium mb-2">Project Image</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="software-image-upload"
                                        />
                                        <label
                                            htmlFor="software-image-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-gray-400 text-sm">Click to upload project image</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Verify Button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={verifySoftwareProject}
                                        className={` ${is_verified ? 'bg-green-400 font-semibold rounded-lg px-6 py-3 text-white hover:bg-green-500' : ' px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-all duration-300 flex items-center space-x-2'}`}
                                        disabled={is_verified}
                                    >
                                        {
                                            is_verified ? 'Verified' :
                                                analyze ? <div className='flex gap-3 justify-center items-center'><span className='font-bold'>Analyzing </span><div className='animate-spin rounded-full h-5 w-5 border border-t-2 border-gray-800'></div></div> : <>
                                                    <Github className="w-5 h-5" />
                                                    <span>Verify Repository</span></>
                                        }
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Hardware-specific fields */}
                        {category === 'HARDWARE' && (
                            <>
                                {/* Multiple Images Upload for Hardware */}
                                <div>
                                    <label className="block text-white font-medium mb-2">Hardware Images</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="hardware-image-upload"
                                        />
                                        <label
                                            htmlFor="hardware-image-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-gray-400 text-sm">Click to upload multiple images</p>
                                                <p className="text-gray-500 text-xs">You can select multiple files</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Verify Button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={verifyHardwareProject}
                                        className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span>Verify Project</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div>
                                <label className="block text-white font-medium mb-2">Uploaded Images</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={preview.id} className="relative group">
                                            <img
                                                src={preview.url}
                                                alt={preview.name}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-600"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                onClick={category === 'SOFTWARE' ? handleSoftware : handleHardware}
                                disabled={is_verified}
                                className={`
                                    px-8 py-3 ${is_verified ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-blue-300 to-cyan-300'} 
                                     text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2
                                    `}
                            >
                                <Save className="w-5 h-5" />
                                <span>Add Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProject