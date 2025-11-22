import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByUser, updateOrderStatus } from "../api/orders";

const USER_ID = 8; // Replace with actual logged-in user ID

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOrdersByUser(USER_ID).then(setOrders);
  }, []);

  const handleStatusUpdate = (id, status) => {
    updateOrderStatus(id, status).then(updated => {
      setOrders(orders.map(o => o.id === id ? updated : o));
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- Navbar identical to CategoryGrid --- */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-pink-100">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-4 grid grid-cols-3 items-center">
          {/* Logo */}
          <div
            className="text-3xl font-extrabold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent cursor-pointer tracking-tight select-none"
            onClick={() => navigate("/")}
          >
            LiveMart
          </div>
          {/* Search bar */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search your orders..."
              className="w-full max-w-xl border border-pink-200 rounded-full px-6 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>
          {/* Menu */}
          <div className="flex justify-end items-center gap-8 text-gray-700 font-semibold text-lg">
            <button onClick={() => navigate("/")} className="hover:text-pink-600 transition">Categories</button>
            <button onClick={() => navigate("/orders")} className="hover:text-pink-600 transition">Orders</button>
            <button onClick={() => navigate("/feedback")} className="hover:text-pink-600 transition">Feedback</button>
            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen(open => !open)}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-full shadow hover:opacity-90 transition select-none"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A8 8 0 1118.878 6.196 8 8 0 015.12 17.804z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Account
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-pink-200 rounded-xl py-2 z-50" role="menu">
                  <button onClick={() => { navigate("/login"); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-pink-50 transition">Login</button>
                  <button onClick={() => { navigate("/register"); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-pink-50 transition">Register</button>
                  <hr className="my-2 border-pink-100"/>
                  <button onClick={() => { navigate("/profile"); setOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-pink-50 transition">Profile</button>
                  <button onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("cart"); setOpen(false); navigate("/login"); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* --- End Navbar --- */}

      <main className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">My Orders</h2>
        <div className="space-y-8">
          {orders.length === 0 ? (
            <div className="text-center text-gray-400 text-lg py-12">No orders found.</div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl shadow-md border border-pink-100 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-pink-700">Order #{order.id}</div>
                    <div className="text-gray-500 text-sm">Address: {order.delivery_address}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                    ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  {order.status !== "DELIVERED" && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, "DELIVERED")}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 text-white font-semibold shadow hover:shadow-lg transition"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
