import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

// Helper component to display star rating
function StarRating({ rating }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(i < rating ? "★" : "☆");
  }
  return <span className="text-yellow-400 font-bold">{stars.join("")}</span>;
}

function OrderCard({ order, feedbackList, onClick }) {
  // Find feedback related to this order's items (showing average rating for simplicity)
  const feedbackForOrderItems = feedbackList.filter((fb) =>
    order.items.some((item) => item.id === fb.item.id)
  );

  const averageRating =
    feedbackForOrderItems.length > 0
      ? Math.round(
          feedbackForOrderItems.reduce((sum, fb) => sum + fb.rating, 0) /
            feedbackForOrderItems.length
        )
      : 0;

  return (
    <div
      onClick={() => onClick(order.id)}
      className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border cursor-pointer transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold text-pink-700">Order #{order.id}</div>
          <div className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl text-pink-600">₹{order.total}</div>
          <div className="text-sm mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-gray-700 text-sm">
        {order.items.slice(0, 3).map((i) => `${i.name} x${i.qty}`).join(", ")}
        {order.items.length > 3 ? "…" : ""}
      </div>

      {/* Feedback summary */}
      <div className="mt-4 pt-4 border-t border-pink-100">
        <h3 className="font-semibold text-pink-800 mb-1">Feedback Summary</h3>
        {averageRating > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} />
            <span className="text-sm text-gray-600">
              {averageRating} / 5 from {feedbackForOrderItems.length} feedback
              {feedbackForOrderItems.length > 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No feedback yet for this order.</p>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (!user.id) return; // Add proper user check here

    // Fetch orders
    api
      .get(`/api/orders/user/${user.id}`)
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error("Failed to fetch orders", err));

    // Fetch all feedback for this user’s items (you may customize as needed)
    api
      .get(`/api/feedback/user/${user.id}`)
      .then((res) => setFeedback(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch feedback", err);
        setFeedback([]);
      });
  }, []);

  return (
    <div className="px-8 py-12 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
        Your Orders
      </h2>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              feedbackList={feedback}
              onClick={(id) => navigate(`/orders/${id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
