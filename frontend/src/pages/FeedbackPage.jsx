import React, { useState } from "react";
import { useParams } from "react-router-dom";

function FeedbackPage() {
  const { orderId } = useParams(); // ✅ FIXED

  // Hardcoded dummy feedback list
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      user: { name: "Alice" },
      rating: 5,
      comment: "Excellent product, very satisfied!",
      timestamp: "2025-11-20T15:30:00",
    },
    {
      id: 2,
      user: { name: "Bob" },
      rating: 3,
      comment: "It's okay, could be better.",
      timestamp: "2025-11-19T11:15:00",
    },
    {
      id: 3,
      user: { name: "Charlie" },
      rating: 4,
      comment: "Good value for money.",
      timestamp: "2025-11-18T08:45:00",
    },
  ]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }

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
    alert("Feedback submitted (locally)!");
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
        Feedback for Order #{orderId}
      </h1>

      {/* Feedback Submission Form */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-pink-100 mb-12">
        <h2 className="text-2xl font-bold mb-4">Leave Your Feedback</h2>

        <label className="block mb-2 font-semibold">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-24 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 mb-6"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">Comment</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 mb-6"
          placeholder="Write your feedback here..."
        />

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 shadow-lg hover:shadow-xl transition"
        >
          Submit Feedback
        </button>
      </div>

      {/* Existing Feedback List */}
      <div>
        <h2 className="text-3xl font-extrabold mb-6">Existing Feedback</h2>

        {feedbackList.length === 0 ? (
          <p className="text-center text-gray-500">
            No feedback yet. Be the first to review!
          </p>
        ) : (
          feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-pink-50 mb-6"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-pink-700">{fb.user.name}</span>
                <span className="text-yellow-500 font-bold">
                  {"★".repeat(fb.rating)}{" "}
                  {"☆".repeat(5 - fb.rating)}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{fb.comment}</p>
              <p className="text-xs text-gray-400 italic">
                {new Date(fb.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;
