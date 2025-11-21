import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- MOCK DATA with itemId ---
const getNearbyItemsMock = async (lat, lng, maxDistance) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { itemId: 1, itemName: "Organic Brown Eggs", stockQuantity: 12, shopName: "Green Farm Organics", distanceKm: 1.2, price: 95 },
          { itemId: 2, itemName: "Amul Butter (500g)", stockQuantity: 45, shopName: "SuperMart Daily", distanceKm: 0.8, price: 275 },
          { itemId: 3, itemName: "Whole Wheat Bread", stockQuantity: 0, shopName: "The Bakery Junction", distanceKm: 2.5, price: 60 },
          { itemId: 4, itemName: "Basmati Rice (5kg)", stockQuantity: 8, shopName: "Kirana King", distanceKm: 3.1, price: 850 },
          { itemId: 5, itemName: "Fresh Paneer", stockQuantity: 15, shopName: "Daily Dairy", distanceKm: 1.5, price: 120 },
          { itemId: 6, itemName: "Coca Cola (2L)", stockQuantity: 100, shopName: "Beverage Depot", distanceKm: 4.2, price: 90 },
        ],
      });
    }, 800);
  });
};

const Navbar = ({ showSearch }) => (
  <nav className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex-shrink-0 flex items-center cursor-pointer">
          <Link to="/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
            GrocerGo
          </Link>
        </div>
        {showSearch && (
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <div className="w-full max-w-md relative">
              <input
                type="text"
                placeholder="Search for items..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard"
            className="text-gray-600 hover:text-pink-700 font-medium transition">Home</Link>
          <Link to="/cart"
            className="text-gray-600 hover:text-pink-700 font-medium transition">Cart</Link>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 p-0.5">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-pink-700">
              U
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const NearbyShops = () => {
  const [nearbyItems, setNearbyItems] = useState([]);
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [maxDistance, setMaxDistance] = useState(5);
  const [maxCost, setMaxCost] = useState("");
  const [minStock, setMinStock] = useState("");

  const navigate = useNavigate();

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
      setNearbyItems(
        res.data.filter(item => {
          const passStock = minStock === "" || item.stockQuantity >= parseInt(minStock);
          const passCost = maxCost === "" || item.price <= parseInt(maxCost);
          return passStock && passCost;
        })
      );
    } catch {
      setNearbyItems([]);
    }
  };

  const applyFilters = () => {
    if (!coords) return;
    setIsLoading(true);
    fetchItems(coords[0], coords[1]).then(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar showSearch={true} />

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
              className="px-8 py-3 text-lg font-semibold rounded-xl border border-pink-200 hover:border-pink-700 bg-white shadow hover:shadow-lg transition text-pink-800 no-underline"
            >← Back to Categories</Link>
          </div>
        </div>

        {/* FILTERS CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-50 p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-pink-50 opacity-50 blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10">
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-hover:text-pink-700 transition-colors">
                Max Distance (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxDistance}
                  onChange={e => setMaxDistance(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
                />
                <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">km</span>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-hover:text-pink-700 transition-colors">
                Max Cost (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxCost}
                  onChange={e => setMaxCost(e.target.value)}
                  placeholder="Any Price"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                />
                <span className="absolute right-4 top-4 text-gray-400 pointer-events-none">₹</span>
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-hover:text-pink-700 transition-colors">
                Min Stock
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={minStock}
                  onChange={e => setMinStock(e.target.value)}
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
              className="flex-1 py-4 px-6 rounded-xl text-white font-bold text-lg
                bg-gradient-to-r from-pink-900 via-red-700 to-pink-400
                shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:scale-95"
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

        {/* RESULTS GRID */}
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
                  <div
                    key={item.itemId}
                    onClick={() => navigate(`/item/${item.itemId}`)}
                    className="group bg-white rounded-3xl border border-pink-100 p-6 relative overflow-hidden shadow-sm hover:shadow-2xl hover:border-pink-300 transition-all duration-300 cursor-pointer"
                  >
                    {/* Accent top bar */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div className="bg-pink-50 h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🛍️</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${item.stockQuantity > 5 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {item.stockQuantity > 0 ? `${item.stockQuantity} In Stock` : 'Out of Stock'}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-800 mb-1 group-hover:text-pink-700 transition-colors truncate">{item.itemName}</h3>
                    <p className="text-gray-500 text-sm font-medium mb-6 flex items-center gap-1">
                      <span className="text-pink-400">@</span> {item.shopName}
                    </p>

                    <div className="flex items-end justify-between border-t border-gray-100 pt-5">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">DISTANCE</p>
                        <div className="flex items-center text-gray-700 font-bold bg-gray-50 px-3 py-1 rounded-lg text-sm">
                          📍 {item.distanceKm ? item.distanceKm.toFixed(1) : "0.0"} km
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">PRICE</p>
                        <p className="text-2xl font-extrabold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;