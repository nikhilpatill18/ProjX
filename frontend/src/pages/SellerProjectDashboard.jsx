import React, { useState, useEffect, useContext } from 'react'
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Filter,
    Search,
    Calendar,
    MapPin,
    Phone,
    User,
    IndianRupee,
    Edit3,
    Save,
    X,
    ChevronDown,
    Download,
    Mail
} from 'lucide-react'
// import axios from 'axios' - Remove this for demo purposes
import { AuthContext } from '../context/AuthContext'
import { setloading } from '../store/projectSlice'
import { toast } from 'react-toastify'
import axios from 'axios'

const SellerOrdersDashboard = () => {
    const {idtoken} = useContext(AuthContext)
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [editingOrder, setEditingOrder] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)

    const fetchOrders = async () => {
        try {
            // Mock data simulating the API response structure
            const response=await axios.get('http://127.0.0.1:5000/api/projects/shipping-details',{
                headers:{
                    'Authorization':`Bearer ${idtoken}`
                }
            })
            
            setOrders(response.data.data)
            setFilteredOrders(response.data.data)
            setLoading(false)
            
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    // Filter orders
    useEffect(() => {
        let filtered = orders.filter(order => {
            const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.buyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
            
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'software' && order.category === 'SOFTWARE') ||
                                (statusFilter !== 'software' && statusFilter !== 'all' && order.status === statusFilter)
            
            const matchesCategory = categoryFilter === 'all' || order.category === categoryFilter
            
            return matchesSearch && matchesStatus && matchesCategory
        })
        setFilteredOrders(filtered)
    }, [orders, searchTerm, statusFilter, categoryFilter])

    const getStatusColor = (status, category) => {
        if (category === 'SOFTWARE') return 'text-green-400 bg-green-400/10'
        
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10'
            case 'shipped': return 'text-purple-400 bg-purple-400/10'
            case 'delivered': return 'text-green-400 bg-green-400/10'
            default: return 'text-gray-400 bg-gray-400/10'
        }
    }

    const getStatusIcon = (status, category) => {
        if (category === 'SOFTWARE') return <CheckCircle className="w-4 h-4" />
        
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />
            case 'shipped': return <Truck className="w-4 h-4" />
            case 'delivered': return <CheckCircle className="w-4 h-4" />
            default: return <AlertCircle className="w-4 h-4" />
        }
    }

    const handleStatusUpdate = (orderId, currentStatus) => {
        setEditingOrder(orderId)
        setNewStatus(currentStatus)
        setShowStatusModal(true)
    }

    const saveStatusUpdate = async () => {
        try {
            // TODO: API call to update status
            // await updateOrderStatus(editingOrder, newStatus)

            const response=await axios.patch(`http://127.0.0.1:5000/api/projects/shipping-details/${editingOrder}`,{status:newStatus},{
                headers:{
                    'Authorization':`Bearer ${idtoken}`
                }
            })
            if(response.status==200){
setOrders(prev => prev.map(order => 
                order.shipping_id === editingOrder 
                    ? { ...order, status: newStatus }
                    : order
            ))
            }
            
            
            
            setShowStatusModal(false)
            setEditingOrder(null)
            setNewStatus('')
            toast.success('Status updated successfully')
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update status')
        }
    }

    const viewOrderDetails = (order) => {
        setSelectedOrder(order)
    }

    const OrderCard = ({ order }) => (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{order.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
                                order.category === 'SOFTWARE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                            }`}>
                                <Package className="w-3 h-3" />
                                <span>{order.category}</span>
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
                                getStatusColor(order.status, order.category)
                            }`}>
                                {getStatusIcon(order.status, order.category)}
                                <span className="capitalize">{order.category === 'SOFTWARE' ? 'Completed' : order.status}</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">{order.order_date}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end text-green-400 text-lg font-semibold mb-2">
                        <IndianRupee className="w-5 h-5" />
                        <span>{order.price}</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4 text-gray-300" />
                        </button>
                        {order.category === 'HARDWARE' && (
                            <button
                                onClick={() => handleStatusUpdate(order.shipping_id, order.status)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                title="Update Status"
                            >
                                <Edit3 className="w-4 h-4 text-white" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{order.buyer.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{order.buyer.email || 'N/A'}</span>
                        </div>
                    </div>
                    {order.category === 'HARDWARE' && order.shipping_address && (
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-48">{order.shipping_address.substring(0, 30)}...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading orders...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Order Management</h1>
                    <p className="text-gray-400">Manage your project orders and shipping status</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <Package className="w-8 h-8 text-blue-400" />
                            <div>
                                <p className="text-2xl font-bold">{orders.length}</p>
                                <p className="text-gray-400 text-sm">Total Orders</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <Clock className="w-8 h-8 text-yellow-400" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === 'Pending').length}
                                </p>
                                <p className="text-gray-400 text-sm">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <Truck className="w-8 h-8 text-purple-400" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === 'Shipped').length}
                                </p>
                                <p className="text-gray-400 text-sm">Shipped</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {orders.filter(o => o.status === 'Delivered' || o.category === 'SOFTWARE').length}
                                </p>
                                <p className="text-gray-400 text-sm">Completed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="SOFTWARE">Software</option>
                                <option value="HARDWARE">Hardware</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="software">Software Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No orders found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => <OrderCard key={order.project_id} order={order} />)
                    )}
                </div>

                {/* Status Update Modal */}
                {showStatusModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-white mb-4">Update Order Status</h3>
                            <div className="space-y-4">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={()=>saveStatusUpdate()}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Update</span>
                                    </button>
                                    <button
                                        onClick={() => setShowStatusModal(false)}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">Order Details</h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center">
                                        <Package className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-white mb-2">{selectedOrder.title}</h4>
                                        <p className="text-gray-400 text-sm mb-3">{selectedOrder.description}</p>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                selectedOrder.category === 'SOFTWARE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {selectedOrder.category}
                                            </span>
                                            <span className="text-green-400 font-semibold flex items-center">
                                                <IndianRupee className="w-4 h-4" />
                                                {selectedOrder.price}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <p>Order #{selectedOrder.project_id} • {selectedOrder.order_date}</p>
                                            <p>Subject: {selectedOrder.subject} • Complexity: {selectedOrder.complexity}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                    <h5 className="text-lg font-semibold text-white mb-3">Buyer Information</h5>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-300">{selectedOrder.buyer.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-300">{selectedOrder.buyer.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-300">{selectedOrder.phone_number || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedOrder.category === 'HARDWARE' && (
                                    <div className="border-t border-gray-700 pt-4">
                                        <h5 className="text-lg font-semibold text-white mb-3">Shipping Information</h5>
                                        <div className="space-y-3">
                                            <div className="flex items-start space-x-2">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                                <span className="text-gray-300">{selectedOrder.shipping_address || 'No address provided'}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Status:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
                                                        getStatusColor(selectedOrder.status, selectedOrder.category)
                                                    }`}>
                                                        {getStatusIcon(selectedOrder.status, selectedOrder.category)}
                                                        <span className="capitalize">{selectedOrder.status}</span>
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Tracking ID:</span>
                                                    <span className="text-gray-300">{selectedOrder.tracking_id || 'Not assigned'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Courier:</span>
                                                    <span className="text-gray-300">{selectedOrder.courier_name || 'Not assigned'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Hardware Verified:</span>
                                                    <span className={`text-sm ${selectedOrder.hardware_verified ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {selectedOrder.hardware_verified ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                            {selectedOrder.video_url && (
                                                <div className="mt-3">
                                                    <span className="text-gray-400 text-sm">Demo Video:</span>
                                                    <a 
                                                        href={selectedOrder.video_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 ml-2 text-sm"
                                                    >
                                                        View Video
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SellerOrdersDashboard