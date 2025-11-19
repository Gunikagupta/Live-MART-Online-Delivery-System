import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const NearbyShops = () => {
  const [shops, setShops] = useState([]);
  const [coords, setCoords] = useState(null);

  const [maxDistance, setMaxDistance] = useState(5);
  const [maxCost, setMaxCost] = useState("");
  const [minStock, setMinStock] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCoords([lat, lng]);
      fetchShops(lat, lng);
    });
  }, []);

  const fetchShops = async (lat, lng) => {
    const res = await api.get("/shops/nearby", {
      params: {
        lat,
        lng,
        distance: maxDistance,
        maxCost: maxCost || undefined,
        minStock: minStock || undefined,
      },
    });
    setShops(res.data);
  };

  const applyFilters = () => {
    if (!coords) return;
    fetchShops(coords[0], coords[1]);
  };

  if (!coords) return <p>Fetching location...</p>;

  return (
    <div className="p-5 fade-in">

      <h2 className="text-2xl font-bold mb-4">Nearby Shops</h2>

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
          <label className="font-semibold">Max Cost</label>
          <input
            type="number"
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Min Stock</label>
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

      {/* Shop List */}
      <div className="mt-6">
        {shops.length === 0 ? (
          <p>No shops found.</p>
        ) : (
          shops.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-white rounded shadow mb-3 border"
            >
              <h3 className="text-lg font-bold">{s.name}</h3>
              <p>{s.address}</p>
              <p>Distance: {s.distance.toFixed(1)} km</p>
              <p>Avg Cost: ₹{s.averageCost}</p>
              <p>Stock: {s.totalStock}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NearbyShops;
