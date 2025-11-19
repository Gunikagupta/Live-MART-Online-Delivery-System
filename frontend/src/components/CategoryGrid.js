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
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      {/* PAGE TITLE */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 select-none">
        <span className="bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 
                         bg-clip-text text-transparent drop-shadow">
          Shop by Category
        </span>
      </h1>

      {/* NEARBY SHOPS BUTTON */}
      <div className="text-center mb-10">
        <Link
          to="/shops/nearby"
          className="inline-block px-8 py-3 text-lg font-semibold rounded-xl border border-pink-300 hover:border-pink-700 
                     bg-white shadow-md hover:shadow-lg transition-all bg-clip-text text-transparent
                     bg-gradient-to-r from-pink-900 via-red-700 to-pink-400"
        >
          Find Nearby Shops →
        </Link>
      </div>

      {/* VERTICAL CATEGORY LIST */}
      <div className="max-w-4xl mx-auto space-y-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="
              group
              bg-white
              rounded-3xl
              border border-pink-200
              hover:border-pink-600
              shadow-lg
              hover:shadow-2xl
              cursor-pointer
              transition-all duration-300
              overflow-hidden
              flex flex-col sm:flex-row
              min-h-[240px]
            "
          >

            {/* CATEGORY IMAGE */}
            <div className="w-full sm:w-1/3 h-60 sm:h-auto overflow-hidden">
              <img
                src={cat.imageUrl || 'https://via.placeholder.com/400'}
                alt={cat.name}
                className="
                  w-full h-full object-cover 
                  transition duration-300 
                  group-hover:scale-105 
                  group-hover:opacity-90
                "
              />
            </div>

            {/* TEXT AREA */}
            <div className="flex flex-col justify-center items-start px-8 py-6 sm:w-2/3">
              <h2 className="
                text-3xl font-bold 
                bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 
                bg-clip-text text-transparent
                mb-2
              ">
                {cat.name}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                Explore fresh and curated {cat.name.toLowerCase()} near you.
              </p>

              <button
                className="
                  mt-6 px-6 py-3 text-white text-sm font-semibold rounded-xl
                  bg-gradient-to-r from-pink-900 via-red-700 to-pink-400
                  shadow-md hover:shadow-lg 
                  transition-all
                "
              >
                Browse →
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
