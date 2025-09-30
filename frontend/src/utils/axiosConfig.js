import axios from 'axios';
import { API_URL } from '../constant';

// Create axios instance with base URL (for convenience)
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply interceptors to both global axios and axiosInstance
const setupInterceptors = () => {
  // Request interceptor for global axios
  axios.interceptors.request.use(
    (config) => {
      // Get token from localStorage if it exists
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Request interceptor for axiosInstance
  axiosInstance.interceptors.request.use(
    (config) => {
      // Get token from localStorage if it exists
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for global axios
  axios.interceptors.response.use(
    (response) => {
      // If response includes a new token, save it
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response;
    },
    async (error) => {
      // Don't redirect to login page for 401 errors
      // Just pass through the error
      return Promise.reject(error);
    }
  );

  // Response interceptor for axiosInstance
  axiosInstance.interceptors.response.use(
    (response) => {
      // If response includes a new token, save it
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response;
    },
    async (error) => {
      // Don't redirect to login page for 401 errors
      // Just pass through the error
      return Promise.reject(error);
    }
  );
};

// Setup interceptors immediately
setupInterceptors();

export default axiosInstance;