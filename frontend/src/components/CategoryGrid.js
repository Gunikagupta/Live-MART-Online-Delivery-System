import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";
import Navbar from "../pages/Navbar";

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/dashboard/categories")
      .then((res) => {
        const apiCats = res.data;

        const dummyCategories = [
          { id: 9001, name: "Meat & Poultry", imageUrl: "/dummy/meat.jpg" },
          { id: 9002, name: "Beverages", imageUrl: "/dummy/beverages.jpg" },
          { id: 9003, name: "Bakery", imageUrl: "/dummy/bakery.jpg" },
          { id: 9004, name: "Masalas & Oils", imageUrl: "/dummy/oils.jpg" },
          { id: 9005, name: "Snacks", imageUrl: "/dummy/snacks.jpg" },
          { id: 9006, name: "Frozen Food", imageUrl: "/dummy/frozen.jpg" },
          { id: 9007, name: "Household Essentials", imageUrl: "/dummy/household.jpg" },
        ];

        setCategories([...apiCats, ...dummyCategories]);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* GLOBAL NAVBAR WITH SEARCH */}
      <Navbar showSearch={true} />

      {/* MAIN PAGE CONTENT */}
      <div className="py-12 px-6">

        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
          <span className="bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 
                           bg-clip-text text-transparent">
            Shop by Category
          </span>
        </h1>

        {/* NEARBY SHOPS BUTTON */}
        <div className="text-center mb-10">
          <Link
            to="/shops/nearby"
            className="inline-block px-8 py-3 text-lg font-semibold rounded-xl border border-pink-300 hover:border-pink-700 
                       bg-white shadow hover:shadow-lg transition bg-clip-text text-transparent
                       bg-gradient-to-r from-pink-900 via-red-700 to-pink-400"
          >
            Find Nearby Shops →
          </Link>
        </div>

        {/* CATEGORY GRID */}
        <div className="max-w-4xl mx-auto space-y-10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="group bg-white rounded-3xl border border-pink-200 hover:border-pink-600
                         shadow hover:shadow-xl cursor-pointer transition-all 
                         overflow-hidden flex flex-col sm:flex-row min-h-[240px]"
            >
              <div className="w-full sm:w-1/3 h-60 sm:h-auto overflow-hidden">
                <img
                  src={
                    cat.imageUrl.startsWith("http")
                      ? cat.imageUrl
                      : `http://localhost:8080${cat.imageUrl}`
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover transition group-hover:scale-105 group-hover:opacity-90"
                />
              </div>

              <div className="flex flex-col justify-center px-8 py-6 sm:w-2/3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 
                               bg-clip-text text-transparent mb-2">
                  {cat.name}
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed">
                  Explore fresh and curated {cat.name.toLowerCase()} near you.
                </p>

                <button
                  className="mt-6 px-6 py-3 text-white text-sm font-semibold rounded-xl
                             bg-gradient-to-r from-pink-900 via-red-700 to-pink-400
                             shadow hover:shadow-lg transition"
                >
                  Browse →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
