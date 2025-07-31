import React from 'react'
import {
    Calendar,
    DollarSign,
    User,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    IndianRupee
} from 'lucide-react'

const History = ({ history = [] }) => {
    console.log(history);
    const getActivityIcon = (activity) => {
        switch (activity?.toLowerCase()) {
            case 'sold':
                return <TrendingUp className="w-4 h-4 text-green-400" />
            case 'bought':
                return <TrendingDown className="w-4 h-4 text-blue-400" />
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-400" />
            default:
                return <Clock className="w-4 h-4 text-gray-400" />
        }
    }

    const getActivityColor = (activity) => {
        switch (activity?.toLowerCase()) {
            case 'sold':
                return 'text-green-400 bg-green-500/20'
            case 'bought':
                return 'text-blue-400 bg-blue-500/20'
            case 'failed':
                return 'text-red-400 bg-red-500/20'
            default:
                return 'text-gray-400 bg-gray-500/20'
        }
    }

    const getPaymentStatusIcon = (status) => {
        console.log(status);
        
        switch (status?.toLowerCase()) {
            case 'succeeded':
                return <CheckCircle className="w-4 h-4 text-green-400" />
            case 'failed':
            case 'declined':
                return <XCircle className="w-4 h-4 text-red-400" />
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-400" />
            default:
                return <Clock className="w-4 h-4 text-gray-400" />
        }
    }

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'succeeded':
            case 'paid':
                return 'text-green-400 bg-green-500/20'
            case 'failed':
            case 'declined':
                return 'text-red-400 bg-red-500/20'
            case 'pending':
                return 'text-yellow-400 bg-yellow-500/20'
            default:
                return 'text-gray-400 bg-gray-500/20'
        }
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No transaction history</h3>
                <p className="text-gray-400">Your transaction history will appear here once you start buying or selling projects.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 min-w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Transaction History</h2>
                <span className="text-gray-400">{history.length} transactions</span>
            </div>

            {/* Desktop Table Header */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-4 px-6 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-sm font-medium text-gray-400">Project Name</div>
                <div className="text-sm font-medium text-gray-400">Activity</div>
                <div className="text-sm font-medium text-gray-400">Payment Status</div>
                <div className="text-sm font-medium text-gray-400">Amount</div>
                <div className="text-sm font-medium text-gray-400">Owner</div>
                <div className="text-sm font-medium text-gray-400">Date</div>
                <div className="text-sm font-medium text-gray-400">Actions</div>
            </div>

            {/* History Items */}
            <div className="space-y-3">
                {history.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-4 lg:p-6 hover:border-gray-600 transition-all duration-300"
                    >
                        {/* Mobile Layout */}
                        <div className="lg:hidden space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-white font-semibold text-lg mb-1">
                                        {item.projectname}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {getActivityIcon(item.activity)}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(item.activity)}`}>
                                            {item.activity || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <div className="text-white font-bold flex items-center">
                                <IndianRupee className='size-3'/>{item.amount/100}
                            </div>
                                    <div className="flex items-center justify-end space-x-1 mt-1">
                                                                        {getPaymentStatusIcon(item.paymentStatus)}

                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(item.paymentStatus)}`}>
                                            {item.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-300 text-sm">
                                        {item.username}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(item.paymentDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden lg:grid lg:grid-cols-7 gap-4 items-center">
                            <div className="text-white font-semibold">
                                {item.projectname || item.project_name || 'Unknown Project'}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                {getActivityIcon(item.activity)}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(item.activity)}`}>
                                    {item.activity || 'Unknown'}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                {getPaymentStatusIcon(item.paymentStatus)}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(item.paymentStatus)}`}>
                                    {item.paymentStatus}
                                </span>
                            </div>
                            
                            <div className="text-white font-bold flex items-center">
                                <IndianRupee className='size-3'/>{item.amount/100}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">
                                    {item.username}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(item.paymentDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default History