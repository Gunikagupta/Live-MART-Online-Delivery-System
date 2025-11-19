// src/pages/NearbyShops.jsx
import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { Link } from "react-router-dom";

const NearbyShops = () => {
  const [shops, setShops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    maxCost: "",
    minStock: "",
    minQty: "",
    maxDistance: ""
  });

  useEffect(() => {
    fetchNearbyShops();
  }, []);

  const fetchNearbyShops = async () => {
    try {
      const res = await api.get("/shops/nearby");
      setShops(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching shops:", err);
    }
  };

  const applyFilters = () => {
    let f = [...shops];

    if (filters.maxCost)
      f = f.filter(s => s.avgItemPrice <= parseFloat(filters.maxCost));

    if (filters.minStock)
      f = f.filter(s => s.totalStock >= parseInt(filters.minStock));

    if (filters.minQty)
      f = f.filter(s => s.totalQuantity >= parseInt(filters.minQty));

    if (filters.maxDistance)
      f = f.filter(s => s.distance <= parseFloat(filters.maxDistance));

    setFiltered(f);
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
          onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Stock"
          className="input"
          onChange={(e) => setFilters({ ...filters, minStock: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Quantity"
          className="input"
          onChange={(e) => setFilters({ ...filters, minQty: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Distance (km)"
          className="input"
          onChange={(e) =>
            setFilters({ ...filters, maxDistance: e.target.value })
          }
        />

        <button
          onClick={applyFilters}
          className="col-span-2 md:col-span-4 btn-primary"
        >
          Apply Filters
        </button>
      </div>

      <Link to="/map" className="btn-primary inline-block mt-4">
        View on Map
      </Link>

      {/* Shop List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((shop) => (
          <div key={shop.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{shop.name}</h2>
            <p>Distance: {shop.distance} km</p>
            <p>Avg Cost: ₹{shop.avgItemPrice}</p>
            <p>Total Stock: {shop.totalStock}</p>
            <p>Total Quantity: {shop.totalQuantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyShops;
