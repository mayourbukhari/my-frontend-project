import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config
// In development, use proxy (/api) or fallback to direct server URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response, request } = error;

    // Network error
    if (!response) {
      const errorMessage = request 
        ? 'Network error - please check your connection'
        : 'Request setup error';
      
      if (typeof toast !== 'undefined') {
        toast.error(errorMessage);
      }
      return Promise.reject({
        success: false,
        message: errorMessage,
        type: 'NETWORK_ERROR'
      });
    }

    // HTTP error responses
    const { status, data } = response;
    let errorMessage = data?.message || 'An unexpected error occurred';

    switch (status) {
      case 400:
        errorMessage = data?.message || 'Invalid request data';
        break;
      case 401:
        errorMessage = 'Authentication required';
        // Clear invalid token
        localStorage.removeItem('authToken');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        break;
      case 403:
        errorMessage = 'You are not authorized to perform this action';
        break;
      case 404:
        errorMessage = 'Requested resource not found';
        break;
      case 422:
        // Validation errors
        if (data?.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(err => err.msg || err.message).join(', ');
        }
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Internal server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        errorMessage = `Error ${status}: ${errorMessage}`;
    }

    // Show error toast for non-401 errors
    if (status !== 401 && typeof toast !== 'undefined') {
      toast.error(errorMessage);
    }

    return Promise.reject({
      success: false,
      message: errorMessage,
      status,
      data: data || null,
      type: 'HTTP_ERROR'
    });
  }
);

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email'
  },
  
  // Artworks
  artworks: {
    list: '/artworks',
    detail: (id) => `/artworks/${id}`,
    create: '/artworks',
    update: (id) => `/artworks/${id}`,
    delete: (id) => `/artworks/${id}`,
    like: (id) => `/artworks/${id}/like`
  }
};

// Generic API methods
export const apiMethods = {
  get: async (endpoint, params = {}) => {
    return await api.get(endpoint, { params });
  },

  post: async (endpoint, data = {}, config = {}) => {
    return await api.post(endpoint, data, config);
  },

  put: async (endpoint, data = {}, config = {}) => {
    return await api.put(endpoint, data, config);
  },

  delete: async (endpoint, config = {}) => {
    return await api.delete(endpoint, config);
  },

  uploadFile: async (endpoint, formData, onProgress = null) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    return await api.post(endpoint, formData, config);
  }
};

export default api;
