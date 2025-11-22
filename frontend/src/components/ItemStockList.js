// src/components/ItemStockList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ItemStockList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
    // Optionally, setInterval to refresh periodically for "live" feel
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:8080/api/items");
    setItems(res.data);
  };

  return (
    <div>
      <h2>Available Stock</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
