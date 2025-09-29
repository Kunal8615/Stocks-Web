import React, { useState } from "react";
import { API_URL } from "../constant.js";
import { useNavigate } from "react-router-dom";
import background from "../images/background.png";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    pan: '',
    role: 'user'
  });
  const [photoFile, setPhotoFile] = useState(null);

  const navigate = useNavigate();

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Add artificial delay to see loading animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('pan', formData.pan);
      data.append('role', formData.role);
      if (photoFile) {
        data.append('photo', photoFile);
      }

      const res = await fetch(`${API_URL}/user/resigter`, {
        method: "POST",
        credentials: "include",
        body: data
      });

      const result = await res.json();
      if (result.success) {
        navigate("/"); // Redirect to login after successful signup
      } else {
        alert("Signup failed ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Username or Email Already exist !❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 animate-fadeIn"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-md w-full space-y-6 bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 animate-slideUp">
        {/* Header */}
        <div className="text-center">
          <h2 className="gradient-text text-3xl font-extrabold">
            Create Account
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* PAN */}
          <div>
            <input
              type="text"
              name="pan"
              placeholder="PAN Number"
              required
              onChange={(e) => setFormData({...formData, pan: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Role */}
          <div>
            <select
              name="role"
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                focus:ring-1 focus:ring-purple-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Photo */}
          <div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              required
              onChange={(e) => setPhotoFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg text-white font-medium
              bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 
              hover:to-pink-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-gray-300">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-purple-400 hover:text-purple-300"
            >
              Log in
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin-slow">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full"/>
              </div>
              <p className="mt-4 text-white animate-pulse">Creating your account...</p>
            </div>
          </div>
        )}

        <style>
          {`
            .gradient-text {
              background: linear-gradient(
                to right,
                #a855f7,
                #ec4899,
                #ef4444
              );
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            @keyframes spin-slow {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            .animate-fadeIn {
              animation: fadeIn 0.5s ease-out;
            }

            .animate-slideUp {
              animation: slideUp 0.5s ease-out;
            }

            .animate-spin-slow {
              animation: spin-slow 1.5s linear infinite;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SignUp;
