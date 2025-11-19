import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient";

function RetailerProxyItems() {
  const { retailerId } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    apiClient
      .get(`/api/dashboard/retailers/${retailerId}/proxy-items`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching proxy items:", err));
  }, [retailerId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Retailer Proxy Items</h2>

      {items.length === 0 ? (
        <p>No proxy items available.</p>
      ) : (
        items.map((item) => (
          <div key={item.itemId} style={{ marginBottom: "15px" }}>
            <h3>{item.name}</h3>
            <p>Price: ₹{item.price}</p>
            <p>Stock: {item.stock}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default RetailerProxyItems;
