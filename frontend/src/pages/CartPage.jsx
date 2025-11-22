import React from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-gray-500 text-lg">Your cart is empty.</div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white p-5 rounded-xl shadow border flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p className="text-pink-600 font-bold">₹{item.price}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        –
                      </button>

                      <span className="px-4 py-1 bg-gray-100 rounded border">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 mt-3 font-semibold"
                    >
                      Remove
                    </button>
                  </div>

                  <img
                    src={item.imageUrl}
                    className="w-32 h-32 object-cover rounded-xl"
                    alt=""
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-xl border shadow">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full bg-gradient-to-r from-rose-600 to-red-500 text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
