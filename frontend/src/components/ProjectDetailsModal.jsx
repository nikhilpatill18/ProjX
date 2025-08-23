import React, { useContext, useEffect, useState } from 'react'
import PaymentModal from './PaymentModal'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from '../libs/api'
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
    ExternalLink,
    MapPin,
    Phone,
    Truck,
    Package,
    Video
} from 'lucide-react'
import ShippingModal from './ShippingModal'

const ProjectDetailsModal = ({ project, onClose, handlebookmark, isBookmarked, unlock = false }) => {
    console.log(project.category);
    
    const [showShippingForm, setShowShippingForm] = useState(false)
    const [shippingDetails, setShippingDetails] = useState({
        address: '',
        phone: ''
    })

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

    const getShippingStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10'
            case 'processing': return 'text-blue-400 bg-blue-400/10'
            case 'shipped': return 'text-purple-400 bg-purple-400/10'
            case 'delivered': return 'text-green-400 bg-green-400/10'
            case 'cancelled': return 'text-red-400 bg-red-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }

    const handleBookmark = async () => {
        handlebookmark()
    }

    const handleLike = () => {
        setIsLiked(!isLiked)
        console.log(`Project ${isLiked ? 'unliked' : 'liked'}:`, project.project_id)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: project.title,
                text: project.description,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    const handleBuynow = () => {
        if (project.category === 'HARDWARE') {
            setShowShippingForm(true)
        } else {
            setShowPayment(true)
        }
    }

    const renderProjectSpecificDetails = () => {
        if (project.category === 'SOFTWARE') {
            return (
                <>
                    {/* Tech Stack */}
                    {project.Project_data?.tech_stack && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.Project_data.tech_stack.split(', ').map((tech, index) => (
                                    <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700">
                                        {tech.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Software Project Features */}
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
                </>
            )
        } else if (project.category === 'HARDWARE') {
            return (
                <>
                    {/* Hardware Video */}
                    {project.Project_data?.video_url && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-white">Demo Video</h3>
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                                <a
                                    href={project.Project_data.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center sm:justify-start space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <Video className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm sm:text-base">Watch Project Demo</span>
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Shipping Information */}
                    {unlockDetails && project.Project_data && (
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Shipping Information</h3>
                            <div className="space-y-3">
                                {project.Project_data['Shipping address'] && (
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-300">Delivery Address</p>
                                            <p className="text-gray-400 text-sm break-words">{project.Project_data['Shipping address']}</p>
                                        </div>
                                    </div>
                                )}
                                {project.Project_data.phonenumber && (
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-300">Contact Number</p>
                                            <p className="text-gray-400 text-sm">{project.Project_data.phonenumber}</p>
                                        </div>
                                    </div>
                                )}
                                {project.Project_data.status && (
                                    <div className="flex items-center space-x-3">
                                        <Truck className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-300">Shipping Status</p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getShippingStatusColor(project.Project_data.status)}`}>
                                                {project.Project_data.status}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Hardware Project Features */}
                    {unlockDetails && (
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Hardware Package Includes</h3>
                            <div className="text-gray-300 space-y-2">
                                <p>✅ Complete hardware components</p>
                                <p>✅ Detailed assembly instructions</p>
                                <p>✅ Circuit diagrams and schematics</p>
                                <p>✅ Required software/firmware</p>
                                <p>✅ 30-day warranty and support</p>
                            </div>
                        </div>
                    )}
                </>
            )
        }
        return null
    }

    const renderDownloadSection = () => {        
        if (project.category === 'SOFTWARE' && unlockDetails) {
            return (
                <div className="space-y-3">
                    {project.Project_data?.repo_url && (
                        <>
                            <a
                                href={`${project.Project_data.repo_url}/archive/refs/heads/main.zip`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download Zip</span>
                            </a>
                            <a
                                href={project.Project_data.repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                            >
                                <Github className="w-4 h-4" />
                                <span>Repository</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </>
                    )}
                </div>
            )
        } else if (project.category === 'HARDWARE' && unlockDetails) {
            return (
                <div className="space-y-3">
                    {project.Project_data?.video_url && (
                        <a
                            href={project.Project_data.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                            <Play className="w-4 h-4" />
                            <span>View Demo</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                        <Package className="w-5 h-5 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 text-sm">
                            Hardware will be shipped to your address
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <>
            {/* Overlay with proper responsive padding */}
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-700">
                    {/* Header - Responsive */}
                    <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-3 sm:p-4 lg:p-6 flex items-center justify-between z-10">
                        <button
                            onClick={onClose}
                            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                                onClick={handleBookmark}
                                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                                    }`}
                            >
                                <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                            <button
                                onClick={handleLike}
                                className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isLiked ? 'text-red-400 fill-current' : 'text-gray-400 hover:text-red-400'
                                    }`} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-blue-400" />
                            </button>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4 lg:p-6">
                        {/* Mobile-first responsive grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            {/* Left Column - Images and Details */}
                            <div className="space-y-4 sm:space-y-6">
                                {/* Image Gallery - Responsive height */}
                                <div className="relative">
                                    <img
                                        src={project.images && project.images.length > 0 ? project.images[currentImageIndex] : '/placeholder-image.jpg'}
                                        alt={project.title}
                                        className="w-full h-48 sm:h-60 md:h-72 lg:h-80 object-cover rounded-lg sm:rounded-xl"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg'
                                        }}
                                    />
                                    {project.images && project.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </>
                                    )}
                                    {project.images && project.images.length > 1 && (
                                        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                                            {project.images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Project Info */}
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center flex-wrap gap-2 mb-2">
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
                                            
                                            {/* Responsive title sizing */}
                                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 break-words">{project.title}</h1>
                                            {project.subject && (
                                                <p className="text-blue-400 text-base sm:text-lg mb-2">{project.subject}</p>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{project.description}</p>

                                    {/* Stats - Responsive layout */}
                                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-400">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span>{project.duration_hours}h</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span>{project.stats?.views || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span>{project.stats?.likes || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span>{project.stats?.downloads || 0}</span>
                                        </div>
                                    </div>

                                    {/* Category-specific details */}
                                    {renderProjectSpecificDetails()}
                                </div>
                            </div>

                            {/* Right Column - Purchase and Additional Info */}
                            <div className="space-y-4 sm:space-y-6">
                                {/* Purchase Card - Mobile optimized */}
                                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 xl:sticky xl:top-6">
                                    <div className="text-center mb-4 sm:mb-6">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
                                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{project.price}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm sm:text-base">One-time purchase</p>
                                    </div>

                                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                        <button
                                            onClick={handleBuynow}
                                            disabled={project.status === 'sold'}
                                            className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base ${project.status === 'sold'
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span>{project.status === 'sold' ? 'Sold Out' : 'Buy Now'}</span>
                                        </button>

                                        {unlockDetails ? (
                                            renderDownloadSection()
                                        ) : (
                                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 sm:p-4 text-center">
                                                <p className="text-yellow-400 text-xs sm:text-sm">
                                                    🔒 Complete the payment process to unlock project details and access {project.category === 'HARDWARE' ? 'hardware information' : 'links'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Project details table */}
                                    <div className="border-t border-gray-700 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                                        <div className="flex items-center justify-between text-xs sm:text-sm">
                                            <span className="text-gray-400">Complexity</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(project.complexity)}`}>
                                                {project.complexity}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs sm:text-sm">
                                            <span className="text-gray-400">Estimated Time</span>
                                            <span className="text-white">{project.duration_hours} hours</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs sm:text-sm">
                                            <span className="text-gray-400">Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        {project.category === 'HARDWARE' && project.Project_data?.status && unlockDetails && (
                                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                                <span className="text-gray-400">Shipping</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getShippingStatusColor(project.Project_data.status)}`}>
                                                    {project.Project_data.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Author Card - Mobile optimized */}
                                {project.author && (
                                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
                                        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">About the Creator</h3>
                                        <div className="flex items-start space-x-3 sm:space-x-4">
                                            <img
                                                src={project.author.profile_photo || `https://ui-avatars.com/api/?name=${project.author.email}&background=0D8ABC&color=fff`}
                                                alt={project.author.name}
                                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = '/default-avatar.jpg'
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white text-sm sm:text-base truncate">{project.author.full_name || project.author.name}</h4>
                                                <div className="flex items-center space-x-1 mb-2">
                                                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                                                    <span className="text-yellow-400 font-medium text-xs sm:text-sm">{project.author.rating || '5.0'}</span>
                                                    <span className="text-gray-400 text-xs sm:text-sm">• {project.author.projects_completed || 0} projects</span>
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-400 mb-3">
                                                    Avg. response time: {project.author.response_time || '2 hours'}
                                                </div>
                                                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-1.5 sm:py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm">
                                                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span>Contact Creator</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Reviews - Mobile optimized */}
                                {project.reviews && project.reviews.length > 0 && (
                                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6">
                                        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Recent Reviews</h3>
                                        <div className="space-y-3 sm:space-y-4">
                                            {project.reviews.map((review, index) => (
                                                <div key={index} className="border-b border-gray-700 pb-3 sm:pb-4 last:border-0 last:pb-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-white text-sm sm:text-base truncate flex-1 mr-2">{review.user}</span>
                                                        <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-300 text-xs sm:text-sm mb-1">{review.comment}</p>
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

            {/* Modals */}
            {showShippingForm && (
                <ShippingModal 
                    setShippingDetails={setShippingDetails} 
                    shippingDetails={shippingDetails} 
                    setShowPayment={setShowPayment} 
                    setShowShippingForm={setShowShippingForm}
                />
            )}

            {showPayment && (
                <Elements stripe={stripePromise}>
                    <PaymentModal
                        project={project}
                        setShowPayment={setShowPayment}
                        setUnlockDetails={setUnlockDetails}
                        shippingDetails={shippingDetails}
                    />
                </Elements>
            )}
        </>
    )
}

export default ProjectDetailsModal