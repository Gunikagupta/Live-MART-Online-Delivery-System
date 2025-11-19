import React, { useState } from "react";
import { placeOrder } from "../api/orders";

export default function PlaceOrderForm() {
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = {
      user: { id: 8 },               // Replace with logged-in user
      orderItems: [{ item: { id: 1 }, quantity: 2 }],
      deliveryAddress,
      offlineOrder: false,
      offlineOrderDate: null
    };
    await placeOrder(order);
    alert("Order placed!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Delivery Address:</label>
      <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
      <button type="submit">Place Order</button>
    </form>
  );
}
