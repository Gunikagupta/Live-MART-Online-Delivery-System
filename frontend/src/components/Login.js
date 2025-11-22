import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "321735826118-g4q03b6vsi1eoj7aeg97qcftj2dj44j7.apps.googleusercontent.com";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const routeUser = (role) => {
    const r = role.toLowerCase();

    if (r === "wholesaler" || r === "wholeseller") {
      navigate("/wholeseller");
    } else if (r === "retailer") {
      navigate("/retailer-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginAndRoute = async (payload) => {
      const res = await axios.post("http://localhost:8080/api/auth/login", payload);
      alert("Welcome " + res.data.name + " (" + res.data.role + ")");
      localStorage.setItem("user", JSON.stringify(res.data));
      routeUser(res.data.role);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await loginAndRoute({
              ...formData,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          } catch {
            alert("Invalid email or password");
          }
        },
        async () => {
          try {
            await loginAndRoute(formData);
          } catch {
            alert("Invalid email or password");
          }
        }
      );
    } else {
      try {
        await loginAndRoute(formData);
      } catch {
        alert("Invalid email or password");
      }
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      if (!response.credential) {
        alert("Google login failed: missing credential");
        return;
      }

      const res = await axios.post("http://localhost:8080/api/auth/google-login", {
        token: response.credential,
      });

      alert("Logged in with Google!");
      localStorage.setItem("user", JSON.stringify(res.data));

      routeUser(res.data.role);
    } catch (error) {
      alert("Google login failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-200 transition duration-300 hover:shadow-purple-300">

        {/* Brand Title */}
        <div className="flex flex-col items-center mb-6 select-none">
          <span className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-pink-900 via-red-700 to-pink-500 drop-shadow-md">
            BazzarBari
          </span>
          <span className="mt-2 text-lg text-gray-600 font-semibold">Online Delivery System</span>

          <img
            src="namaste.jpg"
            alt="Namaste"
            className="w-40 h-40 object-contain mt-6 mb-1"
            style={{ maxWidth: "200px" }}
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-3">नमस्ते</h1>
        <p className="text-center text-gray-500 mb-10">Sign in to access your dashboard.</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="********"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-br from-pink-900 via-red-700 to-pink-500"
          >
            Login
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 font-semibold text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => alert("Google login failed")}
              size="large"
            />
          </div>
        </GoogleOAuthProvider>

        {/* Register Link */}
        <div className="mt-10 text-center text-sm">
          <p className="font-medium text-gray-600">
            New user?{" "}
            <Link to="/register" className="text-pink-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
  