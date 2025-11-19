import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/dashboard/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 text-center">
        Shop by Category
      </h1>

      {/* ⭐ Nearby Shops Button */}
      <div className="text-center mb-12">
        <Link
          to="/shops/nearby"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg
                     hover:bg-indigo-700 transition font-semibold text-lg"
        >
          🔍 Find Nearby Shops
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                      gap-8 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="
              relative
              bg-white 
              rounded-2xl 
              shadow-xl
              overflow-hidden 
              cursor-pointer
              transform 
              transition-all duration-300 ease-in-out
              hover:scale-[1.03]
              hover:shadow-2xl
              border border-transparent hover:border-indigo-400
            "
          >
            <div className="w-full aspect-square overflow-hidden">
              <img
                src={cat.imageUrl || 'https://via.placeholder.com/400'}
                alt={cat.name}
                className="w-full h-full object-cover transition duration-300 hover:opacity-90"
              />
            </div>

            <div
              className="
                absolute 
                inset-x-0 
                bottom-0 
                bg-white/95
                backdrop-blur-sm 
                py-3 px-4 
                text-center 
                font-bold 
                text-gray-800 
                text-lg 
                rounded-t-lg
                shadow-lg
              "
            >
              <h2 className="text-lg font-bold text-indigo-700">
                {cat.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
