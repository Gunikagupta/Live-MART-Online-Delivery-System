import React from "react";
import { Link } from "react-router-dom";

export default function Categories() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
        Categories
      </h1>
      <div className="mb-6">
        <Link
          to="/shops/nearby"
          className="px-6 py-3 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 text-white rounded-xl shadow font-bold hover:scale-105 transition"
        >
          Browse Nearby Shops
        </Link>
      </div>
      <p className="text-lg text-gray-700">Your categories grid goes here.</p>
    </div>
  );
}
