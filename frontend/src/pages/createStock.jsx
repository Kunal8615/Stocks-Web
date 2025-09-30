import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constant.js";

const CreateStock = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_per_unit: "",
    available_quantity: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        `${API_URL}/stocks/createStock`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage({ text: "Stock created successfully! 🎉", type: "success" });
      setFormData({
        name: "",
        description: "",
        price_per_unit: "",
        available_quantity: "",
        category: "",
      });
    } catch (error) {
      console.error("Error creating stock:", error);
      setMessage({
        text: error.response?.data?.message || "Error creating stock. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-blue-400">
          Create New Stock
        </h2>
        
        {message.text && (
          <p className={`p-3 rounded-lg text-center font-medium ${
              message.type === 'success' 
                ? 'bg-green-700 text-green-100'
                : 'bg-red-700 text-red-100'
            }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input fields... (no changes here) */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-semibold text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., T-Shirt"
              className="w-full px-4 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-300">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Round Neck Cotton T-Shirt"
              className="w-full px-4 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="price_per_unit" className="block mb-2 text-sm font-semibold text-gray-300">
              Price per Unit (₹)
            </label>
            <input
              type="number"
              id="price_per_unit"
              name="price_per_unit"
              value={formData.price_per_unit}
              onChange={handleChange}
              placeholder="e.g., 500"
              min="0"
              className="w-full px-4 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="available_quantity" className="block mb-2 text-sm font-semibold text-gray-300">
              Available Quantity
            </label>
            <input
              type="number"
              id="available_quantity"
              name="available_quantity"
              value={formData.available_quantity}
              onChange={handleChange}
              placeholder="e.g., 100"
              min="0"
              className="w-full px-4 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-semibold text-gray-300">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Apparel"
              className="w-full px-4 py-2 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-600 disabled:text-gray-400"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Stock"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStock;