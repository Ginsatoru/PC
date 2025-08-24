import axios from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('API_URL:', API_URL); // Debug log to check the URL

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making request to: ${config.baseURL}${config.url}`); // Debug log
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error); // Debug log
    
    if (error.response) {
      const message = error.response.data.message || 'An error occurred';
      
      // Handle specific error codes
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        toast.error('Access denied.');
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => {
    console.log('Login attempt with:', credentials.email); // Debug log
    return api.post('/api/auth/login', credentials);
  },
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (userData) => api.put('/api/auth/profile', userData),
  getUsers: () => api.get('/api/auth/users'),
  deleteUser: (id) => api.delete(`/api/auth/users/${id}`),
};

// Product API calls
export const productAPI = {
  getProducts: (params = {}) => api.get('/api/products', { params }),
  getFeaturedProducts: () => api.get('/api/products/featured'),
  getCategories: () => api.get('/api/products/categories'),
  getBrands: () => api.get('/api/products/brands'),
  getProductById: (id) => api.get(`/api/products/${id}`),
  createProduct: (productData) => api.post('/api/products', productData),
  updateProduct: (id, productData) => api.put(`/api/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
  createReview: (id, reviewData) => api.post(`/api/products/${id}/reviews`, reviewData),
};

// Order API calls
export const orderAPI = {
  createOrder: (orderData) => api.post('/api/orders', orderData),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  getMyOrders: (params = {}) => api.get('/api/orders/myorders', { params }),
  getOrders: (params = {}) => api.get('/api/orders', { params }),
  updateOrderToPaid: (id, paymentResult) => api.put(`/api/orders/${id}/pay`, paymentResult),
  updateOrderToDelivered: (id) => api.put(`/api/orders/${id}/deliver`),
  updateOrderStatus: (id, statusData) => api.put(`/api/orders/${id}/status`, statusData),
  deleteOrder: (id) => api.delete(`/api/orders/${id}`),
  getOrderStats: () => api.get('/api/orders/stats'),
};

// Generic API helper functions
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return error.response?.data || { message: 'An error occurred' };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default api;