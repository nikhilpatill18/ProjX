import React, { useState, useEffect, useContext } from 'react'
import {
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
    Download
} from 'lucide-react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import ProjectCard from '../components/ProjectCard'

const ProjectsPage = () => {
    const { idtoken } = useContext(AuthContext)
    console.log(idtoken);

    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [selectedComplexity, setSelectedComplexity] = useState('ALL')
    const [sortBy, setSortBy] = useState('newest')

    const getProject = async () => {
        try {

            const response = await axios.get('http://127.0.0.1:5000/api/projects/getproject', {
                headers: {
                    'Authorization': `Bearer ${idtoken}`
                }
            }
            )
            console.log(response);

            if (response.status == 200) {
                setProjects(response.data.data)
                setLoading(false)
            }
            else {
                toast.error('Unbale to load the projects')
            }

        } catch (error) {
            toast.error('Unbale to load the projects')
        }
    }

    // Mock data - replace with API call
    useEffect(() => {
        // const mockProjects = [
        //     {
        //         id: 1,
        //         title: 'E-commerce React App',
        //         description: 'A full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.',
        //         category: 'SOFTWARE',
        //         complexity: 'Advanced',
        //         price: 149,
        //         duration_hour: 120,
        //         subject: 'Web Development',
        //         tech_stack: 'React, Node.js, MongoDB, Express',
        //         repo_url: 'https://github.com/user/ecommerce-app',
        //         is_verified: true,
        //         author: {
        //             name: 'John Doe',
        //             avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        //             rating: 4.8
        //         },
        //         images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop'],
        //         likes: 234,
        //         views: 1520,
        //         created_at: '2024-01-15',
        //         featured: true
        //     },
        //     {
        //         id: 2,
        //         title: 'Smart Home IoT System',
        //         description: 'Arduino-based smart home automation system with sensors, actuators, and mobile app control. Includes temperature monitoring, lighting control, and security features.',
        //         category: 'HARDWARE',
        //         complexity: 'Intermediate',
        //         price: 89,
        //         duration_hour: 80,
        //         subject: 'IoT',
        //         tech_stack: 'Arduino, ESP32, Flutter',
        //         is_verified: true,
        //         author: {
        //             name: 'Sarah Wilson',
        //             avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9227d7e?w=40&h=40&fit=crop&crop=face',
        //             rating: 4.9
        //         },
        //         images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'],
        //         likes: 189,
        //         views: 892,
        //         created_at: '2024-01-10',
        //         featured: false
        //     },
        //     {
        //         id: 3,
        //         title: 'Machine Learning Classifier',
        //         description: 'Python-based machine learning project for image classification using TensorFlow. Includes data preprocessing, model training, and web interface.',
        //         category: 'SOFTWARE',
        //         complexity: 'Expert',
        //         price: 199,
        //         duration_hour: 160,
        //         subject: 'Machine Learning',
        //         tech_stack: 'Python, TensorFlow, Flask',
        //         repo_url: 'https://github.com/user/ml-classifier',
        //         is_verified: true,
        //         author: {
        //             name: 'Alex Chen',
        //             avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        //             rating: 4.7
        //         },
        //         images: ['https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop'],
        //         likes: 156,
        //         views: 743,
        //         created_at: '2024-01-08',
        //         featured: true
        //     },
        //     {
        //         id: 4,
        //         title: 'Mobile Chat Application',
        //         description: 'Real-time chat application built with React Native and Firebase. Features include group chats, file sharing, and push notifications.',
        //         category: 'SOFTWARE',
        //         complexity: 'Intermediate',
        //         price: 79,
        //         duration_hour: 60,
        //         subject: 'Mobile Development',
        //         tech_stack: 'React Native, Firebase',
        //         repo_url: 'https://github.com/user/chat-app',
        //         is_verified: false,
        //         author: {
        //             name: 'Maria Garcia',
        //             avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        //             rating: 4.6
        //         },
        //         images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop'],
        //         likes: 98,
        //         views: 456,
        //         created_at: '2024-01-05',
        //         featured: false
        //     },
        //     {
        //         id: 5,
        //         title: 'Robotic Arm Controller',
        //         description: 'Custom robotic arm with servo motors and Arduino control. Includes 3D printed parts, assembly guide, and programming interface.',
        //         category: 'HARDWARE',
        //         complexity: 'Advanced',
        //         price: 129,
        //         duration_hour: 100,
        //         subject: 'Robotics',
        //         tech_stack: 'Arduino, Servo Motors, 3D Printing',
        //         is_verified: true,
        //         author: {
        //             name: 'David Kim',
        //             avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        //             rating: 4.8
        //         },
        //         images: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop'],
        //         likes: 267,
        //         views: 1234,
        //         created_at: '2024-01-03',
        //         featured: true
        //     },
        //     {
        //         id: 6,
        //         title: 'Blockchain Voting System',
        //         description: 'Decentralized voting application using Ethereum smart contracts. Features transparent voting, candidate management, and result verification.',
        //         category: 'SOFTWARE',
        //         complexity: 'Expert',
        //         price: 249,
        //         duration_hour: 180,
        //         subject: 'Blockchain',
        //         tech_stack: 'Solidity, Web3.js, React',
        //         repo_url: 'https://github.com/user/blockchain-voting',
        //         is_verified: true,
        //         author: {
        //             name: 'Emma Thompson',
        //             avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
        //             rating: 4.9
        //         },
        //         images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop'],
        //         likes: 312,
        //         views: 1876,
        //         created_at: '2024-01-01',
        //         featured: true
        //     }
        // ]
        getProject()

        // setTimeout(() => {
        //     setProjects(mockProjects)
        //     setFilteredProjects(mockProjects)
        //     setLoading(false)
        // }, 1000)
    }, [])

    // Filter and search logic
    const search = async (searchTerm) => {
        const response = await axios.get(`http://127.0.0.1:5000/api/projects/searchproject?search=${searchTerm}`, {
            headers: {
                'Authorization': `Bearer ${idtoken}`
            }
        })
        console.log(response);
    }
    useEffect(() => {
        search(searchTerm)
        let filtered = projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.subject.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesCategory = selectedCategory === 'ALL' || project.category === selectedCategory
            const matchesComplexity = selectedComplexity === 'ALL' || project.complexity === selectedComplexity

            return matchesSearch && matchesCategory && matchesComplexity
        })

        // Sort projects
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at)
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at)
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'popular':
                    return b.likes - a.likes
                default:
                    return 0
            }
        })

        setFilteredProjects(filtered)
    }, [projects, searchTerm, selectedCategory, selectedComplexity, sortBy])


    const getComplexityColor = (complexity) => {
        switch (complexity) {
            case 'Beginner': return 'text-green-400 bg-green-400/10'
            case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10'
            case 'Advanced': return 'text-orange-400 bg-orange-400/10'
            case 'Expert': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }



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

                    {/* Stats */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Projects</p>
                                    <p className="text-white text-xl font-bold">{projects.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Verified Projects</p>
                                    <p className="text-white text-xl font-bold">{projects.filter(p => p.is_verified).length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Users className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Active Contributors</p>
                                    <p className="text-white text-xl font-bold">{new Set(projects.map(p => p.author.name)).size}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Award className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Featured Projects</p>
                                    <p className="text-white text-xl font-bold">{projects.filter(p => p.featured).length}</p>
                                </div>
                            </div>
                        </div>
                    </div> */}

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
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
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
                <div className="mb-4">
                    <p className="text-gray-400 text-sm">
                        Showing {filteredProjects.length} of {projects.length} projects
                    </p>
                </div>

                {filteredProjects.length === 0 ? (
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
                        {filteredProjects.map(project => (
                            viewMode === 'grid'
                                ? <ProjectCard key={project.id} project={project} />
                                : <ProjectListItem key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectsPage