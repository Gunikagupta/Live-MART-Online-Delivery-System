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
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCoords([lat, lng]);
      fetchItems(lat, lng); 
    }, (error) => {
        // Fallback or error handling for Geolocation failure
        console.error("Geolocation failed:", error.message);
        // Use default coordinates if Geolocation fails (e.g., Mumbai)
        const defaultLat = 19.05;
        const defaultLon = 72.85;
        setCoords([defaultLat, defaultLon]);
        fetchItems(defaultLat, defaultLon);
    });
  }, []);

  // --- FETCH FUNCTION ---
  const fetchItems = async (lat, lng) => {
    try {
        // Calls the corrected API path /api/v1/search/nearby
        const res = await getNearbyItems(
            lat,
            lng,
            maxDistance
        );
        setNearbyItems(res.data);
    } catch (error) {
        console.error("Error fetching nearby items:", error);
    }
  };

  const applyFilters = () => {
    if (!coords) return;
    fetchItems(coords[0], coords[1]); 
  };

  if (!coords) return <p>Fetching location or awaiting permission...</p>;

  return (
    <div className="p-5 fade-in">

      <h2 className="text-2xl font-bold mb-4">Nearby Items & Shops</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="font-semibold">Max Distance (km)</label>
          <input
            type="number"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Max Cost (Item)</label>
          <input
            type="number"
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Min Stock (Item)</label>
          <input
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Apply Filters
      </button>

      <button
        onClick={() => navigate("/nearby-map")}
        className="ml-3 bg-gray-700 text-white px-4 py-2 rounded"
      >
        View on Map
      </button>

      {/* Item List */}
      <div className="mt-6">
        {nearbyItems.length === 0 ? (
          <p>No items found from nearby shops.</p>
        ) : (
          nearbyItems.map((item, index) => (
            <div
              key={index} 
              className="p-4 bg-white rounded shadow mb-3 border"
            >
              <h3 className="text-lg font-bold">{item.itemName}</h3>
              <p>Shop: {item.shopName}</p> 
              <p>Price: ₹{item.price}</p>
              <p>Distance: {item.distanceKm ? item.distanceKm.toFixed(1) : 'N/A'} km</p>
              <p>Stock: {item.stockQuantity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NearbyShops;