import React, { useContext, useEffect, useState } from 'react'
import PaymentModal from './PaymentModal'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios'
import {
    IndianRupee,
    Code,
    Cpu,
    Star,
    Clock,
    Eye,
    Github,
    CheckCircle,
    Heart,
    Share2,
    Download,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    CreditCard,
    ArrowLeft,
    Play,
    MessageCircle,
    Bookmark,
    BookOpen,
    ExternalLink
} from 'lucide-react'


const ProjectDetailsModal = ({ project, onClose, handlebookmark, isBookmarked, unlock = false }) => {
    const stripePromise = loadStripe('pk_test_51R0dUjCHGVpdj2fgW4VGu8dZwYARmW61cJCPktkINkKAphZmbQlHPqTb42tJsUAPpExgvqmtNK6SRXKsMOZgmRHX00PCIvNb8y')
    const [showPayment, setShowPayment] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [unlockDetails, setUnlockDetails] = useState(unlock)
    const [loading, setLoading] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }

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
        }
    }

    const handleBookmark = async () => {
        handlebookmark()
    }

    const handleLike = () => {
        setIsLiked(!isLiked)
        // Add API call to like/unlike
        console.log(`Project ${isLiked ? 'unliked' : 'liked'}:`, project.project_id)
    }

    const handleShare = () => {
        // Add share functionality
        if (navigator.share) {
            navigator.share({
                title: project.title,
                text: project.description,
                url: window.location.href
            })
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-700">
                    {/* Header */}
                    <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between z-10">
                        <button
                            onClick={onClose}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleBookmark}
                                className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                                    }`}
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={handleLike}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-400 fill-current' : 'text-gray-400 hover:text-red-400'
                                    }`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Share2 className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Left Column - Images and Details */}
                            <div className="space-y-6">
                                {/* Image Gallery */}
                                <div className="relative">
                                    <img
                                        src={project.images && project.images.length > 0 ? project.images[currentImageIndex] : '/placeholder-image.jpg'}
                                        alt={project.title}
                                        className="w-full h-80 object-cover rounded-xl"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg'
                                        }}
                                    />
                                    {project.images && project.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {project.images && project.images.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                                            {project.images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Project Info */}
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2 flex-wrap">
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
                                                {project.software?.readme_verified && (
                                                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                                                        <BookOpen className="w-3 h-3" />
                                                        <span>README</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                                            {project.subject && (
                                                <p className="text-blue-400 text-lg mb-2">{project.subject}</p>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-300 leading-relaxed">{project.description}</p>

                                    {/* Stats */}
                                    <div className="flex items-center space-x-6 text-sm text-gray-400 flex-wrap gap-2">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{project.duration_hours} hours</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{project.stats?.views || 0} views</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{project.stats?.likes || 0} likes</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Download className="w-4 h-4" />
                                            <span>{project.stats?.downloads || 0} downloads</span>
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    {project.software?.tech_stack && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-3">Tech Stack</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.software.tech_stack.split(', ').map((tech, index) => (
                                                    <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700">
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Project Features or Description Details */}
                                    {unlockDetails && (
                                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                                            <h3 className="text-lg font-semibold text-white mb-3">Project Details</h3>
                                            <div className="text-gray-300 space-y-2">
                                                <p>✅ Complete source code with documentation</p>
                                                <p>✅ Step-by-step implementation guide</p>
                                                <p>✅ All necessary dependencies included</p>
                                                <p>✅ Responsive design for all devices</p>
                                                <p>✅ 30-day support included</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Purchase and Additional Info */}
                            <div className="space-y-6">
                                {/* Purchase Card */}
                                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-6">
                                    <div className="text-center mb-6">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <IndianRupee className="w-8 h-8 text-green-400" />
                                            <span className="text-4xl font-bold text-white">₹{project.price}</span>
                                        </div>
                                        <p className="text-gray-400">One-time purchase</p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <button
                                            onClick={() => setShowPayment(true)}
                                            disabled={project.status === 'sold'}
                                            className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${project.status === 'sold'
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            <span>{project.status === 'sold' ? 'Sold Out' : 'Buy Now'}</span>
                                        </button>

                                        {unlockDetails ? (
                                            <div className="space-y-3">
                                                {project.Project_data && (
                                                    <a
                                                        href={project.Project_data.repo_rul}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        <span>Live Demo</span>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {project.Project_data?.repo_url && (
                                                    <a
                                                        href={project.Project_data.repo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                                    >
                                                        <Github className="w-4 h-4" />
                                                        <span>Repository</span>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                                                <p className="text-yellow-400 text-sm">
                                                    🔒 Complete the payment process to unlock project details and access links
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-700 pt-4 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Complexity</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(project.complexity)}`}>
                                                {project.complexity}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Estimated Time</span>
                                            <span className="text-white">{project.duration_hours} hours</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Author Card */}
                                {project.author && (
                                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">About the Creator</h3>
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={project.author.avatar || '/default-avatar.jpg'}
                                                alt={project.author.name}
                                                className="w-16 h-16 rounded-full"
                                                onError={(e) => {
                                                    e.target.src = '/default-avatar.jpg'
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white">{project.author.fullname || project.author.name}</h4>
                                                <div className="flex items-center space-x-1 mb-2">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-yellow-400 font-medium">{project.author.rating || '5.0'}</span>
                                                    <span className="text-gray-400">• {project.author.projects_completed || 0} projects</span>
                                                </div>
                                                <div className="text-sm text-gray-400 mb-3">
                                                    Avg. response time: {project.author.response_time || '2 hours'}
                                                </div>
                                                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>Contact Creator</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Reviews */}
                                {project.reviews && project.reviews.length > 0 && (
                                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Recent Reviews</h3>
                                        <div className="space-y-4">
                                            {project.reviews.map((review, index) => (
                                                <div key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-white">{review.user}</span>
                                                        <div className="flex items-center space-x-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 text-sm mb-1">{review.comment}</p>
                                                    <span className="text-gray-500 text-xs">{review.date}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPayment && (
                <Elements stripe={stripePromise}>
                    <PaymentModal
                        project={project}
                        setShowPayment={setShowPayment}
                        setUnlockDetails={setUnlockDetails}
                    />
                </Elements>
            )}
        </>
    )
}

export default ProjectDetailsModal