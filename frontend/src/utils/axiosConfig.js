import axios from 'axios';
import { API_URL } from '../constant.js';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token to every request
axios.interceptors.request.use(
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

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // If we have a refresh token, try to get a new token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/user/refresh-token`, { 
            refreshToken 
          }, { 
            withCredentials: true 
          });
          
          if (response.data.token) {
            // Save the new tokens
            localStorage.setItem('authToken', response.data.token);
            if (response.data.refreshToken) {
              localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            
            // Update the authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
            
            // Retry the original request
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Apply the same interceptors to axiosInstance
axiosInstance.interceptors.request.use(
  axios.interceptors.request.handlers[0].fulfilled,
  axios.interceptors.request.handlers[0].rejected
);

axiosInstance.interceptors.response.use(
  axios.interceptors.response.handlers[0].fulfilled,
  axios.interceptors.response.handlers[0].rejected
);

export default axiosInstance;