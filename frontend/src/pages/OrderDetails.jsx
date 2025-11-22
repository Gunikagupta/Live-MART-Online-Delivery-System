import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";

function StatusTimeline({ status }) {
  const steps = ["CREATED", "PACKED", "DISPATCHED", "OUT_FOR_DELIVERY", "DELIVERED"];
  return (
    <div className="flex items-center gap-4">
      {steps.map((s) => {
        const done = steps.indexOf(s) <= steps.indexOf(status);
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {done ? "✓" : steps.indexOf(s) + 1}
            </div>
            <div className={`text-sm ${done ? "text-gray-800" : "text-gray-400"}`}>
              {s.replace(/_/g, " ")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  // Dummy feedback data
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      user: { name: "Alice" },
      rating: 5,
      comment: "Fast and reliable delivery!",
      timestamp: "2025-11-20T15:30:00",
    },
    {
      id: 2,
      user: { name: "Bob" },
      rating: 4,
      comment: "Good packaging but item was slightly delayed.",
      timestamp: "2025-11-18T12:10:00",
    },
  ]);

  // New feedback form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err));
  }, [orderId]);

  const downloadIcs = () => {
    const start = new Date(order.scheduledAt || order.createdAt);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 minutes
    const pad = (n) => (n < 10 ? `0${n}` : n);
    const formatICS = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
        d.getUTCHours()
      )}${pad(d.getUTCMinutes())}00Z`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BazaarBari//EN",
      "BEGIN:VEVENT",
      `UID:order-${order.id}@livemart`,
      `DTSTAMP:${formatICS(new Date())}`,
      `DTSTART:${formatICS(start)}`,
      `DTEND:${formatICS(end)}`,
      `SUMMARY:BazaarBari - Order #${order.id}`,
      `DESCRIPTION:Delivery for order ${order.id}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livemart-order-${order.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmitFeedback = () => {
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    setIsSubmitting(true);

    // Dummy submit: add new feedback locally
    const newFeedback = {
      id: feedbackList.length + 1,
      user: { name: "You" },
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    setFeedbackList([newFeedback, ...feedbackList]);
    setRating(5);
    setComment("");
    setIsSubmitting(false);
    alert("Feedback submitted locally!");
  };

  if (!order) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        {/* Order Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">Order #{order.id}</h3>
            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">₹{order.total}</div>
            <div className="text-sm text-gray-600">{order.paymentMethod}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <StatusTimeline status={order.status} />
        </div>

        {/* Items */}
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold">Items</h4>
          <ul className="mt-2">
            {order.items.map((it) => (
              <li key={it.itemId} className="flex justify-between py-2">
                <div>
                  {it.name} x{it.qty}
                </div>
                <div>₹{it.price * it.qty}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Calendar buttons */}
        <div className="mt-6 flex gap-3">
          {order.scheduledAt && (
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={downloadIcs}
            >
              Add to calendar
            </button>
          )}
          <a
            className="px-4 py-2 border rounded"
            href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              `BazaarBari Order #${order.id}`
            )}&dates=${encodeURIComponent(
              new Date(order.scheduledAt || order.createdAt).toISOString()
            )}/${encodeURIComponent(new Date(order.scheduledAt || order.createdAt).toISOString())}`}
            target="_blank"
            rel="noreferrer"
          >
            Add to Google Calendar
          </a>
        </div>

        {/* Feedback Section */}
        <div className="mt-10 border-t pt-6">
          <h4 className="text-xl font-bold mb-4 text-pink-700">Customer Feedback</h4>

          {/* Feedback submission form */}
          <div className="bg-pink-50 p-6 rounded-lg mb-8">
            <label className="block font-semibold mb-2">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="mb-4 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <label className="block font-semibold mb-2">Comment</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Write your feedback here..."
            />

            <button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
              className={`mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded font-semibold ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>

          {/* List of existing feedbacks */}
          {feedbackList.length === 0 ? (
            <p className="text-gray-500 italic">No feedback yet for this order.</p>
          ) : (
            feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="mb-4 border rounded p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-pink-700">{fb.user.name}</span>
                  <span className="text-yellow-400 font-bold">
                    {"★".repeat(fb.rating)}{" "}
                    {"☆".repeat(5 - fb.rating)}
                  </span>
                </div>
                <p className="mb-1">{fb.comment}</p>
                <small className="text-gray-400 italic">
                  {new Date(fb.timestamp).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
