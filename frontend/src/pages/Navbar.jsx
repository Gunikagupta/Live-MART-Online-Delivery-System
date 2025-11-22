import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamically show page title in center
  const pageTitle = (() => {
    if (location.pathname.startsWith("/cart")) return "Your Cart";
    if (location.pathname.startsWith("/orders")) return "Orders";
    if (location.pathname.startsWith("/feedback")) return "Feedback";
    if (location.pathname.startsWith("/profile")) return "My Profile";
    return ""; // Category Grid etc will show blank center
  })();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/");
  };

  return (
    <header className="w-full bg-gradient-to-r from-rose-900 via-red-700 to-pink-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-10 py-4 grid grid-cols-3 items-center">

        {/* LEFT — LiveMart */}
        <div
          className="text-3xl font-extrabold cursor-pointer tracking-tight"
          onClick={() => navigate("/dashboard")}
        >
          BazzarBari
        </div>

        {/* CENTER — Page Title */}
        <div className="flex justify-center">
          <h2 className="text-xl font-semibold tracking-wide select-none">
            {pageTitle}
          </h2>
        </div>

        {/* RIGHT — Menu */}
        <div className="flex justify-end items-center gap-10 text-white text-lg font-medium">

          <button
            onClick={() => navigate("/orders")}
            className="hover:text-gray-200 transition"
          >
            Orders
          </button>

          <button
            onClick={() => navigate("/feedback")}
            className="hover:text-gray-200 transition"
          >
            Feedback
          </button>

          {/* ACCOUNT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpen(prev => !prev)}
              className="flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-md 
                         rounded-full shadow hover:bg-white/30 transition"
            >
              <span>⚪</span> Account
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg border rounded-xl py-2 z-50">

                <button
                  onClick={() => { navigate("/profile"); setOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>

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
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
