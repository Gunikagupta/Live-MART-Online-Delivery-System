import React from "react";
import { useCart } from "../CartContext";

export default function CartContent() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 text-xl">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cart.map((item) => (
        <div
          key={item.itemId}
          className="flex items-center justify-between bg-white shadow-md p-4 rounded-xl"
        >
          {/* IMAGE */}
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-20 h-20 object-cover rounded-md"
            />
          )}

          {/* ITEM INFO */}
          <div className="flex-1 px-6">
            <h2 className="text-lg font-semibold text-gray-800">{item.itemName}</h2>
            <p className="text-pink-600 font-bold text-xl">₹{item.price}</p>
          </div>

          {/* QUANTITY SECTION */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
              className="px-3 py-1 bg-gray-200 rounded-md"
              disabled={item.quantity === 1}
            >
              -
            </button>
            <span className="px-4 py-1 bg-gray-100 rounded-md border">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              +
            </button>
          </div>

          {/* REMOVE BUTTON */}
          <button
            onClick={() => removeFromCart(item.itemId)}
            className="ml-6 text-red-600 font-semibold hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
