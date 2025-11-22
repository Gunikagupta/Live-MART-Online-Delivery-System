import React from "react";
import { useCart } from "../CartContext";
import CartContent from "../components/CartContent";
import { useNavigate } from "react-router-dom";

export default function CartContents() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate totals
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans">
      <button
        onClick={() => navigate(-1)}
        className="text-pink-700 font-semibold mb-6 hover:underline transition"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-pink-800 via-red-600 to-pink-400 bg-clip-text text-transparent">
        Your Cart
      </h1>

      <CartContent />

      {cart.length > 0 && (
        <div className="mt-12 bg-white p-8 rounded-3xl shadow-lg max-w-xl mx-auto border border-pink-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-pink-200 pb-3">
            Order Summary
          </h2>

          <div className="flex justify-between text-lg mb-4 text-gray-700">
            <span>Total Items:</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between text-2xl font-extrabold text-gradient-pink mb-6">
            <span>Total Price:</span>
            <span>₹{totalPrice}</span>
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            className="w-full py-4 rounded-xl font-bold text-white
              bg-gradient-to-r from-pink-800 via-red-600 to-pink-400
              shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-300"
          >
            Checkout
          </button>

          {/* CLEAR CART */}
          <button
            onClick={clearCart}
            className="w-full mt-4 py-3 text-pink-700 hover:text-red-500 hover:underline font-semibold transition-colors"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}
