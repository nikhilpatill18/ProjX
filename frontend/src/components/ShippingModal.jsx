import React from 'react'

const ShippingModal = ({shippingDetails,setShippingDetails,setShowShippingForm,setShowPayment}) => {
  return (
    <div>
        
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Shipping Details</h2>
            <input
                type="text"
                placeholder="Shipping Address"
                value={shippingDetails.address}
                onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                className="w-full p-2 mb-3 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            <input
                type="text"
                placeholder="Phone Number"
                value={shippingDetails.phone}
                onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                className="w-full p-2 mb-4 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => setShowShippingForm(false)}
                    className="px-4 py-2 bg-gray-600 rounded-lg text-white"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        setShowShippingForm(false)
                        setShowPayment(true)
                    }}
                    disabled={!shippingDetails.address || !shippingDetails.phone}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                >
                    Continue to Payment
                </button>
            </div>
        </div>
    </div>


      
    </div>
  )
}

export default ShippingModal
