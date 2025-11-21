// frontend/src/components/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function OrderCard({ order, onClick }) {
  return (
    <div
      onClick={() => onClick(order.id)}
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg border cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold">Order #{order.id}</div>
          <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="font-bold">₹{order.total}</div>
          <div className="text-sm mt-1">
            <span className={`px-2 py-1 rounded-full text-xs ${
              order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        {order.items.slice(0,3).map(i => `${i.name} x${i.qty}`).join(", ")}{order.items.length>3 ? "…" : ""}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  api.get(`/api/orders/user/${user.id}`)
    .then(res => setOrders(res.data || []))
    .catch(err => console.error(err));
}, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-extrabold mb-6">Your Orders</h2>
      <div className="grid grid-cols-1 gap-4">
        {orders.map(o => (
          <OrderCard key={o.id} order={o} onClick={(id) => navigate(`/orders/${id}`)} />
        ))}
        {orders.length === 0 && <div className="text-gray-500">No orders yet.</div>}
      </div>
    </div>
  );
}
