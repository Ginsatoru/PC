import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import AccountStats from "./AccountStats";
import QuickActions from "./QuickActions";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/myorders");
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Account Statistics */}
        <AccountStats orders={orders} />

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-md">
          {["profile", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "orders" && (
            <OrdersSection
              orders={orders}
              loading={loading}
              onRefresh={fetchOrders}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
