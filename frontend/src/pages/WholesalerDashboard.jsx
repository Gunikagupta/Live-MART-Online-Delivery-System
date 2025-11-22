import React, { useState } from "react";

/**
 * WholesalerDashboard.jsx
 * - LiveMart themed wholesaler dashboard (matches Retailer UI)
 * - Uses uploaded logo at local path '/mnt/data/1edb0fcf-b5d5-491d-a196-c98240c7a088.png'
 */

export default function WholesalerDashboard() {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Fortune Oil 1L", price: 180, stock: 120 },
    { id: 2, name: "Aashirvaad Atta 5kg", price: 240, stock: 80 },
    { id: 3, name: "Tata Salt 1kg", price: 22, stock: 500 },
    { id: 4, name: "Surf Excel 1kg", price: 110, stock: 60 },
    { id: 5, name: "Parle-G 800g", price: 85, stock: 200 }
  ]);

  const [history, setHistory] = useState([
    { retailer: "FreshMart", date: "2025-11-22", item: "Fortune Oil 1L", quantity: 20 },
    { retailer: "City Grocery", date: "2025-11-21", item: "Aashirvaad Atta 5kg", quantity: 10 },
    { retailer: "Super Bazaar", date: "2025-11-20", item: "Tata Salt 1kg", quantity: 50 },
    { retailer: "Daily Needs", date: "2025-11-19", item: "Parle-G 800g", quantity: 30 }
  ]);

  const [searchRetailer, setSearchRetailer] = useState("");

  // helpers
  const themeButton =
    "px-3 py-1 rounded-lg text-white font-semibold bg-gradient-to-br from-pink-900 via-red-700 to-pink-500 hover:opacity-95 transition";

  // compute metrics
  const totalItems = inventory.length;
  const totalUnits = inventory.reduce((s, it) => s + it.stock, 0);
  const lowStockCount = inventory.filter(it => it.stock <= 10).length;

  // inventory handlers
  const handleInventoryChange = (id, field, value) => {
    setInventory(curr =>
      curr.map(it =>
        it.id === id ? { ...it, [field]: field === "price" ? Number(value) : Math.max(0, Number(value)) } : it
      )
    );
  };

  const addStock = (id, qty) => {
    if (qty <= 0) return;
    setInventory(curr => curr.map(it => (it.id === id ? { ...it, stock: it.stock + qty } : it)));
  };

  const updatePrice = (id, newPrice) => {
    if (newPrice < 0) return;
    setInventory(curr => curr.map(it => (it.id === id ? { ...it, price: newPrice } : it)));
  };

  // deduct stock after retailer order (used in history)
  const deductStockForOrder = (itemName, quantity) => {
    setInventory(curr =>
      curr.map(it => (it.name === itemName ? { ...it, stock: Math.max(0, it.stock - quantity) } : it))
    );
  };

  // filtered history
  const filteredOrders = history.filter(entry =>
    entry.retailer.toLowerCase().includes(searchRetailer.toLowerCase())
  );

  // Add a new fake history entry (optional helper, not shown in UI by default)
  const addHistoryEntry = entry => {
    setHistory(prev => [{ ...entry }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Using uploaded local image file path as logo */}
            <img
              src="/mnt/data/1edb0fcf-b5d5-491d-a196-c98240c7a088.png"
              alt="BazaarBari logo"
              className="w-12 h-12 object-contain rounded-md"
            />
            <div>
              <div className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-pink-900 via-red-700 to-pink-500">
                BazaarBari
              </div>
              <div className="text-xs text-gray-500">Wholesaler</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#inventory" className="text-gray-700 hover:text-pink-600">Inventory</a>
            <a href="#history" className="text-gray-700 hover:text-pink-600">History</a>
            <a href="#track" className="text-gray-700 hover:text-pink-600">Track Orders</a>

            <div className="flex items-center gap-3">
              <button className="px-3 py-2 rounded-lg border border-gray-200">Profile</button>
              <button className="px-3 py-2 rounded-lg border border-gray-200">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-pink-900 via-red-700 to-pink-500">
              Wholesaler Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage inventory, pricing, and retailer orders</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow border w-40 text-center">
              <div className="text-sm text-gray-500">Total Items</div>
              <div className="text-xl font-bold">{totalItems}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow border w-44 text-center">
              <div className="text-sm text-gray-500">Total Units</div>
              <div className="text-xl font-bold">{totalUnits}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow border w-40 text-center">
              <div className="text-sm text-gray-500">Low Stock</div>
              <div className="text-xl font-bold text-pink-600">{lowStockCount}</div>
            </div>
          </div>
        </header>

        {/* INVENTORY SECTION */}
        <section id="inventory" className="bg-white rounded-3xl shadow p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Inventory Management</h2>
            <div className="text-sm text-gray-500">Edit prices & adjust stock</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-sm text-gray-600 uppercase">
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">Price (₹)</th>
                  <th className="p-3 border">Stock</th>
                  <th className="p-3 border">Adjust Stock</th>
                </tr>
              </thead>

              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-3 border font-medium">{item.name}</td>

                    <td className="p-3 border">
                      <input
                        type="number"
                        value={item.price}
                        min="0"
                        onChange={e => updatePrice(item.id, Number(e.target.value))}
                        className="w-28 p-2 rounded-lg border border-gray-300"
                      />
                    </td>

                    <td className="p-3 border">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.stock <= 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.stock}
                        </div>
                        <div className="text-xs text-gray-500">units</div>
                      </div>
                    </td>

                    <td className="p-3 border">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="-9999"
                          defaultValue={0}
                          id={`adjust-${item.id}`}
                          className="w-28 p-2 rounded-lg border border-gray-300"
                          placeholder="+ add / - reduce"
                        />
                        <button
                          onClick={() => {
                            const el = document.getElementById(`adjust-${item.id}`);
                            const val = Number(el?.value) || 0;
                            if (val === 0) return;
                            // if negative -> reduce, else add
                            handleInventoryChange(item.id, "stock", item.stock + val);
                            if (el) el.value = 0;
                          }}
                          className={themeButton}
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Use negative to reduce stock</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* HISTORY / DEDUCT STOCK */}
        <section id="history" className="bg-white rounded-3xl shadow p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Retailer Purchase History</h2>
            <div className="text-sm text-gray-500">Mark stock as dispatched to retailers</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-sm text-gray-600 uppercase">
                  <th className="p-3 border">Retailer</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {history.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border">{entry.retailer}</td>
                    <td className="p-3 border">{entry.date}</td>
                    <td className="p-3 border">{entry.item}</td>
                    <td className="p-3 border">{entry.quantity}</td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => deductStockForOrder(entry.item, entry.quantity)}
                          className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
                        >
                          Deduct Stock
                        </button>

                        <button
                          onClick={() => {
                            // mark as dispatched in history (optimistic UI)
                            setHistory(prev => prev.map((h, i) => (i === idx ? { ...h, dispatched: true } : h)));
                          }}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                          Mark Dispatched
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* TRACK RETAILER ORDERS */}
        <section id="track" className="bg-white rounded-3xl shadow p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Track Retailer Orders</h2>
            <div className="text-sm text-gray-500">Search by retailer name</div>
          </div>

          <input
            type="text"
            placeholder="Enter retailer name to search"
            value={searchRetailer}
            onChange={e => setSearchRetailer(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          />

          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-sm text-gray-600 uppercase">
                    <th className="p-3 border">Retailer</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Item</th>
                    <th className="p-3 border">Quantity</th>
                    <th className="p-3 border">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 border">{entry.retailer}</td>
                      <td className="p-3 border">{entry.date}</td>
                      <td className="p-3 border">{entry.item}</td>
                      <td className="p-3 border">{entry.quantity}</td>
                      <td className="p-3 border">{entry.dispatched ? "Dispatched" : "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No orders found for this retailer.</p>
          )}
        </section>
      </main>
    </div>
  );
}
