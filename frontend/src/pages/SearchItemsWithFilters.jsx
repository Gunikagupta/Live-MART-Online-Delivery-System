import React, { useState } from "react";
import api from "../api/apiClient";

function SearchItemsWithFilters() {
  const [filters, setFilters] = useState({
    query: "",
    minCost: "",
    maxCost: "",
    minQuantity: "",
    inStock: false,
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({ ...filters, [name]: type === "checkbox" ? checked : value });
  };

  const applySearch = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/items/search", {
        params: filters,
      });
      setItems(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-4">Search Items</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="query"
          placeholder="Search by name"
          value={filters.query}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="minCost"
          placeholder="Min Cost"
          value={filters.minCost}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="maxCost"
          placeholder="Max Cost"
          value={filters.maxCost}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="minQuantity"
          placeholder="Minimum Quantity"
          value={filters.minQuantity}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={handleChange}
          />
          <span>In Stock Only</span>
        </label>
      </div>

      <button
        onClick={applySearch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>

      {loading && <p className="mt-4">Searching...</p>}

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p>Cost: {item.cost}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Status: {item.stock > 0 ? "Available" : "Out of Stock"}</p>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className="mt-4 text-gray-600">No items found.</p>
      )}
    </div>
  );
}

export default SearchItemsWithFilters;
