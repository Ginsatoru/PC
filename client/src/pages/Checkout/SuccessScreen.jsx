import React from 'react';

const SuccessScreen = ({ orderPlaced, cartItems, paymentMethod, setCurrentPage }) => {
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                    <div className="text-green-600 text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {paymentMethod === 'KHQR' ? 'Payment Successful!' : 'Order Placed Successfully!'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Thank you for your purchase. You will be redirected to your dashboard shortly.
                    </p>
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Your cart is empty
                    </h2>
                    <button
                        onClick={() => setCurrentPage('products')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default SuccessScreen;