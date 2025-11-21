import React, { useState } from "react";
import Navbar from "./Navbar";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // PayPal order placement handler
  const placeOrderAfterPayment = async (paypalDetails) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const orderPayload = {
      user: { id: user.id },
      orderItems: cart.map((item) => ({
        item: { id: item.id },
        quantity: item.quantity,
      })),
      deliveryAddress: address,
      status: "PAID",
      paymentId: paypalDetails.id,
      offlineOrder: false,
      offlineOrderDate: schedule || null,
    };

    try {
      await api.post("/api/orders/place", orderPayload);
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order placement failed. Check console.");
    }
  };

  // COD handler with field validation
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
        quantity: item.quantity,
      })),
      deliveryAddress: address,
      status: "PLACED",
      offlineOrder: false,
      offlineOrderDate: schedule || null,
    };

    try {
      await api.post("/api/orders/place", orderPayload);
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order placement failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-50 p-10 md:col-span-2">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
            Checkout
          </h1>
          <label className="block font-semibold text-gray-700 mb-2">Delivery Address</label>
          <textarea
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 mb-6 focus:ring-2 focus:ring-pink-400 outline-none transition"
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label className="block font-semibold text-gray-700 mb-2">Schedule Delivery (optional)</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 mb-6 focus:ring-2 focus:ring-pink-400 outline-none transition"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />

          <label className="block font-semibold text-gray-700 mb-2">Payment Method</label>
          <div className="flex gap-6 mb-10">
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="accent-pink-700"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
                className="accent-pink-700"
              />
              Online Payment (PayPal)
            </label>
          </div>

          {paymentMethod === "COD" && (
            <button
              onClick={placeOrder}
              className="w-full py-4 rounded-xl text-white font-bold text-lg
                bg-gradient-to-r from-pink-900 via-red-700 to-pink-400
                shadow-lg hover:shadow-2xl hover:opacity-90 transition"
            >
              Place Order
            </button>
          )}

          {paymentMethod === "ONLINE" && (
            <div className="w-full">
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: { value: total.toString() },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    console.log("Payment Success:", details);
                    placeOrderAfterPayment(details);
                  });
                }}
              />
            </div>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-50 p-10">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent mb-6">
            Order Summary
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="mb-6 pb-4 border-b border-dashed border-pink-100">
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-600">Qty: {item.quantity}</p>
                <p className="text-pink-700 font-bold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))
          )}
          <div className="flex justify-between items-center mt-8 text-xl font-bold">
            <span className="text-gray-700">Total</span>
            <span className="bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
              ₹{total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
