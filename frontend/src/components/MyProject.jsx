import React from 'react'
import { Pencil, Trash2, Clock, DollarSign, Code, Cpu, IndianRupee, Eye, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MyProjectCard = ({ project, onEdit, onDelete }) => {
    const navigate = useNavigate()
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
            case 'pending': return 'text-yellow-400 bg-yellow-400/10'
            case 'sold': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }

    const handleViewDeatils = () => {
        navigate(`/projects/${project.project_id}`)

    }

    return (
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
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                    </div>
                </div>

                {/* Action buttons in top right */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={() => onEdit(project)}
                        className="p-2 bg-black/50 text-blue-400 rounded-full hover:bg-black/70 transition-all duration-200"
                        title="Edit Project"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(project._id)}
                        className="p-2 bg-black/50 text-red-400 rounded-full hover:bg-black/70 transition-all duration-200"
                        title="Delete Project"
                    >
                        <Trash2 className="w-4 h-4" />
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
                            <span>{project.duration_hours || 'N/A'}h</span>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(project.complexity)}`}>
                        {project.complexity || 'Medium'}
                    </div>
                </div>

                {/* Tech Stack */}
                {project.tech_stack && (
                    <div className="flex flex-wrap gap-2">
                        {project.tech_stack.split(', ').slice(0, 4).map((tech, index) => (
                            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                {tech.trim()}
                            </span>
                        ))}
                        {project.tech_stack.split(', ').length > 4 && (
                            <span className="bg-gray-600 text-gray-400 px-2 py-1 rounded text-xs">
                                +{project.tech_stack.split(', ').length - 4} more
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
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2" onClick={handleViewDeatils}>
                            <span>View Details</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProjectCard