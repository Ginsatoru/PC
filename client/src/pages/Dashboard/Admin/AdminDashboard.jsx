import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/api";
import Overview from "./Overview";
import ProductsManager from "./ProductManager";
import OrdersManager from "./OrdersManager";
import UsersManager from "./UsersManager";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  // Shared data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
        api.get("/auth/users"),
      ]);

      const allProducts =
        productsRes.data.data?.products || productsRes.data.products || [];
      const allOrders = ordersRes.data.data || ordersRes.data.orders || [];
      const allUsers = usersRes.data.users || usersRes.data.data || [];

      const totalRevenue = allOrders
        .filter((order) => order.status !== "cancelled")
        .reduce(
          (sum, order) => sum + (order.totalAmount || order.total || 0),
          0
        );

      const pendingOrders = allOrders.filter(
        (order) => order.status === "pending"
      ).length;

      setStats({
        totalProducts: allProducts.length,
        totalOrders: allOrders.length,
        totalUsers: allUsers.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products?limit=100");

      if (response.data.success) {
        setProducts(response.data.data?.products || response.data.data || []);
      } else if (response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");

      if (response.data.success) {
        setOrders(response.data.data || []);
      } else if (response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/users");

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else if (response.data.users) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardStats();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "users") fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-md">
          {["overview", "products", "orders", "users"].map((tab) => (
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

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && <Overview stats={stats} />}
          {activeTab === "products" && (
            <ProductsManager
              products={products}
              setProducts={setProducts}
              loading={loading}
              setLoading={setLoading}
              refreshData={refreshData}
            />
          )}
          {activeTab === "orders" && (
            <OrdersManager
              orders={orders}
              setOrders={setOrders}
              loading={loading}
              setLoading={setLoading}
              refreshData={refreshData}
            />
          )}
          {activeTab === "users" && (
            <UsersManager users={users} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
