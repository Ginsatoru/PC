import React from "react";

const AccountStats = ({ orders }) => {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      valueColor: "text-blue-600",
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      valueColor: "text-green-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-600",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      valueColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} p-6 rounded-lg shadow-sm border border-gray-200`}
        >
          <h3 className={`text-sm font-medium ${stat.textColor} mb-2`}>
            {stat.title}
          </h3>
          <p className={`text-3xl font-bold ${stat.valueColor}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AccountStats;
