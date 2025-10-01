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
    const config =
      productData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.post("/products", productData, config);
  },
  updateProduct: (id, productData) => {
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

// CORRECTED: KHQR Payment API endpoints (matching backend routes)
export const khqrAPI = {
  // Generate KHQR payment for an order
  generateKHQR: (orderId, amount = null) => {
    console.log("Generating KHQR for order:", orderId, "amount:", amount);
    const payload = amount ? { amount } : {};
    return api.post(`/orders/${orderId}/khqr`, payload);
  },

  // Check KHQR payment status
  checkPaymentStatus: (orderId) => {
    console.log("Checking payment status for order:", orderId);
    return api.get(`/orders/${orderId}/khqr/status`);
  },

  // Get KHQR payment details (if you add this endpoint later)
  getKHQRDetails: (orderId) => {
    console.log("Getting KHQR details for order:", orderId);
    return api.get(`/orders/${orderId}/khqr/details`);
  },

  // Cancel KHQR payment (optional - if you implement this)
  cancelKHQRPayment: (orderId) => {
    console.log("Cancelling KHQR payment for order:", orderId);
    return api.delete(`/orders/${orderId}/khqr`);
  },

  // Webhook handler (for backend use)
  handleWebhook: (webhookData) => {
    return api.post("/khqr/webhook", webhookData);
  },
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

// Format price in KHR (Cambodian Riel)
export const formatPriceKHR = (price) => {
  return new Intl.NumberFormat("km-KH", {
    style: "currency",
    currency: "KHR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Convert USD to KHR (you should get this from a live API)
export const convertUSDToKHR = (usdAmount, exchangeRate = 4100) => {
  return Math.round(usdAmount * exchangeRate);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date and time for KHQR transactions
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Utility functions for KHQR integration
export const khqrUtils = {
  // Check if KHQR payment is expired
  isPaymentExpired: (expiresAt) => {
    return new Date() > new Date(expiresAt);
  },

  // Calculate time remaining for KHQR payment
  getTimeRemaining: (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return { minutes: 0, seconds: 0, expired: true };

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { minutes, seconds, expired: false };
  },

  // Format time remaining as string
  formatTimeRemaining: (expiresAt) => {
    const { minutes, seconds, expired } = khqrUtils.getTimeRemaining(expiresAt);

    if (expired) return "Expired";

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  },

  // Get payment method display name
  getPaymentMethodName: (method) => {
    const methods = {
      cash_on_delivery: "Cash on Delivery",
      KHQR: "KHQR Payment",
      card: "Credit Card",
      bank_transfer: "Bank Transfer",
    };

    return methods[method] || method;
  },

  // Validate KHQR response data
  validateKHQRResponse: (response) => {
    const required = ['qrString', 'md5Hash', 'expiresAt', 'amount'];
    return required.every(field => response && response[field]);
  },

  // Handle KHQR errors with user-friendly messages
  getKHQRErrorMessage: (error) => {
    const errorMessages = {
      'INSUFFICIENT_BALANCE': 'Insufficient balance in your account',
      'INVALID_ACCOUNT': 'Invalid merchant account configuration',
      'EXPIRED_QR': 'QR code has expired, please generate a new one',
      'NETWORK_ERROR': 'Network connection problem, please try again',
      'INVALID_AMOUNT': 'Invalid payment amount',
      'MERCHANT_NOT_FOUND': 'Merchant account not found',
    };

    if (error?.response?.data?.error) {
      const errorCode = error.response.data.error;
      return errorMessages[errorCode] || error.response.data.message || 'Payment failed';
    }

    return error?.message || 'An unexpected error occurred';
  }
};

export default api;