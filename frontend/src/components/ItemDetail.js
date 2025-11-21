import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";

// This *must* match NearbyShops field names!
const items = [
  { itemId: 1, itemName: "Organic Brown Eggs", stockQuantity: 12, shopName: "Green Farm Organics", distanceKm: 1.2, price: 95 },
  { itemId: 2, itemName: "Amul Butter (500g)", stockQuantity: 45, shopName: "SuperMart Daily", distanceKm: 0.8, price: 275 },
  { itemId: 3, itemName: "Whole Wheat Bread", stockQuantity: 0, shopName: "The Bakery Junction", distanceKm: 2.5, price: 60 },
  { itemId: 4, itemName: "Basmati Rice (5kg)", stockQuantity: 8, shopName: "Kirana King", distanceKm: 3.1, price: 850 },
  { itemId: 5, itemName: "Fresh Paneer", stockQuantity: 15, shopName: "Daily Dairy", distanceKm: 1.5, price: 120 },
  { itemId: 6, itemName: "Coca Cola (2L)", stockQuantity: 100, shopName: "Beverage Depot", distanceKm: 4.2, price: 90 },
];

export default function ItemDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const item = items.find(i => String(i.itemId) === String(itemId));

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Item not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-lg text-blue-700 hover:text-blue-900 transition duration-150 mb-6 font-semibold"
      >
        &larr; Back to Item List
      </button>
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-pink-200">
        <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">{item.itemName}</h2>
        <p className="mb-3 text-gray-600 text-lg">From: <span className="text-pink-700">{item.shopName}</span></p>
        <span className={`py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wide border ${
          item.stockQuantity > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {item.stockQuantity > 0 ? `${item.stockQuantity} In Stock` : 'Out of Stock'}
        </span>
        <div className="mt-5">
          <p className="text-gray-500">Distance: {item.distanceKm} km</p>
          <p className="text-gray-500">Price: <span className="font-bold text-2xl text-pink-700">₹{item.price}</span></p>
        </div>
        <button
          className="mt-6 w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 shadow-lg hover:shadow-xl"
          onClick={() => {
            addToCart(item); // item has all fields, addToCart ensures quantity/price assigned
            alert("Added to cart!");
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
