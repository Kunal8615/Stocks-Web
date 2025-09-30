import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { API_URL } from '../constant';
import { Link, useNavigate } from 'react-router-dom';
import bgupload from "../images/bgupload.jpg";
import background from "../images/background.png";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loginType, setLoginType] = useState('user'); // 'user' | 'admin'

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/user/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensures that cookies are sent with the request
      });


      if (response.status !== 200) {
        throw new Error('Login failed! Please check your credentials.');
      }

      const role = response?.data?.data?.user?.role;
      
      // Store the token in localStorage
      if (response?.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      // If user selected Admin tab but account is not admin
      if (loginType === 'admin' && role !== 'admin') {
        alert('Admin access only. Please login with an admin account.');
        return;
      }

      // Navigate to dashboard first
      navigate('/layout/');
    } catch (error) {
      console.error('Error during login:', error.message);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-10 sm:py-12"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${background})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Content Container */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md 
          border border-gray-700/50 rounded-2xl p-6 sm:p-7 md:p-8 shadow-2xl">
          {/* Logo/Brand */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Stock Web
            </h2>
            <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">Welcome back! Please login to continue</p>
          </div>

          {/* Tabs: User / Admin */}
          <div className="mb-5 sm:mb-6 relative">
            <div className="grid grid-cols-2 relative bg-black/30 rounded-xl border border-gray-700/60 p-1 overflow-hidden">
              <button
                type="button"
                onClick={() => setLoginType('user')}
                className={`py-2.5 rounded-lg text-sm font-medium relative z-10 transition-colors duration-200 ${loginType === 'user' ? 'text-white' : 'text-gray-300 hover:text-gray-100'}`}
              >
                User Login
              </button>
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`py-2.5 rounded-lg text-sm font-medium relative z-10 transition-colors duration-200 ${loginType === 'admin' ? 'text-white' : 'text-gray-300 hover:text-gray-100'}`}
              >
                Admin Login
              </button>
              {/* Active slider */}
              <span
                className={`pointer-events-none absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg transition-transform duration-300 ease-out ${loginType === 'admin' ? 'translate-x-full' : 'translate-x-0'}`}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 transition-all duration-300">
            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl 
                  text-gray-200 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-transparent
                  transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl 
                  text-gray-200 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-transparent
                  transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 
                hover:from-purple-700 hover:to-pink-700 
                text-white py-3 px-4 rounded-xl font-medium
                transition-all duration-200 transform hover:scale-[1.02]
                flex items-center justify-center gap-2"
            >
              <span>{loginType === 'admin' ? 'Login as Admin' : 'Login'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-gray-300 text-xs sm:text-sm text-center mt-6 sm:mt-8">
          By logging in, you agree to our{' '}
          <a href="#" className="text-purple-300 hover:text-purple-400 hover:underline transition-colors">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-purple-300 hover:text-purple-400 hover:underline transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;