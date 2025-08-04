import React, { useState } from 'react'
import { auth } from '../libs/Firebase'
import { sendEmailVerification } from 'firebase/auth'
import { toast } from 'react-toastify'
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const VerifyEmail = () => {
    const [emailSent, setEmailSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const resendVerifyEmail = async () => {
        setIsLoading(true)
        try {
            await sendEmailVerification(auth.currentUser)
            toast.info('Verification link sent to your email')
            setEmailSent(true)
        } catch (error) {
            console.log(error)
            toast.error('Failed to send verification email')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Card Container */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
                    {/* Header Icon */}
                    <div className="text-center mb-6">
                        <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                        <p className="text-gray-400">
                            We've sent a verification email to:
                        </p>
                        <p className="text-blue-400 font-semibold mt-1 break-all">
                            {auth.currentUser?.email}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {!emailSent ? (
                            <div className="text-center">
                                <p className="text-gray-300 mb-6">
                                    Check your inbox and click the verification link to continue.
                                </p>
                                <button
                                    onClick={resendVerifyEmail}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5" />
                                            <span>Resend Verification Email</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                                <p className="text-green-400 font-semibold mb-4">
                                    ✅ Verification email sent successfully!
                                </p>
                                <p className="text-gray-300 text-sm">
                                    Please check your email and click the verification link.
                                </p>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-2">Next Steps:</h3>
                            <ul className="text-gray-300 text-sm space-y-1">
                                <li>1. Check your email inbox</li>
                                <li>2. Click the verification link</li>
                                <li>3. Return here and refresh the page</li>
                                <li>4. Login again to continue</li>
                            </ul>
                        </div>

                        {/* Back to Login */}
                        <div className="text-center pt-4 border-t border-gray-700">
                            <NavLink
                                to="/login"
                                className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Login</span>
                            </NavLink>
                        </div>
                    </div>
                </div>

                {/* Additional Help */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Didn't receive the email? Check your spam folder or contact support.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail