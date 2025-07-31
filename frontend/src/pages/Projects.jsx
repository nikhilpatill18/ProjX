import React, { useState, useEffect, useContext } from 'react'
import {
    Search,
    Grid,
    List,
    Code,
    Cpu,
    Clock,
    DollarSign,
    Eye,
    Github,
    CheckCircle,
    Divide,
} from 'lucide-react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import ProjectCard from '../components/ProjectCard'
import { useDispatch } from 'react-redux'
import { getProjects } from '../store/projectSlice'
import { useSelector } from 'react-redux'

const ProjectsPage = () => {
    const { idtoken } = useContext(AuthContext)
    const { projects: projectData, loading, bookmark } = useSelector((state) => state.projects)
    // console.log(useSelector(state => state.projects));

    const dispatch = useDispatch()
    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    // const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [selectedComplexity, setSelectedComplexity] = useState('ALL')
    const [sortBy, setSortBy] = useState('newest')

    // useEffect(() => {
    //     dispatch(getProjects())
    // }, [idtoken])

    useEffect(() => {
        if (!loading) {
            setProjects(projectData)
            setFilteredProjects(projectData)
        }
    }, [loading, projectData])

    // Filter and search logic
    const filterProjects = async () => {
        let filtered = [...projects]
        console.log('filter project');

        if (searchTerm.trim() !== '') {
            const response = await axios.get(`http://127.0.0.1:5000/api/projects/searchproject?search=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${idtoken}`
                }
            })
            filtered = response.data.data

        }
        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter(project => project.category == selectedCategory)
        }
        if (selectedComplexity !== 'ALL') {
            filtered = filtered.filter(project => project.complexity == selectedComplexity)
        }
        if (sortBy == 'price-low') {
            console.log("hello");

            filtered = filtered.sort((a, b) => a.price - b.price)
        }
        if (sortBy == 'price-high') {
            filtered = filtered.sort((a, b) => b.price - a.price)
        }
        if (sortBy == 'oldest') {
            filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
        }
        if (sortBy == 'newest') {
            filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }
        setFilteredProjects(filtered)
    }

    useEffect(() => {
        filterProjects()
    }, [searchTerm, selectedCategory, selectedComplexity, projects, sortBy])



    const ProjectListItem = ({ project }) => (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center space-x-4">
                <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{project.title}</h3>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${project.category === 'SOFTWARE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                            }`}>
                            {project.category === 'SOFTWARE' ? <Code className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                            <span>{project.category}</span>
                        </div>
                        {project.is_verified && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                            <img src={project.author.avatar} alt={project.author.name} className="w-4 h-4 rounded-full" />
                            <span>{project.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{project.duration_hour}h</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{project.views}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(project.complexity)}`}>
                            {project.complexity}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="flex items-center space-x-1 text-green-400">
                            <DollarSign className="w-5 h-5" />
                            <span className="text-xl font-bold">{project.price}</span>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading projects...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Discover Projects</h1>
                            <p className="text-gray-400">Explore innovative projects from our community</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        {/* Search */}
                        <div className="relative flex-1 min-w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Categories</option>
                            <option value="SOFTWARE">Software</option>
                            <option value="HARDWARE">Hardware</option>
                        </select>

                        {/* Complexity Filter */}
                        <select
                            value={selectedComplexity}
                            onChange={(e) => setSelectedComplexity(e.target.value)}
                            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Levels</option>
                            <option value="EASY">EASY</option>
                            <option value="Medium">MEDIUM</option>
                            <option value="HARD">HARD</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            {/* <option value="popular">Most Popular</option> */}
                        </select>
                    </div>
                </div>

                {/* Projects Grid/List */}
                {/* <div className="mb-4">
                    <p className="text-gray-400 text-sm">
                        Showing {filteredProjects && filteredProjects.length} of {projects && projects.length} projects
                    </p>
                </div> */}

                {filteredProjects && filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400">No projects found matching your criteria</p>
                        </div>
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setSelectedCategory('ALL')
                                setSelectedComplexity('ALL')
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    }>
                        {filteredProjects && filteredProjects.map(project => (
                            viewMode === 'grid'
                                ? <ProjectCard key={project.project_id} project={project} />
                                : <ProjectListItem key={project.project_id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectsPage