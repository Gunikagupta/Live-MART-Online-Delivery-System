import React from "react";
import Checkout from "./Checkout";
import { useCart } from "../CartContext";

export default function CheckoutWrapper() {
  const { cart } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div className="p-8 text-red-600">Please login first.</div>;
  }

  if (!cart || cart.length === 0) {
    return <div className="p-8">Your cart is empty.</div>;
  }

  return <Checkout cart={cart} user={user} />;
}
