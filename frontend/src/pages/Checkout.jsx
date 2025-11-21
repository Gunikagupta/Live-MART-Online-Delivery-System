import React, { useState } from "react";
import Navbar from "./Navbar";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    navigate("/orders");
  };

  return (
    <div
      className="
        min-h-screen 
        bg-gray-50
        relative 
        overflow-hidden
      "
    >
      {/* 🔹 Subtle Pattern Background (clean & premium) */}
      <div
        className="
          absolute inset-0 
          bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.6)_0%,_rgba(230,230,230,0.4)_40%,_rgba(240,240,240,0.7)_100%)] 
          opacity-70
          pointer-events-none
        "
      />

      {/* 🔹 Faint dotted pattern overlay */}
      <div
        className="
          absolute inset-0 
          bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22 viewBox=%220 0 4 4%22%3E%3Ccircle cx=%221%22 cy=%221%22 r=%220.5%22 fill=%22%23e0e0e0%22 /%3E%3C/svg%3E')]
          opacity-20
          pointer-events-none
        "
      />

      {/* NAVBAR */}
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* LEFT SIDE – FORM */}
        <div className="md:col-span-2 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Checkout</h1>

          {/* Delivery Address */}
          <label className="block font-semibold mb-2">Delivery Address</label>
          <textarea
            className="w-full border rounded-xl p-3 h-28 focus:ring-2 focus:ring-pink-400 outline-none"
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>

          {/* Schedule */}
          <label className="block font-semibold mt-6 mb-2">
            Schedule Delivery (optional)
          </label>
          <input
            type="datetime-local"
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />

          {/* Payment Method */}
          <label className="block font-semibold mt-6 mb-2">Payment Method</label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              Online Payment
            </label>
          </div>

          <button
            onClick={placeOrder}
            className="w-full mt-8 bg-gradient-to-r from-pink-600 to-red-500 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:opacity-90"
          >
            Place Order
          </button>
        </div>

        {/* RIGHT SIDE – ORDER SUMMARY */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-extrabold mb-4 text-gray-800">
            Order Summary
          </h2>

          {cart.map((item) => (
            <div key={item.id} className="mb-4 border-b pb-4">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600">Qty: {item.quantity}</p>
              <p className="text-pink-600 font-bold">₹{item.price * item.quantity}</p>
            </div>
          ))}

          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
