import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { useCart } from "../CartContext";

export default function ItemList() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [categoryName, setCategoryName] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  // REAL LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/"); // redirect to login
  };

  // Initialize quantities for items
  useEffect(() => {
    if (items.length > 0) {
      const initial = {};
      items.forEach((item) => (initial[item.id] = 1));
      setQuantities(initial);
    }
  }, [items]);

  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] - 1),
    }));
  };

  // Load category + items
  useEffect(() => {
    setIsLoading(true);

    api
      .get(`/api/categories/${categoryId}/items`)
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]));

    api
      .get(`/api/dashboard/categories/${categoryId}`)
      .then((res) => setCategoryName(res.data.name || "Items"))
      .catch(() => setCategoryName("Items"))
      .finally(() => setIsLoading(false));
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-4 grid grid-cols-3 items-center">
         {/* LEFT — Logo + Text */}
<div
  className="flex items-center gap-3 cursor-pointer select-none"
  onClick={() => navigate("/dashboard")}
>
  <img
    src="/bazarbari.jpg"
    alt="BazaarBari Logo"
    className="w-10 h-10 object-contain"
  />

  <span
    className="text-3xl font-extrabold bg-gradient-to-r from-rose-900 via-rose-700 to-pink-400
               bg-clip-text text-transparent tracking-tight"
  >
    BazaarBari
  </span>
</div>

          {/* CENTER — Category Name */}
          <div className="flex justify-center">
            <h1 className="text-3xl font-extrabold uppercase tracking-wide bg-gradient-to-r
                           from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
              {categoryName}
            </h1>
          </div>

          {/* RIGHT — MENU */}
          <div className="flex justify-end items-center gap-10 text-gray-700 font-medium text-lg">

            <button onClick={() => navigate(-1)} className="hover:text-rose-600 transition font-semibold">
              ← Back
            </button>

            <button onClick={() => navigate("/orders")} className="hover:text-rose-600 transition">
              Orders
            </button>

            <button onClick={() => navigate("/cart")} className="hover:text-rose-600 transition relative">
              🛒 Cart
            </button>

            {/* ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
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

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-xl py-2 z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </button>

                  <hr className="my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
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

      {/* PAGE CONTENT */}
      <div className="px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        
        {items.map((item) => {
  // Generate a random rating from 1 to 5 for dummy stars display
  const dummyRating = Math.floor(Math.random() * 5) + 1;

  return (
    <div key={item.id} className="bg-white rounded-xl p-4 shadow hover:shadow-xl border cursor-pointer">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="h-48 w-full object-cover rounded-lg"
      />

      <h2 className="text-xl font-bold mt-3">{item.name}</h2>
      <p className="text-2xl font-extrabold text-pink-600">₹{item.price}</p>

      <span
        className={`text-xs px-3 py-1 mt-2 rounded-full inline-block ${
          item.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {item.stock > 0 ? `In Stock (${item.stock})` : "Out of Stock"}
      </span>

      {/* Dummy star rating display */}
      <div className="flex items-center mt-3 gap-2 select-none">
        <div className="text-yellow-400 font-bold text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < dummyRating ? "★" : "☆"}</span>
          ))}
        </div>

        {/* Small "Leave Feedback" link */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/feedback/${item.id}`);
          }}
          className="text-sm text-pink-600 underline hover:text-pink-800 ml-2"
        >
          Leave Feedback
        </button>
      </div>

      {/* Existing quantity controls and Add to Cart button here */}
      {item.stock > 0 && (
        <>
          <div className="mt-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => decreaseQty(item.id)} className="px-3 py-1 bg-gray-200 rounded-lg">–</button>
            <span className="px-4 py-1 bg-gray-100 rounded border">{quantities[item.id] || 1}</span>
            <button onClick={() => increaseQty(item.id)} className="px-3 py-1 bg-gray-200 rounded-lg">+</button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item, quantities[item.id]);
            }}
            className="mt-3 w-full py-2 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-xl font-semibold"
          >
            Add to Cart
          </button>
        </>
      )}
    </div>
  );
})}

      </div>
    </div>
  );
}
