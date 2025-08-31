import React from 'react';

const OrderSummary = ({ cartItems, itemsPrice, taxPrice, shippingPrice, calculatedTotal }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div
                        key={item._id}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <div className="flex items-center">
                            <img
                                src={item.image || "/placeholder-image.jpg"}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded mr-3"
                            />
                            <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {item.brand} - {item.model}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>FREE</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${calculatedTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;