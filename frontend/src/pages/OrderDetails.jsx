// frontend/src/components/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";

function StatusTimeline({ status }) {
  const steps = ["CREATED","PACKED","DISPATCHED","OUT_FOR_DELIVERY","DELIVERED"];
  return (
    <div className="flex items-center gap-4">
      {steps.map(s => {
        const done = steps.indexOf(s) <= steps.indexOf(status);
        return (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{done ? "✓" : steps.indexOf(s)+1}</div>
            <div className={`text-sm ${done ? 'text-gray-800' : 'text-gray-400'}`}>{s.replace(/_/g," ")}</div>
          </div>
        )
      })}
    </div>
  );
}

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/api/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
  }, [orderId]);

  if (!order) return <div className="p-8">Loading...</div>;

  const downloadIcs = () => {
    // create a simple .ics file for scheduled orders
    const start = new Date(order.scheduledAt || order.createdAt);
    const end = new Date(start.getTime() + 30*60*1000); // 30 minutes
    const pad = n => (n<10?`0${n}`:n);
    const formatICS = d => `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//LiveMart//EN",
      "BEGIN:VEVENT",
      `UID:order-${order.id}@livemart`,
      `DTSTAMP:${formatICS(new Date())}`,
      `DTSTART:${formatICS(start)}`,
      `DTEND:${formatICS(end)}`,
      `SUMMARY:LiveMart - Order #${order.id}`,
      `DESCRIPTION:Delivery for order ${order.id}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livemart-order-${order.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">Order #{order.id}</h3>
            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">₹{order.total}</div>
            <div className="text-sm text-gray-600">{order.paymentMethod}</div>
          </div>
        </div>

        <div className="mt-6">
          <StatusTimeline status={order.status} />
        </div>

        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold">Items</h4>
          <ul className="mt-2">
            {order.items.map(it => (
              <li key={it.itemId} className="flex justify-between py-2">
                <div>{it.name} x{it.qty}</div>
                <div>₹{it.price * it.qty}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          {order.scheduledAt && (
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={downloadIcs}>
              Add to calendar
            </button>
          )}
          <a
            className="px-4 py-2 border rounded"
            href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`LiveMart Order #${order.id}`)}&dates=${encodeURIComponent(new Date(order.scheduledAt || order.createdAt).toISOString())}/${encodeURIComponent(new Date(order.scheduledAt || order.createdAt).toISOString())}`}
            target="_blank" rel="noreferrer"
          >
            Add to Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
