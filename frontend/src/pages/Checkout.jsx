import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { PayPalButtons } from "@paypal/react-paypal-js";
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

  // ---------------- COUPON STATES ----------------
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  // ---------------- SINGLE CLEAN useEffect ----------------
  useEffect(() => {
    // Load Nearby Shops
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const res = await getNearbyShopsMock(lat, lng, 5);
        setNearbyShops(res.data);
      },
      async () => {
        const res = await getNearbyShopsMock(19.05, 72.85, 5);
        setNearbyShops(res.data);
      }
    );

    // Check If First Order
    async function checkFirstOrder() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const res = await api.get(`/api/orders/user/${user.id}`);
        setIsFirstOrder(res.data.length === 0); // TRUE only if 0 orders
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    }

    checkFirstOrder();
  }, []);

  // ---------------- SUBTOTAL ----------------
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ---------------- DETERMINE AVAILABLE COUPONS ----------------
  const eligibleCoupons = [];

  if (isFirstOrder) {
    eligibleCoupons.push({
      id: "WELCOME10",
      label: "🎁 Welcome10 — 10% OFF (First Order)",
      discountType: "PERCENT",
      value: 10,
    });
  }

  if (subtotal >= 1000) {
    eligibleCoupons.push({
      id: "BIG_BASKET",
      label: "🛒 Big Basket Bonus — ₹75 OFF above ₹1000",
      discountType: "FLAT",
      value: 75,
    });
  }

  if (subtotal >= 3000) {
    eligibleCoupons.push({
      id: "MEGA_SAVER",
      label: "🎉 Mega Saver Deal — ₹200 OFF above ₹3000",
      discountType: "FLAT",
      value: 200,
    });
  }

  if (subtotal >= 5000) {
    eligibleCoupons.push({
      id: "PREMIUM_REWARD",
      label: "⭐ Premium Shopper Reward — ₹400 OFF above ₹5000",
      discountType: "FLAT",
      value: 400,
    });
  }

  // ---------------- APPLY DISCOUNT WHEN COUPON CHANGES ----------------
  useEffect(() => {
    let d = 0;

    const coupon = eligibleCoupons.find((c) => c.id === selectedCoupon);

    if (coupon) {
      if (coupon.discountType === "PERCENT") {
        d = (subtotal * coupon.value) / 100;
      } else if (coupon.discountType === "FLAT") {
        d = coupon.value;
      }
    }

    setDiscount(d);
  }, [selectedCoupon, subtotal, isFirstOrder]);

  // ---------------- DELIVERY ADDRESS ----------------
  const getDeliveryAddressValue = () => {
    if (deliveryMode === "DELIVERY") return address;

    const shop = nearbyShops.find((s) => s.id == pickupLocation);
    return shop ? `Pickup: ${shop.shopName}` : "";
  };

  // ---------------- TOTALS ----------------
  const total = subtotal;
  const finalTotal = Math.max(total - discount, 0).toFixed(2);

  // ---------------- ORDER VALIDATION ----------------
  const validateBeforeOrder = () => {
    if (deliveryMode === "DELIVERY" && !address.trim()) {
      alert("Please enter your address.");
      return false;
    }
    if (deliveryMode === "COLLECT" && !pickupLocation) {
      alert("Please select a pickup shop.");
      return false;
    }
    return true;
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async () => {
    if (!validateBeforeOrder()) return;

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
      discountAmount: discount,
      finalAmount: finalTotal,
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

  // ---------------- AFTER PAYPAL PAYMENT ----------------
  const placeOrderAfterPayment = async (details) => {
    if (!validateBeforeOrder()) return;

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
      discountAmount: discount,
      finalAmount: finalTotal,
      paymentId: details.id,
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

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT SIDE */}
        <div className="bg-white rounded-3xl shadow-xl p-10 md:col-span-2">
          <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
            Checkout
          </h1>

          {/* Order Method */}
          <label className="font-semibold">Order Method</label>
          <div className="flex gap-6 mb-6 mt-2">
            <label>
              <input
                type="radio"
                checked={deliveryMode === "DELIVERY"}
                onChange={() => setDeliveryMode("DELIVERY")}
                className="accent-pink-700"
              />
              <span className="ml-2">Door Delivery</span>
            </label>

            <label>
              <input
                type="radio"
                checked={deliveryMode === "COLLECT"}
                onChange={() => setDeliveryMode("COLLECT")}
                className="accent-pink-700"
              />
              <span className="ml-2">Collect From Shop</span>
            </label>
          </div>

          {/* Pickup dropdown */}
          {deliveryMode === "COLLECT" && (
            <>
              <label className="font-semibold">Choose Pickup Shop</label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full mt-2 border p-4 rounded-xl bg-gray-50 mb-6"
              >
                <option value="">Select shop</option>
                {nearbyShops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shopName} ({shop.distanceKm} km)
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Address */}
          {deliveryMode === "DELIVERY" && (
            <>
              <label className="font-semibold">Delivery Address</label>
              <textarea
                className="w-full mt-2 border p-4 rounded-xl bg-gray-50 mb-6"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </>
          )}

          {/* Schedule */}
          <label className="font-semibold">Schedule Delivery/Collect</label>
          <input
            type="datetime-local"
            className="w-full mt-2 border p-4 rounded-xl bg-gray-50 mb-6"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />

          {/* COUPONS */}
          <h2 className="text-xl font-extrabold mb-4 text-pink-700">
            Available Coupons
          </h2>

          {eligibleCoupons.length === 0 ? (
            <p className="text-gray-500 mb-6">
              No coupons available for current order.
            </p>
          ) : (
            <>
              <label className="font-medium text-gray-700">Choose a Coupon</label>
              <select
                className="w-full border p-4 rounded-xl bg-gray-50 mt-2 mb-6"
                value={selectedCoupon}
                onChange={(e) => setSelectedCoupon(e.target.value)}
              >
                <option value="">No Coupon</option>

                {eligibleCoupons.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Payment Method */}
          <label className="font-semibold">Payment Method</label>
          <div className="flex gap-6 mb-10 mt-2">
            <label>
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="accent-pink-700"
              />
              <span className="ml-2">Cash on Delivery</span>
            </label>

            <label>
              <input
                type="radio"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
                className="accent-pink-700"
              />
              <span className="ml-2">Online Payment</span>
            </label>
          </div>

          {/* Buttons */}
          {paymentMethod === "COD" ? (
            <button
              onClick={placeOrder}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-900 to-red-500 text-white font-bold"
            >
              Place Order
            </button>
          ) : (
            <PayPalButtons
              createOrder={(data, actions) =>
                actions.order.create({
                  purchase_units: [
                    { amount: { value: finalTotal.toString() } },
                  ],
                })
              }
              onApprove={(data, actions) =>
                actions.order.capture().then((details) =>
                  placeOrderAfterPayment(details)
                )
              }
            />
          )}
        </div>

        {/* RIGHT SIDE – Order Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-2xl font-extrabold mb-6 text-pink-700">
            Order Summary
          </h2>

          {cart.map((item) => (
            <div key={item.id} className="mb-6 border-b pb-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p>Qty: {item.quantity}</p>
              <p className="text-pink-700 font-bold">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}

          <div className="flex justify-between font-bold text-xl mt-6">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-green-600 font-bold text-lg mt-3">
            <span>Discount</span>
            <span>- ₹{discount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-extrabold text-2xl mt-6">
            <span>Total</span>
            <span className="text-pink-700">₹{finalTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
