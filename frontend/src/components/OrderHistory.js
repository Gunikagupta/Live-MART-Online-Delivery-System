import React, { useEffect, useState } from "react";
import { getOrdersByUser, updateOrderStatus } from "../api/orders";

const USER_ID = 8; // Replace by actual logged-in user ID

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrdersByUser(USER_ID).then(setOrders);
  }, []);

  const handleStatusUpdate = (id, status) => {
    updateOrderStatus(id, status).then(updated => {
      setOrders(orders.map(o => o.id === id ? updated : o));
    });
  };

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            Address: {order.delivery_address} | Status: {order.status}
            {order.status !== "DELIVERED" && (
              <button onClick={() => handleStatusUpdate(order.id, "DELIVERED")}>
                Mark as Delivered
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
