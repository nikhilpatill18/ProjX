import React, { useContext, useState } from 'react'
import {
    IndianRupee,
    Search,
    Filter,
    Grid,
    List,
    Code,
    Cpu,
    Star,
    Clock,
    DollarSign,
    Eye,
    Github,
    CheckCircle,
    Users,
    TrendingUp,
    Calendar,
    Layers,
    ArrowUpRight,
    Heart,
    Share2,
    BookOpen,
    Award,
    Download,
    Bookmark
} from 'lucide-react'
import ProjectDetailsModal from './ProjectDetailsModal'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addbookmark, removebookmarked } from '../store/projectSlice'

const ProjectCard = ({ project, unlock = false }) => {
    const dispatch = useDispatch()
    const { idtoken } = useContext(AuthContext)
    const [selectedProject, setSelectedProject] = useState(null)
    const [isBookmarked, setIsBookmarked] = useState(project.bookedmarked)
    const [isLiked, setIsLiked] = useState(false)



    const getComplexityColor = (complexity) => {
        switch (complexity) {
            case 'Low': return 'text-green-400 bg-green-400/10'
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10'
            case 'High': return 'text-orange-400 bg-orange-400/10'
            case 'Very High': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'text-green-400 bg-green-400/10'
            case 'sold': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }

    const handleViewDetail = () => {
        setSelectedProject(project)
    }

    const handleBookmark = async () => {
        if (!isBookmarked) {   // runs when the project is not bookmark
            try {                
                const response = await axios.get(`http://127.0.0.1:5000/api/bookmark/${project.project_id}`, {
                    headers: {
                        'Authorization': `Bearer ${idtoken}`
                    }
                })
                console.log(response);

                if (response.status == 200) {
                    setIsBookmarked(prev=>!prev)
                    console.log(isBookmarked,'bookedmarked');
                    dispatch(addbookmark(project.project_id))
                }
                else {
                    toast.warn('Bookmark Not Added')
                }

            } catch (error) {
                console.log(error);
            }
        }
        else {   // run when to remove the bookmark project
            try {
                
                
                const response = await axios.delete(`http://127.0.0.1:5000/api/bookmark/${project.project_id}`, {
                    headers: {
                        'Authorization': `Bearer ${idtoken}`
                    }
                })
                if (response.status == 200) {
                    setIsBookmarked(prev=>!prev)
                    dispatch(removebookmarked(project.project_id))
                }
                else {
                    toast.warn('Bookmark Not Added')
                }


            } catch (error) {
                console.log(error);
            }
        }
    }



    const handleLike = (e) => {
        setIsLiked(!isLiked)
        console.log(`Project ${isLiked ? 'unliked' : 'liked'}:`, project.project_id)
    }

    const handleShare = (e) => {
        // Add share functionality
        console.log('Sharing project:', project.project_id)
    }

    return (
        <div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group">
                {/* Project Image */}
                <div className="relative mb-4">
                    <img
                        src={project.images && project.images.length > 0 ? project.images[0] : '/placeholder-image.jpg'}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg'
                        }}
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${project.category === 'SOFTWARE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                            }`}>
                            {project.category === 'SOFTWARE' ? <Code className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                            <span>{project.category}</span>
                        </div>
                        {project.is_verified && (
                            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Verified</span>
                            </div>
                        )}
                        <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                        </div>
                    </div>

                    {/* Bookmark button in top right */}
                    <div className="absolute top-3 right-3">
                        <button
                            onClick={handleBookmark}
                            className={`p-2 rounded-full transition-all duration-200 ${isBookmarked
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-black/50 text-gray-300 hover:bg-black/70'
                                }`}
                        >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                {project.title}
                            </h3>
                            {project.subject && (
                                <p className="text-sm text-blue-400 mt-1">{project.subject}</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleLike}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                            >
                                <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'text-red-400 fill-current' : 'text-gray-400 hover:text-red-400'
                                    }`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                            >
                                <Share2 className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-3">
                        {project.description}
                    </p>

                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{project.duration_hours}h</span>
                            </div>
                            {project.software?.readme_verified && (
                                <div className="flex items-center space-x-1">
                                    <BookOpen className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400">README</span>
                                </div>
                            )}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(project.complexity)}`}>
                            {project.complexity}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    {project.software?.tech_stack && (
                        <div className="flex flex-wrap gap-2">
                            {project.software.tech_stack.split(', ').slice(0, 4).map((tech, index) => (
                                <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                    {tech.trim()}
                                </span>
                            ))}
                            {project.software.tech_stack.split(', ').length > 4 && (
                                <span className="bg-gray-600 text-gray-400 px-2 py-1 rounded text-xs">
                                    +{project.software.tech_stack.split(', ').length - 4} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <div className="flex items-center space-x-2">
                            <IndianRupee className="w-5 h-5 text-green-400" />
                            <span className="text-2xl font-bold text-white">{project.price}</span>
                        </div>
                        <div className="flex space-x-2">


                            <button
                                onClick={handleViewDetail}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <span>View Details</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>

                        </div>
                    </div>
                </div>

                {selectedProject && (
                    <ProjectDetailsModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                        isBookmarked={isBookmarked}
                        handlebookmark={handleBookmark}
                        unlock={unlock}
                    />
                )}
            </div>
        </div>
    )
}

export default ProjectCard