import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../constant.js';

function Header() {
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_URL}/user/GetCurrentUser`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.statuscode == 200 && data?.data?.role) {
          setUserRole(data.data.role);
        } else {
          console.warn('Failed to fetch user role');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response) {
        // Clear the auth token from localStorage
        localStorage.removeItem('authToken');
        navigate('/'); 
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 sticky top-0 z-50">
      <style>
        {`
          .gradient-text {
            background: linear-gradient(to right, #a855f7, #ec4899, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-size: 400% auto;
            animation: gradient 10s linear infinite;
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            100% { background-position: 400% 50%; }
          }
          
          .desktop-nav {
            display: none;
          }
          
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
              align-items: center;
              gap: 1.5rem;
            }
          }
          
          .mobile-menu-btn {
            display: block;
          }
          
          @media (min-width: 768px) {
            .mobile-menu-btn {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 mr-8">
            <Link to="/layout" className="group" onClick={() => setIsMenuOpen(false)}>
              <h1 className="gradient-text text-xl sm:text-2xl md:text-3xl font-extrabold hover:scale-105 transition-transform duration-200">
                StocksApp
              </h1>
            </Link>
          </div>

          {/* All Navigation in one line - Hidden on mobile */}
          <div className="desktop-nav">
            <Link 
              to="/layout/" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              🎟️ Dashboard
            </Link>
            <Link 
              to="/layout/stocks" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              📈 Stocks
            </Link>
            {userRole !== 'user' && (
              <Link 
                to="/layout/search-stock" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                🎟️ Update Stock
              </Link>
            )}
            {userRole !== 'user' && (
              <Link 
                to="/layout/create-stock" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                🎟️ Create Stock
              </Link>
            )}
            <Link 
              to="/layout/add-money" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              💰 Add Money
            </Link>
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Log Out
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-btn ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mobile-menu-btn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-700">
            <Link
              to="/layout/"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              🎟️ Dashboard
            </Link>
            <Link
              to="/layout/stocks"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              📈 Stocks
            </Link>
            {userRole !== 'user' && (
              <Link
                to="/layout/search-stock"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                🎟️ Update Stock
              </Link>
            )}
             {userRole !== 'user' && (
              <Link
                to="/layout/create-stock"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                🎟️ Create Stock
              </Link>
            )}
            <Link
              to="/layout/add-money"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              💰 Add Money
            </Link>
            <div className="border-t border-gray-700 pt-3">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left bg-purple-600 hover:bg-purple-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
  
}

export default Header;
