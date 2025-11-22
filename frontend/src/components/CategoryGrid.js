import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

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
      <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-pink-100">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-4 grid grid-cols-3 items-center">
          {/* LEFT – LOGO + TEXT */}
<div
  className="flex items-center gap-3 cursor-pointer select-none"
  onClick={() => navigate("/")}
>
  <img
    src="/bazaarbari_logo.png"   // place your logo in /public/
    alt="BazaarBari Logo"
    className="w-10 h-10 object-contain"
  />

  <span
    className="text-3xl font-extrabold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400
               bg-clip-text text-transparent tracking-tight"
  >
    BazaarBari
  </span>
</div>


          {/* CENTER – SEARCH BAR */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search for items, shops, categories..."
              className="w-full max-w-xl border border-pink-200 rounded-full px-6 py-3
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          {/* RIGHT – MENU */}
          <div className="flex justify-end items-center gap-8 text-gray-700 font-semibold text-lg">
            <button onClick={() => navigate("/")} className="hover:text-pink-600 transition" aria-label="Categories">
              Categories
            </button>
            <button onClick={() => navigate("/orders")} className="hover:text-pink-600 transition" aria-label="Orders">
              Orders
            </button>
            <button onClick={() => navigate("/feedback")} className="hover:text-pink-600 transition" aria-label="Feedback">
              Feedback
            </button>

            {/* ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r
                           from-pink-600 to-pink-500 text-white rounded-full shadow
                           hover:opacity-90 transition select-none"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A8 8 0 1118.878 6.196 8 8 0 015.12 17.804z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-pink-200 rounded-xl py-2 z-50"
                  role="menu"
                >
                  <button
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                    role="menuitem"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      navigate("/register");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                    role="menuitem"
                  >
                    Register
                  </button>

                  <hr className="my-2 border-pink-100" />

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                    role="menuitem"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("cart");
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    role="menuitem"
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
      <main className="min-h-screen bg-gray-50 py-16 px-6 sm:px-12">
        {/* PAGE TITLE */}
        <h1 className="text-5xl font-extrabold text-center mb-14 select-none">
          <span className="bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Shop by Category
          </span>
        </h1>

        {/* NEARBY SHOPS BUTTON */}
        <div className="text-center mb-12">
          <Link
            to="/shops/nearby"
            className="inline-block px-10 py-3 text-lg font-semibold rounded-xl border border-pink-300 
                       hover:border-pink-700 bg-white shadow-md hover:shadow-lg transition-all 
                       bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent select-none"
          >
            Find Nearby Shops →
          </Link>
        </div>

        {/* CATEGORY LIST with CSS Grid */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {categories.map((cat) => (
            <article
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="group bg-white rounded-3xl border border-pink-200 hover:border-pink-600
                         shadow-lg hover:shadow-2xl cursor-pointer transition duration-300
                         overflow-hidden select-none flex flex-col"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/category/${cat.id}`);
                }
              }}
              aria-label={`Browse category ${cat.name}`}
            >
              <div className="h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={`http://localhost:8080${cat.imageUrl}`}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-90"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col justify-center px-8 py-6 flex-1">
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent truncate">
                  {cat.name}
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-prose">
                  Explore fresh and curated {cat.name.toLowerCase()} near you.
                </p>
                <button
                  className="mt-auto px-8 py-3 text-white text-base font-semibold rounded-xl
                             bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 shadow-md
                             hover:shadow-xl transition select-none self-start"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${cat.id}`);
                  }}
                  aria-label={`Browse ${cat.name}`}
                >
                  Browse →
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
