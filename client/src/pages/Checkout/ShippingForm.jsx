import React from 'react';

const ShippingForm = ({
    shippingInfo,
    paymentMethod,
    loading,
    isGeneratingQR,
    calculatedTotal,
    onInputChange,
    onPaymentMethodChange,
    onBackToCart,
    onSubmit
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Shipping & Payment</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={shippingInfo.fullName}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={onInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={shippingInfo.city}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={shippingInfo.postalCode}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={shippingInfo.country}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>

                    <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="Cash on Delivery"
                                checked={paymentMethod === "Cash on Delivery"}
                                onChange={(e) => onPaymentMethodChange(e.target.value)}
                                className="mr-3"
                            />
                            <div>
                                <span className="font-medium">Cash on Delivery</span>
                                <p className="text-sm text-gray-600">Pay when your order arrives</p>
                            </div>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="KHQR"
                                checked={paymentMethod === "KHQR"}
                                onChange={(e) => onPaymentMethodChange(e.target.value)}
                                className="mr-3"
                            />
                            <div>
                                <span className="font-medium flex items-center">
                                    KHQR Payment
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Instant
                                    </span>
                                </span>
                                <p className="text-sm text-gray-600">Pay instantly with Bakong QR</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={onBackToCart}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                        Back to Cart
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading || isGeneratingQR}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
                    >
                        {loading || isGeneratingQR ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {paymentMethod === 'KHQR' ? 'Generating QR...' : 'Placing Order...'}
                            </div>
                        ) : (
                            paymentMethod === 'KHQR'
                                ? `Pay with KHQR ($${calculatedTotal.toFixed(2)})`
                                : `Place Order ($${calculatedTotal.toFixed(2)})`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingForm;