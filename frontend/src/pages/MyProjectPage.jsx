import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import {
    ArrowLeft,
    IndianRupee,
    Clock,
    Code,
    Cpu,
    Star,
    Eye,
    Github,
    Globe,
    CheckCircle,
    Calendar,
    User,
    Tag,
    Layers,
    BookOpen,
    Image as ImageIcon,
    FileText,
    Award,
    Edit,
    Trash2,
    BarChart3,
    TrendingUp,
    Download,
    MessageCircle,
    Settings,
    Edit2,
    ExternalLink
    
} from 'lucide-react'
import { toast } from 'react-toastify'

const MyProjectPage = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const { idtoken } = useContext(AuthContext)
    const [edit, setedit] = useState(false)
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [formdata,setformdata]=useState({title:'',price:'',description:'',duration_hours:''})
    useEffect(() => {
        fetchProject()
    }, [projectId, idtoken])
    useEffect(()=>{
        if(project){
            setformdata({title:project.title,description:project.description,price:project.price,duration_hours:project.duration_hours})
            // console.log(typeof(project.price));
        }
        

    },[project])

    const fetchProject = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/projects/projectdetails/${projectId}`, {
                headers: { 'Authorization': `Bearer ${idtoken}` }
            })
            setProject(response.data.data)
        } catch (error) {
            console.error('Failed to fetch project:', error)
            toast.error('Failed to load project details')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = () => {
        setedit(!edit)
    }

    const handleDelete = async () => {
        try {
          const response=  await axios.delete(`http://127.0.0.1:5000/api/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${idtoken}` }
            })

            console.log(response);
            
            toast.success('Project deleted successfully!')
            navigate('/dashboard')
        } catch (error) {
            console.error('Delete failed:', error)
            toast.error('Failed to delete project')
        }

        console.log('delete project');

    }
    const handleSubmit= async()=>{
        try {
            const formData=new FormData()
            formData.append('title',formdata.title)
            formData.append('description',formdata.description)
            formData.append('price',formdata.price)
            formData.append('duration_hours',formdata.duration_hours)

            const response=await axios.put(`http://127.0.0.1:5000/api/projects/${projectId}`,formData,{
                headers:{
                    'Authorization':`Bearer ${idtoken}`
                }
            })
            if(response.status==200){
                setedit(!edit)
                toast.success('Project updated successfully!')
            }
            else{
                toast.error('not able to update the  project')
            }
            
        } catch (error) {
            console.log(error);
            
            
        }
    }


    const getComplexityColor = (complexity) => {
        switch (complexity) {
            case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20'
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
            case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            case 'Very High': return 'text-red-400 bg-red-400/10 border-red-400/20'
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'text-green-400 bg-green-400/10'
            case 'pending': return 'text-yellow-400 bg-yellow-400/10'
            case 'sold': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your project...</p>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
                    <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Dashboard</span>
                        </button>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleEdit}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit Project</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Images */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                            <div className="relative">
                                <img
                                    src={project.images && project.images.length > 0 ? project.images[activeImageIndex] : '/placeholder-image.jpg'}
                                    alt={project.title}
                                    className="w-full h-96 object-cover"
                                    onError={(e) => { e.target.src = '/placeholder-image.jpg' }}
                                />
                                <div className="absolute top-4 left-4 flex items-center space-x-2">
                                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${project.category === 'SOFTWARE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {project.category === 'SOFTWARE' ? <Code className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                                        <span>{project.category}</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <div className="bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                                        Your Project
                                    </div>
                                </div>
                            </div>

                            {/* Image Thumbnails */}
                            {project.images && project.images.length > 1 && (
                                <div className="p-4 flex space-x-2 overflow-x-auto">
                                    {project.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-blue-400' : 'border-gray-600'
                                                }`}
                                        >
                                            <img src={image} alt={`${project.title} ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Project Details */}
                       <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full">
    <div className="flex items-center justify-between mb-4">
        <input 
            className={`text-3xl font-bold rounded ${!edit? 'border-0 text-white bg-transparent':'border border-gray-600 bg-gray-700 text-gray-400'} outline-none flex-1 mr-4`} 
            value={formdata.title} 
            onChange={(e) => setformdata({...formdata, title: e.target.value})}
            type='text' 
            disabled={!edit} 
            placeholder="Project Title"
        />
        <div className="flex items-center space-x-2">
            <IndianRupee className="w-6 h-6 text-green-400" />
            <input 
                className={`text-2xl font-bold rounded ${!edit? 'border-0 text-white bg-transparent':'border border-gray-600 bg-gray-700 text-gray-400'} outline-none w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                value={formdata.price} 
                onChange={(e) => setformdata({...formdata, price: e.target.value})}
                type='number'
                disabled={!edit}
                placeholder="0"
            />
        </div>
    </div>

    {project.subject && (
        <p className="text-blue-400 text-lg mb-4">{project.subject}</p>
    )}

    <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-5 h-5 text-blue-400" />
            <input 
                className={` rounded ${!edit? 'border-0 text-white bg-transparent':'border border-gray-600 bg-gray-700 text-gray-400'} outline-none  w-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                value={formdata.duration_hours}
                onChange={(e) => setformdata({...formdata, duration_hours: e.target.value})}
                type="number"
                disabled={!edit}
                placeholder="0"
            />
            <span className="text-gray-300">h duration</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
            <Calendar className="w-5 h-5 text-green-400" />
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm border ${getComplexityColor(project.complexity)}`}>
            {project.complexity}
        </div>
    </div>

    <div className="prose prose-invert max-w-none">
        <h3 className="text-xl font-semibold text-white mb-3">Project Description</h3>
        {edit ? (
            <textarea
                className="w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-lg p-3 min-h-32 outline-none focus:border-blue-400 resize-vertical"
                value={formdata.description}
                onChange={(e) => setformdata({...formdata, description: e.target.value})}
                placeholder="Enter project description..."
            />
        ) : (
            <>
                <p className="text-gray-300 leading-relaxed">
                    {showFullDescription || project.description.length <= 500
                        ? project.description
                        : `${project.description.substring(0, 500)}...`
                    }
                </p>
                {project.description.length > 500 && (
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-400 hover:text-blue-300 mt-2"
                    >
                        {showFullDescription ? 'Show Less' : 'Read More'}
                    </button>
                )}
            </>
        )}
    </div>

    {/* Tech Stack */}
    {project.Project_data?.tech_stack && (
        <div className="mt-6">
            <h3 className="text-xl font-semibold text-white mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
                {project.Project_data.tech_stack.split(', ').map((tech, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm">
                        {tech.trim()}
                    </span>
                ))}
            </div>
        </div>
    )}

    {/* Features */}
    {project.features && (
        <div className="mt-6">
            <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.split('\n').map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{feature.trim()}</span>
                    </div>
                ))}
            </div>
        </div>
    )}
</div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Stats */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    disabled={project.status == 'sold'}
                                    onClick={handleEdit}

                                    className={`w-full flex items-center space-x-2 py-2 px-3  text-white rounded-lg transition-colors ${project.status == 'sold' ? 'bg-blue-500 hover:bg-blue-600 ' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Project</span>
                                </button>


                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center space-x-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Project</span>
                                </button>

                                {
                                    edit?<button
                                    onClick={handleSubmit}
                                    className="w-full flex items-center space-x-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Update Project</span>
                                </button>:''
                                }
                            </div>
                        </div>

                        {/* Project Status */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Project Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Current Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Category</span>
                                    <span className="text-white">{project.category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Complexity</span>
                                    <span className="text-white">{project.complexity}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white">{project.duration_hours}h</span>
                                </div>
                            </div>
                        </div>
                          {project.Project_data.repo_url && (
                                                <div className="mb-6">
                                                    <h3 className="text-xl font-semibold text-white mb-3">Repository</h3>
                                                    <a 
                                                        href={project.Project_data.repo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <Github className="w-5 h-5" />
                                                        <span>View Repository</span>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProjectPage