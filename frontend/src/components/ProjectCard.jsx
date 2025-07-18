import React from 'react'
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

const ProjectCard = ({ project }) => {
    console.log(project);

    const getComplexityColor = (complexity) => {
        switch (complexity) {
            case 'Beginner': return 'text-green-400 bg-green-400/10'
            case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10'
            case 'Advanced': return 'text-orange-400 bg-orange-400/10'
            case 'Expert': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }
    return (
        <div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group">

                {/* Project Image */}
                <div className="relative mb-4">
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg"
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
                    </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {project.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                                <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
                            </button>
                            <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                                <Share2 className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2">
                        {project.description}
                    </p>

                    {/* Author Info */}
                    {/* <div className="flex items-center space-x-3">
                        <img
                            src={project.author.avatar}
                            alt={project.author.name}
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                            <p className="text-white text-sm font-medium">{project.author.name}</p>
                            <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-gray-400 text-xs">{project.author.rating}</span>
                            </div>
                        </div>
                    </div> */}

                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{project.duration_hour}h</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{project.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{project.likes}</span>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(project.complexity)}`}>
                            {project.complexity}
                        </div>
                    </div>

                    {/* Tech Stack */}
                    {/* <div className="flex flex-wrap gap-2">
                        {project.tech_stack.split(', ').slice(0, 3).map((tech, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                {tech}
                            </span>
                        ))}
                    </div> */}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <span className="text-2xl font-bold text-white">{project.price}</span>
                        </div>
                        <div className="flex space-x-2">
                            {project.repo_url && (
                                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                    <Github className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                                <span>View Details</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProjectCard
