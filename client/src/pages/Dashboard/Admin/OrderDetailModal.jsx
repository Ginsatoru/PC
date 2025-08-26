import React from "react";

const OrderDetailModal = ({ order, onClose, onStatusUpdate }) => {
  const orderStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Change order status to ${newStatus}?`)) {
      onStatusUpdate(order._id, newStatus);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Order Details - #{order._id.slice(-6)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Order Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order ID:</span> #{order._id}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Total Amount:</span> $
                  {(order.totalPrice || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Items Price:</span> $
                  {(order.itemsPrice || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Tax Price:</span> $
                  {(order.taxPrice || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Shipping Price:</span> $
                  {(order.shippingPrice || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      order.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Customer Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {order.user?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {order.user?.email || "N/A"}
                </p>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">
                    Shipping Address:
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p>Phone: {order.shippingAddress.phone}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.image || "/placeholder-image.jpg"}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                              onError={(e) => {
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.name || "Product"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.product?.brand &&
                                  item.product?.model &&
                                  `${item.product.brand} ${item.product.model}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(item.price || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          $
                          {((item.price || 0) * (item.quantity || 0)).toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Payment Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {order.paymentMethod || "N/A"}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                {order.isPaid ? "Paid" : "Unpaid"}
              </p>
              {order.isPaid && order.paidAt && (
                <p>
                  <span className="font-medium">Paid At:</span>{" "}
                  {new Date(order.paidAt).toLocaleString()}
                </p>
              )}
              {order.paymentResult && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {order.paymentResult.id}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {order.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Status Update Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Update Order Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {orderStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={status === order.status}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    status === order.status
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : status === "processing"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : status === "shipped"
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      : status === "delivered"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
