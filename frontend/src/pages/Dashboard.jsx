import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { auth } from '../libs/Firebase'
import { signOut } from 'firebase/auth'
import { NavLink } from 'react-router-dom'
import {
    Search,
    Plus,
    Filter,
    Calendar,
    User,
    Eye,
    Heart,
    MessageCircle,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink
} from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
    const { idtoken } = useContext(AuthContext)

    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, recent, popular
    const [showDropdown, setShowDropdown] = useState(null)

    // Mock data - replace with your API call
    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/projects/userprojects', { headers: { 'Authorization': `Bearer ${idtoken}` } })
            setProjects(response.data.data || [])


            // Mock data for demonstration
            // const mockProjects = [
            //     {
            //         id: 1,
            //         title: "E-commerce Website",
            //         description: "A full-stack e-commerce platform with React and Node.js",
            //         image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
            //         views: 1250,
            //         likes: 89,
            //         comments: 23,
            //         createdAt: "2024-01-15",
            //         status: "Published",
            //         tags: ["React", "Node.js", "MongoDB"]
            //     },
            //     {
            //         id: 2,
            //         title: "Mobile Banking App",
            //         description: "Secure mobile banking application with biometric authentication",
            //         image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
            //         views: 890,
            //         likes: 67,
            //         comments: 15,
            //         createdAt: "2024-01-10",
            //         status: "Draft",
            //         tags: ["React Native", "Firebase", "Security"]
            //     },
            //     {
            //         id: 3,
            //         title: "AI Dashboard",
            //         description: "Analytics dashboard with machine learning insights",
            //         image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
            //         views: 2100,
            //         likes: 156,
            //         comments: 42,
            //         createdAt: "2024-01-05",
            //         status: "Published",
            //         tags: ["Python", "TensorFlow", "React"]
            //     },
            //     {
            //         id: 4,
            //         title: "Task Management Tool",
            //         description: "Collaborative task management with real-time updates",
            //         image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
            //         views: 760,
            //         likes: 45,
            //         comments: 18,
            //         createdAt: "2024-01-20",
            //         status: "Published",
            //         tags: ["Vue.js", "Socket.io", "PostgreSQL"]
            //     }
            // ]
            // setProjects(mockProjects)
            // setFilteredProjects(mockProjects)
        } catch (error) {
            console.error('Failed to fetch projects:', error)
        } finally {
            setLoading(false)
        }
    }

    // Search functionality
    useEffect(() => {
        let filtered = projects

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Filter by category
        if (filter === 'recent') {
            filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (filter === 'popular') {
            filtered = filtered.sort((a, b) => b.views - a.views)
        }

        setFilteredProjects(filtered)
    }, [searchTerm, filter, projects])


    const ProjectCard = ({ project }) => (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'Published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {project.status}
                    </span>
                </div>
                <div className="absolute top-3 left-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(showDropdown === project.id ? null : project.id)}
                            className="p-2 bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-white" />
                        </button>
                        {showDropdown === project.id && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2">
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Project</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>View Live</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-700 text-red-400 flex items-center space-x-2">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{project.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{project.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{project.comments}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                        <p className="text-gray-400">Manage and track your projects</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/add-project'}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Project</span>
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects by title, description, or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        >
                            <option value="all">All Projects</option>
                            <option value="recent">Recent</option>
                            <option value="popular">Popular</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-2 lg:p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <User className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Projects</p>
                                <p className="text-2xl font-bold text-white">{projects.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl  p-2 lg:p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <Eye className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Views</p>
                                <p className="text-2xl font-bold text-white">{projects.reduce((sum, p) => sum + p.views, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl  p-2 lg:p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <Heart className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Likes</p>
                                <p className="text-2xl font-bold text-white">{projects.reduce((sum, p) => sum + p.likes, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl  p-2 lg:p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-cyan-500/20 rounded-lg">
                                <MessageCircle className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Comments</p>
                                <p className="text-2xl font-bold text-white">{projects.reduce((sum, p) => sum + p.comments, 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Your Projects</h2>
                    <span className="text-gray-400">{filteredProjects.length} projects found</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-700"></div>
                                <div className="p-6">
                                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-700 rounded mb-4"></div>
                                    <div className="flex space-x-2 mb-4">
                                        <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                                        <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                        <p className="text-gray-400 mb-4">
                            {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                        </p>
                        <NavLink
                            to={'/add-project'}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                        >
                            Create Project
                        </NavLink>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard