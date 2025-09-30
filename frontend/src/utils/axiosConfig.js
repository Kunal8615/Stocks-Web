import axios from 'axios';
import { API_URL } from '../constant';

// Apply interceptors to global axios instance
// This ensures ALL axios requests use these interceptors

// Request interceptor - add auth token to ALL requests
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

// Response interceptor - handle token refresh and errors
axios.interceptors.response.use(
  (response) => {
    // If response includes a new token, save it
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_URL}/user/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data?.token) {
          // Save the new token
          localStorage.setItem('authToken', refreshResponse.data.token);
          
          // Update the failed request with new token and retry
          originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Create axios instance with base URL (for convenience)
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;