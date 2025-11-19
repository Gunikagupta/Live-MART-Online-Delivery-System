// src/pages/NearbyShops.jsx
import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { Link } from "react-router-dom";

const NearbyShops = () => {
  const [shops, setShops] = useState([]);
  const [filters, setFilters] = useState({
    maxCost: "",
    minQuantity: "",
    inStock: "",
    distanceKm: ""
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch shops on load and whenever filters change
  useEffect(() => {
    fetchShopsFromBackend();
  }, [filters]);

  const fetchShopsFromBackend = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/api/v1/shops/search", {
        params: {
          maxCost: filters.maxCost || undefined,
          minQuantity: filters.minQuantity || undefined,
          inStock: filters.inStock === "" ? undefined : filters.inStock,
          userLat: 0,       // static for now (you can replace with geolocation)
          userLon: 0,
          distanceKm: filters.distanceKm || undefined
        }
      });

      setShops(res.data);
    } catch (err) {
      console.error("Error fetching shops:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      maxCost: "",
      minQuantity: "",
      inStock: "",
      distanceKm: ""
    });
  };

  return (
    <div className="p-6 fade-in">
      <h1 className="text-2xl font-bold mb-4">Nearby Shops</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
        
        <input
          type="number"
          placeholder="Max Cost"
          className="input"
          value={filters.maxCost}
          onChange={(e) =>
            setFilters({ ...filters, maxCost: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Min Quantity"
          className="input"
          value={filters.minQuantity}
          onChange={(e) =>
            setFilters({ ...filters, minQuantity: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Max Distance (km)"
          className="input"
          value={filters.distanceKm}
          onChange={(e) =>
            setFilters({ ...filters, distanceKm: e.target.value })
          }
        />

        <select
          className="input"
          value={filters.inStock}
          onChange={(e) =>
            setFilters({ ...filters, inStock: e.target.value })
          }
        >
          <option value="">Stock (Any)</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>

        <button
          onClick={clearFilters}
          className="col-span-2 md:col-span-4 btn-secondary bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      <Link to="/map" className="btn-primary inline-block mt-4">
        View on Map
      </Link>

      {/* Results Area */}
      <div className="mt-6">
        {isLoading ? (
          <p className="mt-6 text-center text-xl text-gray-500">
            ⏳ Loading nearby shops...
          </p>
        ) : shops.length === 0 ? (
          <div className="mt-6 p-8 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg">
            <p className="font-bold">🛒 No Shops Found</p>
            <p>Try clearing or adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shops.map((shop) => (
              <div key={shop.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">{shop.name}</h2>
                <p>Distance: {shop.distance} km</p>
                <p>Avg Cost: ₹{shop.avgItemPrice}</p>
                <p>Total Stock: {shop.totalStock}</p>
                <p>Total Quantity: {shop.totalQuantity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;
