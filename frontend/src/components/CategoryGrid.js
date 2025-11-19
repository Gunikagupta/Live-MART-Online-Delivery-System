import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false); // <-- DROPDOWN STATE

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/dashboard/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-4 grid grid-cols-3 items-center">

          {/* LEFT – LOGO */}
          <div
            className="text-3xl font-extrabold bg-gradient-to-r from-rose-900 via-rose-700 to-pink-400 
                       bg-clip-text text-transparent cursor-pointer tracking-tight"
            onClick={() => navigate("/")}
          >
            LiveMart
          </div>

          {/* CENTER – SEARCH BAR */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search for items, shops, categories..."
              className="w-full max-w-xl border border-gray-300 rounded-full px-5 py-2.5
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* RIGHT – MENU */}
          <div className="flex justify-end items-center gap-10 text-gray-700 font-medium text-lg">

            <button onClick={() => navigate("/")} className="hover:text-rose-600 transition">
              Categories
            </button>

            <button onClick={() => navigate("/orders")} className="hover:text-rose-600 transition">
              Orders
            </button>

            <button onClick={() => navigate("/feedback")} className="hover:text-rose-600 transition">
              Feedback
            </button>

            {/* ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r 
                           from-rose-600 to-pink-500 text-white rounded-full shadow 
                           hover:opacity-90 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24"
                  strokeWidth="1.8" stroke="currentColor"
                  className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M5.121 17.804A8 8 0 1118.878 6.196 8 8 0 015.12 17.804z" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-xl 
                                py-2 z-50 animate-fade-in">
                  <button
                    onClick={() => { navigate("/login"); setOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => { navigate("/register"); setOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Register
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={() => { navigate("/orders"); setOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={() => { navigate("/profile"); setOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => console.log("Logout")}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* MAIN PAGE */}
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
              className="group bg-white rounded-3xl border border-pink-200 hover:border-pink-600
                         shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300
                         overflow-hidden flex flex-col sm:flex-row min-h-[240px]"
            >
              <div className="w-full sm:w-1/3 h-60 sm:h-auto overflow-hidden">
                <img
                  src={`http://localhost:8080${cat.imageUrl}`}
                  alt={cat.name}
                  className="w-full h-full object-cover transition duration-300 
                             group-hover:scale-105 group-hover:opacity-90"
                />
              </div>

              <div className="flex flex-col justify-center items-start px-8 py-6 sm:w-2/3">
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
                             shadow-md hover:shadow-lg transition-all"
                >
                  Browse →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
