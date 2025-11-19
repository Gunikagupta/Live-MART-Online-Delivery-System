import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Import necessary modules

function Dashboard() {
  // Use try/catch for robust local storage parsing
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
  // Use a placeholder ID for navigation if the user object is missing, 
  // though in a real app, this should only execute if 'user' is valid.
  const userId = user ? user.id : '1'; 

  // --- Utility Function (Placeholder for Logout) ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    // Optionally remove any tokens/credentials
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header and Logout Button */}
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome to LiveMART
          </h1>
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 py-2 px-5 rounded-lg font-semibold shadow-md transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* User Greeting Section */}
        {user ? (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              Hello, {user.name}! 👋
            </h2>
            <p className="text-lg text-indigo-600 font-medium mt-1">
              Your Role: <span className="uppercase">{user.role}</span>
            </p>
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-10" role="alert">
            <p className="font-bold">Session Error</p>
            <p>User data could not be loaded. Please log in again.</p>
          </div>
        )}

        {/* --- 🔑 RETAILER PROXY SECTION (Requirement) --- */}
        {user && user.role === "RETAILER" && (
          <div className="mb-10 bg-indigo-50 border-l-4 border-indigo-600 p-8 rounded-xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-2">
                  Wholesaler Network Items
                </h2>
                <p className="text-indigo-700 text-lg">
                  Access items available via your partnered wholesaler (Proxy Items).
                </p>
              </div>
              
              <Link
                to={`/retailer/${userId}/proxy-items`}
                className="
                  bg-indigo-600 
                  hover:bg-indigo-700 
                  text-white 
                  font-bold 
                  py-3 px-6 
                  rounded-xl 
                  shadow-lg 
                  transition duration-200 
                  whitespace-nowrap
                "
              >
                View Proxy Items
              </Link>
            </div>
          </div>
        )}
        
        {/* General Content Section (e.g., links to Categories, Orders, etc.) */}
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Example Link to Categories */}
                <Link to="/categories" className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 border border-blue-100 hover:border-blue-400">
                    <h4 className="text-xl font-semibold text-blue-600">Shop Products</h4>
                    <p className="text-gray-500 mt-1">Browse items by category.</p>
                </Link>
                
                {/* Example Link for Orders */}
                <Link to="/orders" className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 border border-green-100 hover:border-green-400">
                    <h4 className="text-xl font-semibold text-green-600">Manage Orders</h4>
                    <p className="text-gray-500 mt-1">View history and track shipments.</p>
                </Link>

            </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;