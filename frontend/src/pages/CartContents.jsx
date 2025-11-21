import React from "react";
import { useCart } from "../CartContext";
import CartContent from "../components/CartContent";
import { useNavigate } from "react-router-dom";

export default function CartContents() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate totals
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-700 font-semibold mb-4"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-900 to-pink-400 text-transparent bg-clip-text">
        Your Cart
      </h1>

      <CartContent />

      {cart.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between text-lg mb-3">
            <span>Total Items:</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-xl font-bold text-pink-600">
            <span>Total Price:</span>
            <span>₹{totalPrice}</span>
          </div>

          {/* CHECKOUT BUTTON */}
          <button className="w-full mt-6 py-3 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-lg font-semibold shadow hover:opacity-90">
            Checkout
          </button>

          {/* CLEAR CART */}
          <button
            onClick={clearCart}
            className="w-full mt-3 py-2 text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}
