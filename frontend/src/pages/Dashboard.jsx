import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { auth } from '../libs/Firebase'
import { signOut } from 'firebase/auth'
import ProjectCard from '../components/ProjectCard'
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
    console.log(idtoken);

    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, recent, popular
    const [showDropdown, setShowDropdown] = useState(null)
    const [buyedproject, setbuyedproject] = useState([])
    useEffect(() => {
        fetchProjects()
        getBuyedproject()
    }, [idtoken])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/projects/userprojects', { headers: { 'Authorization': `Bearer ${idtoken}` } })
            console.log(response.data.data);

            setProjects(response.data.data || [])
        } catch (error) {
            console.error('Failed to fetch projects:', error)
        } finally {
            setLoading(false)
        }
    }
    const getBuyedproject = async () => {
        // setLoading(true)
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/projects/buyed-project', {
                headers: {
                    'Authorization': `Bearer ${idtoken}`
                }
            })
            // console.log(response.data.data)
            setbuyedproject(response.data.data)
        }
        catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        setFilteredProjects(projects)
    })

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
                    {/* <div className="bg-gray-800 border border-gray-700 rounded-xl  p-2 lg:p-6">
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
                    </div> */}
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
                ) :
                    filteredProjects.length === 0 ? (
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
                    ) :
                        (
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