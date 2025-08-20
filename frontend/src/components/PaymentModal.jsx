import React, { useContext, useState } from 'react'
import {
    IndianRupee,
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
    Download,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    CreditCard,
    Smartphone,
    Wallet,
    Shield
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import axios from '../libs/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { updateStatus, setloading, clearloading } from '../store/projectSlice';
import { useDispatch } from 'react-redux';
import { UpdateProjectStatus } from '../store/projectSlice';
import axios from '../libs/api'


const PaymentModal = ({ project, setShowPayment, setUnlockDetails, shippingDetails }) => {
    const dispatch = useDispatch()
    const [upiId, setUpiId] = useState()
    const { idtoken } = useContext(AuthContext)
    const [price, setprice] = useState(project.price)
    const [platformfees, setplatformfees] = useState(Math.round(project.price * 0.05))
    const [totalamount, settotalamount] = useState((price + platformfees) * 100)
    const [paymentMethod, setPaymentMethod] = useState('card')
    const projectId = project.project_id;
    const stripe = useStripe();
    const element = useElements();
    const CreatePaymentIntent = async () => {
        try {
            const formdata = new FormData()
            formdata.append('amount', totalamount)
            formdata.append('project_id', projectId)
            const response = await axios.post('/api/payment/create-payment-intent', formdata, { headers: { 'Authorization': `Bearer ${idtoken}` } })
            const clientSecret = response.data.clientSecret;
            return clientSecret

        } catch (error) {
            console.log(error);


        }

    }

    const handleShpping= async()=>{
        try {
            console.log(shippingDetails.address);
            console.log(shippingDetails.phone);
            const formData=new FormData()
            formData.append('address',shippingDetails.address)
            formData.append('phonenumber',shippingDetails.phone)
           const response=await axios.post(`http://localhost:5000/api/projects/shipping-details/${project.project_id}`,formData,{
            headers:{
                'Authorization':`Bearer ${idtoken}`
            }
           })
           if(response.status==200){
            return
           }
            
        } catch (error) {
            console.log(error);
        }
    }
    const handlePayement = async () => {
        try {
            const clientSecret = await CreatePaymentIntent()
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: element.getElement(CardElement)
                }
            })
            if (result.paymentIntent.status === 'succeeded') {
                await axios.post("http://localhost:5000/api/payment/update-status", {
                    payment_intent_id: result.paymentIntent.id,
                    status: "succeeded",
                });
                handleShpping()
                setShowPayment(false)
                toast.success('Payment successFull')
                setUnlockDetails(true)
                dispatch(updateStatus(project.project_id))
                dispatch(UpdateProjectStatus(project.project_id))
            }
            else {
                toast.error('Failed  the payment details')
            }

        } catch (error) {
            console.log(error);


        }

    }

    const handleUPIPayment = async () => {

        try {
            const clientSecret = await CreatePaymentIntent();
            const result = await stripe.confirmPayment({
                clientSecret,
                paymentMethod: {
                    type: 'upi',
                    upi: {
                        vpa: upiId,
                    }
                }

            })
            if (result.error) {
                console.error(result.error.message);
                alert("Payment failed: " + result.error.message);
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                await axios.post('http://localhost:5000/api/payment/update-status', {
                    payment_intent_id: result.paymentIntent.id,
                    status: 'succeeded',
                });
                alert('UPI payment successful!');
            } else {
                alert('UPI payment initiated, waiting for confirmation...');
            }

        } catch (error) {
            console.error(error);
            alert("UPI payment error occurred.");

        }

    }
    return (
        <div>

            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
                <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Complete Purchase</h3>
                        <button
                            onClick={() => setShowPayment(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Order Summary */}
                        <div className="bg-gray-900 rounded-lg p-4">
                            <h4 className="font-semibold text-white mb-2">Order Summary</h4>
                            <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>{project.title}</span>
                                <span>₹{project.price}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300 mb-2">
                                <span>Platform fee</span>
                                <span>₹{Math.round(project.price * 0.05)}</span>
                            </div>
                            <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-white">
                                <span>Total</span>
                                <span>₹{project.price + Math.round(project.price * 0.05)}</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div>
                            <h4 className="font-semibold text-white mb-3">Payment Method</h4>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-500"
                                    />
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                    <span className="text-white">Credit/Debit Card</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-500">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-500"
                                    />
                                    <Smartphone className="w-5 h-5 text-gray-400" />
                                    <span className="text-white">UPI</span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Form */}
                        {paymentMethod === 'card' && (
                            <div className="space-y-2">
                                <label className="text-white text-sm font-medium">Card Details</label>
                                <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus-within:border-blue-500 transition-all">
                                    <CardElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: '16px',
                                                    color: '#ffffff',
                                                    fontFamily: 'Inter, sans-serif',
                                                    '::placeholder': {
                                                        color: '#aab7c4',
                                                    },
                                                },
                                                invalid: {
                                                    color: '#ff4d4f',
                                                    iconColor: '#ff4d4f',
                                                },
                                            },
                                            hidePostalCode: true,
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={handlePayement}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Pay Secure
                                </button>
                            </div>
                        )}

                        {/* for now it is now working */}
                        {paymentMethod === 'upi' && (
                            <div className="space-y-2">
                                <label className="text-white text-sm font-medium">UPI ID</label>
                                <input
                                    type="text"
                                    placeholder="example@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                                />
                                <button
                                    onClick={handleUPIPayment}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Pay with UPI
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            </div>

        </div>
    )
}

export default PaymentModal
