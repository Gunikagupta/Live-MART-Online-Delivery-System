import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";

// Popup component
function Popup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-xl max-w-sm text-center">
        <p className="text-lg font-semibold text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}

// Star rating display
function StarRating({ rating }) {
  const stars = [];
  for (let i = 0; i < 5; i++) stars.push(i < rating ? "★" : "☆");
  return <span className="text-yellow-400 font-bold">{stars.join("")}</span>;
}

// Feedback submission form
function FeedbackForm({ item, order, onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h3 className="mb-3 font-bold text-lg">Feedback for {item.name}</h3>
        <div className="mb-4">
          <span className="text-yellow-400 text-2xl cursor-pointer">
            {[1,2,3,4,5].map(n => (
              <span key={n} onClick={() => setRating(n)}>
                {n <= rating ? "★" : "☆"}
              </span>
            ))}
          </span>
        </div>
        <textarea
          className="w-full p-2 border rounded-xl mb-3"
          rows={3}
          placeholder="Write your review..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          className="px-7 py-2 bg-pink-600 text-white rounded-xl mr-3"
          disabled={rating === 0}
          onClick={() => onSubmit({ rating, comment })}
        >
          Submit
        </button>
        <button
          className="px-5 py-2 bg-gray-200 text-gray-500 rounded-xl"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function OrderCard({ order, feedbackList, onClick, onReorder, onCancel, onAddFeedback }) {
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
  const canCancel = ["PLACED", "CONFIRMED", "PROCESSING"].includes(order.status);

  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border transition">
      <div className="flex justify-between items-start">
        <div>
          <div
            onClick={() => onClick(order.id)}
            className="text-lg font-semibold text-pink-700 cursor-pointer"
          >
            Order #{order.id}
          </div>
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
      {/* Items */}
      <div className="mt-4 text-gray-700 text-sm">
        {order.items.slice(0, 3).map((i) => `${i.name} x${i.qty}`).join(", ")}
        {order.items.length > 3 ? "…" : ""}
      </div>
      {/* Feedback info */}
      <div className="mt-4 pt-4 border-t border-pink-100">
        <h3 className="font-semibold text-pink-800 mb-1">Feedback Summary</h3>
        {averageRating > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} />
            <span className="text-sm text-gray-600">
              {averageRating} / 5 from {feedbackForOrderItems.length} review
              {feedbackForOrderItems.length > 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No feedback yet.</p>
        )}
        {/* Show Add Feedback buttons for DELIVERED items not yet reviewed */}
        {order.status === "DELIVERED" &&
          order.items.map(item => {
            const alreadyReviewed = feedbackList.some(
              fb => fb.item.id === item.id
            );
            return !alreadyReviewed ? (
              <button
                key={item.id}
                className="mt-3 px-4 py-2 text-sm bg-green-100 text-green-700 rounded-xl hover:bg-green-200 block mx-auto"
                onClick={() => onAddFeedback(order, item)}
              >
                Add Feedback for {item.name}
              </button>
            ) : null;
          })}
      </div>
      {/* Buttons */}
      <div className="flex mt-5 gap-4">
        <button
          onClick={() => onReorder(order)}
          className="flex-1 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition"
        >
          Reorder
        </button>
        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="flex-1 bg-red-100 text-red-700 font-semibold py-2 rounded-xl hover:bg-red-200 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const { addToCart, setCart } = useCart();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (!user.id) return;
    api
      .get(`/api/orders/user/${user.id}`)
      .then((res) => setOrders(res.data || []))
      .catch(() => {});
    api
      .get(`/api/feedback/user/${user.id}`)
      .then((res) => setFeedback(res.data || []))
      .catch(() => setFeedback([]));
  }, []);

  // Reorder items from a previous order
  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
        },
        item.qty
      );
    });
    setPopupMessage("🛒 Items added to cart again!");
  };

  // Cancel an order
  const handleCancel = async (orderId) => {
    try {
      await api.put(`/api/orders/cancel/${orderId}`);
      alert("Order cancelled successfully! Cancellation email has been sent.");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "CANCELLED" } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order.");
    }
  };

  // Trigger feedback popup
  const handleAddFeedback = (order, item) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setShowFeedbackForm(true);
  };

  // Feedback submission logic
  const handleSubmitFeedback = async ({ rating, comment }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.post("/api/feedback", {
        itemId: selectedItem.id,
        userId: user.id,
        rating,
        comment,
      });
      setPopupMessage("Thank you for your feedback!");
      // Refresh feedback list after submitting
      api.get(`/api/feedback/user/${user.id}`).then((res) => setFeedback(res.data));
    } catch (err) {
      setPopupMessage("Feedback submission failed.");
    }
    setShowFeedbackForm(false);
  };

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
              onReorder={handleReorder}
              onCancel={handleCancel}
              onAddFeedback={handleAddFeedback}
            />
          ))
        )}
      </div>
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      )}
      {showFeedbackForm && (
        <FeedbackForm
          item={selectedItem}
          order={selectedOrder}
          onSubmit={handleSubmitFeedback}
          onCancel={() => setShowFeedbackForm(false)}
        />
      )}
    </div>
  );
}
