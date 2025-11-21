import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));

    if (!u) {
      navigate("/");   // redirect if not logged in
      return;
    }
    setUser(u);
  }, [navigate]);

  const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  navigate("/");   // Correct route
};


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        <h2 className="text-3xl font-bold text-center mb-4">
          Your Profile
        </h2>

        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto text-3xl font-bold text-indigo-700">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="mt-6 space-y-3">
          <div className="p-3 border rounded-lg">
            <label className="text-sm text-gray-500">Name</label>
            <div className="text-lg font-semibold">{user.name}</div>
          </div>

          <div className="p-3 border rounded-lg">
            <label className="text-sm text-gray-500">Email</label>
            <div className="text-lg font-semibold">{user.email}</div>
          </div>

          <div className="p-3 border rounded-lg">
            <label className="text-sm text-gray-500">Phone</label>
            <div className="text-lg font-semibold">{user.phone}</div>
          </div>

          <div className="p-3 border rounded-lg">
            <label className="text-sm text-gray-500">Role</label>
            <div className="text-lg font-semibold">{user.role}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md"
        >
          Sign Out
        </button>

      </div>
    </div>
  );
}
