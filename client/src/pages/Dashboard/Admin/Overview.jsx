import React from "react";

const Overview = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800">Total Products</h3>
        <p className="text-3xl font-bold text-blue-600">
          {stats.totalProducts}
        </p>
      </div>
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">Total Orders</h3>
        <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
      </div>
      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800">Total Users</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
      </div>
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800">Total Revenue</h3>
        <p className="text-3xl font-bold text-yellow-600">
          ${stats.totalRevenue.toFixed(2)}
        </p>
      </div>
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800">Pending Orders</h3>
        <p className="text-3xl font-bold text-red-600">{stats.pendingOrders}</p>
      </div>
    </div>
  );
};

export default Overview;
