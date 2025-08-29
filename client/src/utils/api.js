import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("API_URL from env:", import.meta.env.VITE_API_URL);
console.log("Final API_URL:", API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Success Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      const message = error.response.data?.message || "An error occurred";

      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      } else if (error.response.status === 403) {
        toast.error("Access denied.");
      } else if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.response.status >= 400) {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => {
    console.log("Login attempt with:", credentials.email);
    return api.post("/auth/login", credentials);
  },
  register: (userData) => api.post("/auth/register", userData),
  // NEW: Google login endpoint
  googleLogin: (googleToken) =>
    api.post("/auth/google", { token: googleToken }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
  getUsers: () => api.get("/auth/users"),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

export const productAPI = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getFeaturedProducts: () => api.get("/products/featured"),
  getCategories: () => api.get("/products/categories"),
  getBrands: () => api.get("/products/brands"),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => {
    // Handle both FormData and regular objects
    const config =
      productData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.post("/products", productData, config);
  },
  updateProduct: (id, productData) => {
    // Handle both FormData and regular objects
    const config =
      productData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.put(`/products/${id}`, productData, config);
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),
  createReview: (id, reviewData) =>
    api.post(`/products/${id}/reviews`, reviewData),
};

export const orderAPI = {
  createOrder: (orderData) => api.post("/orders", orderData),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getMyOrders: (params = {}) => api.get("/orders/myorders", { params }),
  getOrders: (params = {}) => api.get("/orders", { params }),
  updateOrderToPaid: (id, paymentResult) =>
    api.put(`/orders/${id}/pay`, paymentResult),
  updateOrderToDelivered: (id) => api.put(`/orders/${id}/deliver`),
  updateOrderStatus: (id, statusData) =>
    api.put(`/orders/${id}/status`, statusData),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getOrderStats: () => api.get("/orders/stats"),
};

export const handleApiError = (error) => {
  console.error("API Error:", error);
  return error.response?.data || { message: "An error occurred" };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default api;
