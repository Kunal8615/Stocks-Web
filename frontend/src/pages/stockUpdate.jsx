import React, { useState, useEffect } from "react";
import { API_URL } from "../constant.js";

function SearchStock() {
  const [searchQuery, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState({}); // har stock ka input store karne ke liye
  const [isSearching, setIsSearching] = useState(false);

  // Search stock API
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `${API_URL}/stocks/searchStock?searchQuery=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      setResults(data?.data || []);
    } catch (err) {
      console.error("Search error:", err);
      alert("Error searching stock");
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search while typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Update price API
  const handleUpdatePrice = async (stockId) => {
    const newPrice = priceUpdates[stockId];
    if (!newPrice) {
      alert("Please enter new price");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/stocks/update_stock`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockid: stockId,
          new_price: newPrice,
        }),
      });

      const data = await res.json();
      console.log("Update Response:", data);

      if (res.ok) {
        alert("Stock price updated successfully!");
        // Update UI
        setResults((prev) =>
          prev.map((s) =>
            s._id === stockId ? { ...s, price_per_unit: newPrice } : s
          )
        );
      } else {
        alert(data?.message || "Failed to update price");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating stock price");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Stock</h2>

      {/* Search Bar */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stock (e.g. tata)"
          className="flex-1 border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
        />
      </div>

      {/* Loading / Results */}
      <div className="mt-4 space-y-3">
        {isSearching ? (
          <p className="text-gray-400">Searching...</p>
        ) : results.length > 0 ? (
          results.map((stock) => (
            <div
              key={stock._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-white">{stock.name}</h3>
              <p className="text-gray-400 text-sm">{stock.description}</p>
              <div className="flex justify-between mt-2 text-sm text-gray-300">
                <span>💲 Price per unit: {stock.price_per_unit}</span>
                <span>📦 Available: {stock.available_quantity}</span>
              </div>

              {/* Input for new price */}
              <div className="flex items-center space-x-2 mt-3">
                <input
                  type="number"
                  placeholder="Enter new price"
                  value={priceUpdates[stock._id] || ""}
                  onChange={(e) =>
                    setPriceUpdates({
                      ...priceUpdates,
                      [stock._id]: e.target.value,
                    })
                  }
                  className="flex-1 border border-gray-600 rounded-md px-3 py-1 bg-black text-white text-sm"
                />
                <button
                  onClick={() => handleUpdatePrice(stock._id)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white text-sm"
                >
                  Update Price
                </button>
              </div>
            </div>
          ))
        ) : (
          !isSearching && <p className="text-gray-400">No stocks found</p>
        )}
      </div>
    </div>
  );
}

export default SearchStock;
