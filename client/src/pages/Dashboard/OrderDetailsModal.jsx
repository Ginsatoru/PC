import React from "react";

const OrderDetailsModal = ({ order, onClose }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Order Details - #{order._id.slice(-8)}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition duration-200"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-bold text-lg text-green-600">
                  ${(order.totalPrice || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">
                Shipping Address
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">
                  {order.shippingAddress?.name || "N/A"}
                </p>
                <p className="text-gray-700">
                  {order.shippingAddress?.address || "N/A"}
                </p>
                <p className="text-gray-700">
                  {order.shippingAddress?.city &&
                  order.shippingAddress?.postalCode
                    ? `${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`
                    : "N/A"}
                </p>
                <p className="text-gray-700">
                  {order.shippingAddress?.country || "N/A"}
                </p>
                {order.shippingAddress?.phone && (
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">Phone:</span>{" "}
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Order Items</h4>
              <div className="space-y-3">
                {order.orderItems?.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.name || "Product"}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <div>
                          <h5 className="font-medium text-gray-800">
                            {item.name || "Product"}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Price: ${(item.price || 0).toFixed(2)} ×{" "}
                            {item.quantity}
                          </p>
                          {item.brand && (
                            <p className="text-sm text-gray-500">
                              Brand: {item.brand}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          $
                          {((item.price || 0) * (item.quantity || 0)).toFixed(
                            2
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity || 0}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No items found in this order
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2 max-w-sm ml-auto">
                {order.itemsPrice && (
                  <div className="flex justify-between text-gray-700">
                    <span>Items:</span>
                    <span>${order.itemsPrice.toFixed(2)}</span>
                  </div>
                )}
                {order.shippingPrice !== undefined && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>${order.shippingPrice.toFixed(2)}</span>
                  </div>
                )}
                {order.taxPrice && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>${order.taxPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                  <span>Total:</span>
                  <span>${(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {order.paymentMethod && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">
                  Payment Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <span className="font-medium">Payment Method:</span>{" "}
                    {order.paymentMethod}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Payment Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Not Paid"}
                    </span>
                  </p>
                  {order.paidAt && (
                    <p className="text-gray-700">
                      <span className="font-medium">Paid At:</span>{" "}
                      {new Date(order.paidAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Information */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">
                Delivery Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">Delivery Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      order.isDelivered
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Not Delivered"}
                  </span>
                </p>
                {order.deliveredAt && (
                  <p className="text-gray-700">
                    <span className="font-medium">Delivered At:</span>{" "}
                    {new Date(order.deliveredAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
