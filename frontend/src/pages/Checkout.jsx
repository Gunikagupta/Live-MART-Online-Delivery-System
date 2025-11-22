import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { PayPalButtons } from "@paypal/react-paypal-js";

// Import from the shared file you created:
// frontend/src/components/nearbyShopsData.js
import { getNearbyShopsMock } from "../components/nearbyShopsData";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [pickupLocation, setPickupLocation] = useState("");
  const [nearbyShops, setNearbyShops] = useState([]);

  // Load nearby shops from geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const res = await getNearbyShopsMock(lat, lng, 5);
        setNearbyShops(res.data);
      },
      async () => {
        // fallback if user blocks location
        const res = await getNearbyShopsMock(19.05, 72.85, 5);
        setNearbyShops(res.data);
      }
    );
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addressNeeded = deliveryMode === "DELIVERY";

  const getDeliveryAddressValue = () => {
    if (deliveryMode === "DELIVERY") return address;

    const shop = nearbyShops.find((s) => s.id == pickupLocation);
    return shop ? `Pickup: ${shop.shopName}` : "";
  };

  // --- PayPal handler ---
  const placeOrderAfterPayment = async (paypalDetails) => {
    if (deliveryMode === "COLLECT" && !pickupLocation) {
      alert("Please select a shop to collect your order from.");
      return;
    }

    if (deliveryMode === "DELIVERY" && !address.trim()) {
      alert("Please enter your address.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User not logged in");

    const payload = {
      user: { id: user.id },
      orderItems: cart.map((item) => ({
        item: { id: item.id },
        quantity: item.quantity,
      })),
      deliveryAddress: getDeliveryAddressValue(),
      orderType: deliveryMode,
      status: "PAID",
      paymentId: paypalDetails.id,
      offlineOrder: false,
      offlineOrderDate: schedule || null,
    };

    try {
      await api.post("/api/orders/place", payload);
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  // --- COD handler ---
  const placeOrder = async () => {
    if (deliveryMode === "DELIVERY" && !address.trim()) {
      alert("Please enter your address.");
      return;
    }

    if (deliveryMode === "COLLECT" && !pickupLocation) {
      alert("Please select a pickup shop.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User not logged in");

    const payload = {
      user: { id: user.id },
      orderItems: cart.map((item) => ({
        item: { id: item.id },
        quantity: item.quantity,
      })),
      deliveryAddress: getDeliveryAddressValue(),
      orderType: deliveryMode,
      status: "PLACED",
      offlineOrder: false,
      offlineOrderDate: schedule || null,
    };

    try {
      await api.post("/api/orders/place", payload);
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Order placement failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-10 md:col-span-2">
          <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
            Checkout
          </h1>

          {/* Order Method */}
          <label className="block font-semibold text-gray-700 mb-2">
            Order Method
          </label>
          <div className="flex gap-6 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={deliveryMode === "DELIVERY"}
                onChange={() => setDeliveryMode("DELIVERY")}
                className="accent-pink-700"
              />
              Door Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={deliveryMode === "COLLECT"}
                onChange={() => setDeliveryMode("COLLECT")}
                className="accent-pink-700"
              />
              Collect From Shop
            </label>
          </div>

          {/* Pickup Shop Dropdown */}
          {deliveryMode === "COLLECT" && (
            <>
              <label className="block font-semibold text-gray-700 mb-2">
                Choose Pickup Shop
              </label>

              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 mb-6 focus:ring-2 focus:ring-pink-400"
              >
                <option value="">Select a nearby shop</option>

                {nearbyShops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shopName} ({shop.distanceKm} km)
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Address for Delivery */}
          {deliveryMode === "DELIVERY" && (
            <>
              <label className="block font-semibold text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 mb-6"
                placeholder="Enter your full address"
              />
            </>
          )}

          {/* Schedule */}
          <label className="block font-semibold text-gray-700 mb-2">
            Schedule Delivery/Collect (optional)
          </label>
          <input
            type="datetime-local"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 mb-6"
          />

          {/* Payment Method */}
          <label className="block font-semibold text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="flex gap-6 mb-10">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="accent-pink-700"
              />
              Cash on Delivery/Collect
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
                className="accent-pink-700"
              />
              Online Payment (PayPal)
            </label>
          </div>

          {/* COD Button */}
          {paymentMethod === "COD" && (
            <button
              onClick={placeOrder}
              className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400"
            >
              {deliveryMode === "COLLECT"
                ? "Book and Collect"
                : "Place Order"}
            </button>
          )}

          {/* PayPal */}
          {paymentMethod === "ONLINE" && (
            <div className="w-full">
              <PayPalButtons
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      {
                        amount: { value: total.toString() },
                      },
                    ],
                  })
                }
                onApprove={(data, actions) =>
                  actions.order.capture().then((details) => {
                    placeOrderAfterPayment(details);
                  })
                }
              />
            </div>
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent mb-6">
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="mb-6 pb-4 border-b border-dashed border-pink-100"
              >
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p>Qty: {item.quantity}</p>
                <p className="font-bold text-pink-700">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))
          )}

          <div className="flex justify-between text-xl font-bold mt-8">
            <span>Total</span>
            <span className="bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
              ₹{total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
