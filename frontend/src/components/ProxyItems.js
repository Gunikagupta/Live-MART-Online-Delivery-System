import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function ProxyItems({ retailerId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!retailerId) return;

    apiClient
      .get(`/api/dashboard/retailers/${retailerId}/proxy-items`)   // ✅ FIXED ENDPOINT
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading proxy items:", err);
        setLoading(false);
      });
  }, [retailerId]);

  if (loading) return <p>Loading proxy items...</p>;
  if (items.length === 0) return <p>No proxy items available</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "15px",
        padding: "10px",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
          <img
            src={item.imageUrl || "https://via.placeholder.com/150"}
            alt={item.name}
            style={{ width: "100%", borderRadius: "6px" }}
          />
          <h4 style={{ marginTop: "10px" }}>{item.name}</h4>
          <p>Price: ₹{item.price}</p>
          <p>Stock: {item.stock}</p>
        </div>
      ))}
    </div>
  );
}

export default ProxyItems;
