import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ showSearch = false }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* FULL-WIDTH MAROON → RED → PINK GRADIENT */}
      <div
        className="
          w-full 
          bg-gradient-to-r from-rose-900 via-red-600 to-pink-500
          text-white
        "
      >
        <div
          className="
            max-w-7xl mx-auto 
            py-3
            flex items-center justify-between 
            gap-8
          "
        >

          {/* LEFT: LOGO */}
          <div
            className="text-3xl font-extrabold cursor-pointer whitespace-nowrap"
            onClick={() => navigate("/")}
          >
            LiveMart
          </div>

          {/* CENTER: SEARCH BAR — ONLY ON CATEGORY PAGE */}
          {showSearch && (
            <div className="flex-1 flex justify-center">
              <input
                type="text"
                placeholder="Search for items, shops, categories..."
                className="
                  w-full max-w-xl
                  border border-white/40 
                  bg-white/20 
                  rounded-full 
                  px-5 py-2.5 
                  text-white
                  placeholder-white/80
                  shadow 
                  focus:outline-none focus:ring-2 focus:ring-white/70
                "
              />
            </div>
          )}

          {/* RIGHT MENU */}
          <div className="flex items-center gap-8 text-lg font-semibold whitespace-nowrap">

            <button
              onClick={() => navigate("/cart")}
              className="hover:text-yellow-200 transition"
            >
              Your Cart
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="hover:text-yellow-200 transition"
            >
              Orders
            </button>

            <button
              onClick={() => navigate("/feedback")}
              className="hover:text-yellow-200 transition"
            >
              Feedback
            </button>

            {/* ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="
                  px-5 py-2 
                  bg-white/30 
                  backdrop-blur-sm 
                  rounded-full 
                  shadow 
                  hover:bg-white/40 
                  flex items-center gap-2 
                  transition
                "
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
                Account
              </button>

              {open && (
                <div
                  className="
                    absolute right-0 mt-2 
                    w-48 
                    bg-white text-black 
                    shadow-lg border rounded-xl 
                    py-2 
                    z-50
                  "
                >
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
                    onClick={() => { navigate("/profile"); setOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
