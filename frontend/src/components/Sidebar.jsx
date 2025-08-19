import React, { useState, useContext } from 'react'
import {
    LayoutDashboard,
    Plus,
    FolderOpen,
    Settings,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,ListOrderedIcon
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../libs/Firebase'
import { signOut } from 'firebase/auth'
import { AuthContext } from '../context/AuthContext'
const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const navigate = useNavigate()
    const { userprofile } = useContext(AuthContext)


    const handleLogout = async () => {
        try {
            await signOut(auth)
            localStorage.removeItem('idtoken')
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/dashboard',
            color: 'text-blue-400'
        },
        {
            icon: Plus,
            label: 'Add Project',
            path: '/add-project',
            color: 'text-green-400'
        },
        {
            icon: FolderOpen,
            label: 'Your Project',
            path: '/your-project',
            color: 'text-purple-400'
        },

        {
            icon: User,
            label: 'User Profile',
            path: '/profile',
            color: 'text-cyan-400'
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/setting',
            color: 'text-gray-400'
        },
        {
            icon: ListOrderedIcon,
            label: 'Orders',
            path: '/orders',
            color: 'text-gray-400'
        },
    ]

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
                <Menu className="w-5 h-5 text-white" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* Desktop Sidebar */}
            <div className={`hidden md:flex flex-col bg-gray-800 border-r border-gray-700 h-screen sticky top-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-72'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 gap-2 border-b border-gray-700">
                    <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-xl">ProjX</span>
                            </div>
                        )}
                    </div>


                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronLeft className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg'
                                    : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                } ${isCollapsed ? 'justify-center' : ''}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : item.color
                                        } group-hover:scale-110 transition-transform flex-shrink-0`} />

                                    {!isCollapsed && (
                                        <span className="font-medium text-base truncate">
                                            {item.label}
                                        </span>
                                    )}

                                    {isActive && !isCollapsed && (
                                        <div className="absolute right-3 w-2 h-2 bg-blue-400 rounded-full"></div>
                                    )}

                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                            {item.label}
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Section & Logout */}
                <div className="p-4 border-t border-gray-700">
                    {/* User info */}
                    <div className={`flex items-center space-x-3 p-4 rounded-xl bg-gray-700/50 mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{userprofile?.fullname}</p>
                                <p className="text-gray-400 text-sm truncate">{userprofile.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="font-medium">Logout</span>
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed left-0 top-0 h-full w-80 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 z-50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-xl">ProjX</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white'
                                        : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                    }`
                                }
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : item.color
                                            } group-hover:scale-110 transition-transform`} />
                                        <span className="font-medium text-base">{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Mobile User Section */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-700/50 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{userprofile?.fullname}</p>
                                <p className="text-gray-400 text-sm truncate">{userprofile?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all duration-200 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar