import React, { useEffect, useState } from "react";
import { getNearbyItems } from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const NearbyShops = () => {
  const [nearbyItems, setNearbyItems] = useState([]);
  const [coords, setCoords] = useState(null);

  const [maxDistance, setMaxDistance] = useState(5);
  const [maxCost, setMaxCost] = useState("");
  const [minStock, setMinStock] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location to trigger initial fetch
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCoords([lat, lng]);
        fetchItems(lat, lng);
      },
      (error) => {
        console.error("Geolocation failed:", error.message);
        // Fallback: Mumbai default
        const defaultLat = 19.05;
        const defaultLon = 72.85;
        setCoords([defaultLat, defaultLon]);
        fetchItems(defaultLat, defaultLon);
      }
    );
  }, []);

  // --- FETCH FUNCTION ---
  const fetchItems = async (lat, lng) => {
    try {
      const res = await getNearbyItems(lat, lng, maxDistance);
      setNearbyItems(res.data);
    } catch (error) {
      console.error("Error fetching nearby items:", error);
    }
  };

  const applyFilters = () => {
    if (!coords) return;
    fetchItems(coords[0], coords[1]);
  };

  // Loading State with Styles
  if (!coords)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-900 via-red-700 to-pink-500 animate-pulse">
          Locating you...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-pink-900 via-red-700 to-pink-500">
              Nearby Items & Shops
            </span>
          </h1>
          <p className="text-gray-500 font-medium">
            Find the best deals in your local area
          </p>
        </div>

        {/* --- CONTROLS & FILTERS CARD --- */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Max Distance */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Max Distance (km)
              </label>
              <input
                type="number"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                         transition duration-200"
              />
            </div>

            {/* Max Cost */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Max Cost (₹)
              </label>
              <input
                type="number"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                         transition duration-200"
              />
            </div>

            {/* Min Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Min Stock
              </label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                         transition duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={applyFilters}
              className="flex-1 py-3 rounded-xl shadow-lg text-white font-bold text-lg
                bg-gradient-to-br from-pink-900 via-red-700 to-pink-500
                hover:from-pink-800 hover:via-red-600 hover:to-pink-400
                transform transition duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              Apply Filters
            </button>

            <button
              onClick={() => navigate("/nearby-map")}
              className="flex-1 py-3 rounded-xl shadow-md text-gray-700 font-bold text-lg border-2 border-gray-200 bg-white
                hover:bg-gray-50 hover:border-pink-300 hover:text-pink-900
                transform transition duration-200"
            >
              📍 View on Map
            </button>
          </div>
        </div>

        {/* --- ITEMS GRID --- */}
        <div>
          {nearbyItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
              <p className="text-xl text-gray-400 font-medium">
                No items found nearby. Try increasing the distance!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden
                             transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-pink-100"
                >
                  {/* Decorative gradient top bar */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-900 via-red-700 to-pink-500"></div>

                  <div className="mt-2">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-extrabold text-gray-800 truncate pr-2">
                        {item.itemName}
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                            IN STOCK: {item.stockQuantity}
                        </span>
                    </div>

                    <p className="text-sm font-semibold text-pink-700 mb-4 flex items-center">
                      🏪 {item.shopName}
                    </p>

                    <div className="flex items-end justify-between mt-4 border-t pt-4 border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Distance</p>
                        <p className="text-gray-700 font-medium">
                          📍 {item.distanceKm ? item.distanceKm.toFixed(1) : "N/A"} km
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NearbyShops;