import React, { useState } from "react";
import Navbar from "./Navbar";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
  if (!address.trim()) {
    alert("Please enter your address.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("User not logged in");
    return;
  }

  const orderPayload = {
    user: { id: user.id },
    orderItems: cart.map((item) => ({
      item: { id: item.id },
      quantity: item.quantity
    })),
    deliveryAddress: address,
    status: "PLACED",
    offlineOrder: false,
    offlineOrderDate: schedule ? schedule : null
  };

  console.log("Sending:", orderPayload);

  try {
    await api.post("/api/orders/place", orderPayload);
    navigate("/orders");
  } catch (err) {
    console.error("Order failed:", err);
    alert("Order placement failed. Check console.");
  }
};



  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* LEFT – FORM */}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Checkout</h1>

          <label className="block font-semibold mb-2">Delivery Address</label>
          <textarea
            className="w-full border rounded-xl p-3 h-28 focus:ring-2 focus:ring-pink-400 outline-none"
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label className="block font-semibold mt-6 mb-2">Schedule Delivery (optional)</label>
          <input
            type="datetime-local"
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />

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

        {/* RIGHT – SUMMARY */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
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
