import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext"; // Import your cart context

// -- Mock data -- (replace with API as needed)
const getNearbyItemsMock = async (lat, lng, maxDistance) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 1, itemName: "Organic Brown Eggs", stockQuantity: 12, shopName: "Green Farm Organics", distanceKm: 1.2, price: 95 },
          { id: 2, itemName: "Amul Butter (500g)", stockQuantity: 45, shopName: "SuperMart Daily", distanceKm: 0.8, price: 275 },
          { id: 3, itemName: "Whole Wheat Bread", stockQuantity: 0, shopName: "The Bakery Junction", distanceKm: 2.5, price: 60 },
          { id: 4, itemName: "Basmati Rice (5kg)", stockQuantity: 8, shopName: "Kirana King", distanceKm: 3.1, price: 850 },
          { id: 5, itemName: "Fresh Paneer", stockQuantity: 15, shopName: "Daily Dairy", distanceKm: 1.5, price: 120 },
          { id: 6, itemName: "Coca Cola (2L)", stockQuantity: 100, shopName: "Beverage Depot", distanceKm: 4.2, price: 90 },
        ],
      });
    }, 800);
  });
};

export default function NearbyShops() {
  const [open, setOpen] = useState(false); // For Account dropdown
  const [nearbyItems, setNearbyItems] = useState([]);
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [maxDistance, setMaxDistance] = useState(5);
  const [maxCost, setMaxCost] = useState("");
  const [minStock, setMinStock] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords([lat, lng]);
          await fetchItems(lat, lng);
          setIsLoading(false);
        },
        () => {
          const defaultLat = 19.05;
          const defaultLon = 72.85;
          setCoords([defaultLat, defaultLon]);
          fetchItems(defaultLat, defaultLon);
          setIsLoading(false);
        }
      );
    } else {
      const defaultLat = 19.05;
      const defaultLon = 72.85;
      setCoords([defaultLat, defaultLon]);
      fetchItems(defaultLat, defaultLon);
      setIsLoading(false);
    }
  }, []);

  const fetchItems = async (lat, lng) => {
    try {
      const res = await getNearbyItemsMock(lat, lng, maxDistance);
      setNearbyItems(res.data);
    } catch (error) {
      console.error("Error fetching nearby items:", error);
    }
  };

  const applyFilters = () => {
    if (!coords) return;
    setIsLoading(true);
    fetchItems(coords[0], coords[1]).then(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- LIVEMART NAVBAR, inline and identical to CategoryGrid! --- */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-pink-100">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 py-4 grid grid-cols-3 items-center">
          {/* LEFT – LOGO + TEXT */}
<div
  className="flex items-center gap-3 cursor-pointer select-none"
  onClick={() => navigate("/")}
><img
  src="/bazarbari.jpg"
  alt="BazaarBari Logo"
  className="w-10 h-10 object-contain"
/>

  <span
    className="text-3xl font-extrabold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 
               bg-clip-text text-transparent tracking-tight"
  >
    BazaarBari
  </span>
</div>

          {/* CENTER – SEARCH BAR */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search for items, shops, categories..."
              className="w-full max-w-xl border border-pink-200 rounded-full px-6 py-3
                shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>
          {/* RIGHT – MENU */}
          <div className="flex justify-end items-center gap-8 text-gray-700 font-semibold text-lg">
            <button onClick={() => navigate("/")} className="hover:text-pink-600 transition" aria-label="Categories">
              Categories
            </button>
            <button onClick={() => navigate("/orders")} className="hover:text-pink-600 transition" aria-label="Orders">
              Orders
            </button>
            <button onClick={() => navigate("/feedback")} className="hover:text-pink-600 transition" aria-label="Feedback">
              Feedback
            </button>
            {/* ACCOUNT DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r
                  from-pink-600 to-pink-500 text-white rounded-full shadow
                  hover:opacity-90 transition select-none"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A8 8 0 1118.878 6.196 8 8 0 015.12 17.804z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account
              </button>
              {open && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-pink-200 rounded-xl py-2 z-50"
                  role="menu"
                >
                  <button
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                    role="menuitem"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                    role="menuitem"
                  >
                    Register
                  </button>
                  <hr className="my-2 border-pink-100" />
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("cart");
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* --- END NAVBAR --- */}

      {/* PAGE CONTENT */}
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
              Nearby Items & Shops
            </span>
          </h1>
          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-3 text-lg font-semibold rounded-xl border border-pink-200 hover:border-pink-700 bg-white shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent select-none"
            >
              ← Back to Categories
            </Link>
          </div>
        </div>

        {/* FILTERS CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-50 p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-pink-50 opacity-50 blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10">
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-hover:text-pink-700 transition-colors">Max Distance (km)</label>
              <div className="relative">
                <input
                  type="number"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
                />
                <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">km</span>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-hover:text-pink-700 transition-colors">Max Cost (₹)</label>
              <div className="relative">
                <input
                  type="number"
                  value={maxCost}
                  onChange={(e) => setMaxCost(e.target.value)}
                  placeholder="Any Price"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                />
                <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">₹</span>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-hover:text-pink-700 transition-colors">Min Stock</label>
              <div className="relative">
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  placeholder="Any Amount"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                />
                <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">Qty</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 relative z-10">
            <button
              onClick={applyFilters}
              className="flex-1 py-4 px-6 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:scale-95"
            >
              Apply Filters
            </button>
            <button
              onClick={() => navigate("/shops/map")}
              className="flex-1 py-4 px-6 rounded-xl font-bold text-lg border border-pink-200 text-gray-700 bg-white hover:border-pink-400 hover:text-pink-800 shadow-sm flex items-center justify-center gap-2"
            >
              <span className="text-2xl">🗺️</span> View on Map
            </button>
          </div>
        </div>

        {/* GRID OF RESULTS */}
        {(isLoading || !coords) ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-700"></div>
            <div className="text-2xl font-bold text-gray-400 animate-pulse">Finding best deals nearby...</div>
          </div>
        ) : (
          <div>
            {nearbyItems.length === 0 ? (
              <div className="text-center py-20 px-6 bg-white rounded-3xl border-2 border-dashed border-pink-200">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found nearby</h3>
                <p className="text-gray-500">Try increasing the distance.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nearbyItems.map((item) => (
                  <div key={item.id} className="group bg-white rounded-3xl border border-pink-100 p-6 relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-pink-300 transition-all duration-300 cursor-pointer">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div className="bg-pink-50 h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🛍️</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${item.stockQuantity > 5 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {item.stockQuantity > 0 ? `${item.stockQuantity} In Stock` : 'Out of Stock'}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-800 mb-1 group-hover:text-pink-700 transition-colors truncate">{item.itemName}</h3>
                    <p className="text-gray-500 text-sm font-medium mb-6 flex items-center gap-1"><span className="text-pink-400">@</span> {item.shopName}</p>
                    <div className="flex items-end justify-between border-t border-gray-100 pt-5">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">DISTANCE</p>
                        <div className="flex items-center text-gray-700 font-bold bg-gray-50 px-3 py-1 rounded-lg text-sm">📍 {item.distanceKm ? item.distanceKm.toFixed(1) : "0.0"} km</div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">PRICE</p>
                        <p className="text-2xl font-extrabold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">₹{item.price}</p>
                      </div>
                    </div>
                    {item.stockQuantity > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: item.id,
                            name: item.itemName,
                            price: item.price,
                          }, 1);
                        }}
                        className="mt-4 w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-700 via-red-600 to-pink-400 hover:shadow-xl transition"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
