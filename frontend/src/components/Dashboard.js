import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  let user = null;
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      user = JSON.parse(userString);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
  }

  const navigate = useNavigate();
  const userId = user ? user.id : '1';

  // --- Utility Function (Placeholder for Logout) ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-800 to-pink-500 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Logout Button */}
        <div className="flex justify-between items-center border-b border-pink-700 pb-4 mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 drop-shadow-lg select-none">
            Welcome to LiveMART
          </h1>
          <button
            onClick={handleLogout}
            className="text-white bg-gradient-to-r from-pink-900 via-red-700 to-pink-500 hover:from-pink-800 hover:via-red-600 hover:to-pink-400 py-2 px-5 rounded-lg font-semibold shadow-md transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* User Greeting Section */}
        {user ? (
          <div className="bg-white/80 p-6 rounded-xl shadow-lg border border-pink-200 mb-10">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-red-700 to-pink-500">
              Hello, {user.name}! 👋
            </h2>
            <p className="text-lg font-medium mt-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-red-700 to-pink-400">
              Your Role: <span className="uppercase">{user.role}</span>
            </p>
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-10" role="alert">
            <p className="font-bold">Session Error</p>
            <p>User data could not be loaded. Please log in again.</p>
          </div>
        )}

        {/* RETAILER PROXY SECTION */}
        {user && user.role === "RETAILER" && (
          <div className="mb-10 bg-pink-50 border-l-4 border-pink-600 p-8 rounded-xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 mb-2">
                  Wholesaler Network Items
                </h2>
                <p className="text-pink-700 text-lg">
                  Access items available via your partnered wholesaler (Proxy Items).
                </p>
              </div>
              <Link
                to={`/retailer/${userId}/proxy-items`}
                className="
                  bg-gradient-to-r from-pink-900 via-red-700 to-pink-500
                  hover:from-pink-800 hover:via-red-600 hover:to-pink-400
                  text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-200 whitespace-nowrap"
              >
                View Proxy Items
              </Link>
            </div>
          </div>
        )}
        
        {/* Quick Links Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Example Link to Categories */}
            <Link to="/categories"
              className="block bg-white/90 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 border border-pink-200 hover:border-pink-700"
            >
              <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-red-700 to-pink-400">Shop Products</h4>
              <p className="text-gray-500 mt-1">Browse items by category.</p>
            </Link>
            
            {/* Example Link for Orders */}
            <Link to="/orders"
              className="block bg-white/90 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-200 border border-pink-200 hover:border-pink-700"
            >
              <h4 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-900 via-red-700 to-pink-400">Manage Orders</h4>
              <p className="text-gray-500 mt-1">View history and track shipments.</p>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
