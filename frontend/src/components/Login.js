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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const payload = {
              ...formData,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            const res = await axios.post("http://localhost:8080/api/auth/login", payload);
            alert("Welcome " + res.data.name + " (" + res.data.role + ")");
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/dashboard");
          } catch (err) {
            alert("Invalid email or password");
          }
        },
        async (error) => {
          // User denied location
          try {
            const res = await axios.post("http://localhost:8080/api/auth/login", formData);
            alert("Welcome " + res.data.name + " (" + res.data.role + ")");
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/dashboard");
          } catch (err) {
            alert("Invalid email or password");
          }
        }
      );
    } else {
      try {
        const res = await axios.post("http://localhost:8080/api/auth/login", formData);
        alert("Welcome " + res.data.name + " (" + res.data.role + ")");
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/dashboard");
      } catch (err) {
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
      navigate("/dashboard");
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
          <span className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-pink-900 via-red-700 to-pink-500 drop-shadow-md cursor-default">
            LiveMart
          </span>
          <span className="mt-2 text-lg text-gray-600 font-semibold cursor-default">
            Online Delivery System
          </span>
          <img
            src="namaste.jpg"
            alt="Namaste"
            className="w-40 h-40 object-contain mt-6 mb-1"
            style={{ maxWidth: "200px" }}
          />
        </div>

        {/* Sign In Heading */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-3">नमस्ते</h1>

        <p className="text-center text-gray-500 mb-10">Sign in to access your dashboard.</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition duration-200"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition duration-200"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-br from-pink-900 via-red-700 to-pink-500 hover:from-pink-800 hover:via-red-600 hover:to-pink-400 focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-pink-700 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 font-semibold text-sm select-none">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google OAuth */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => alert("Google login failed")}
              size="large"
            />
          </div>
        </GoogleOAuthProvider>

        {/* Create Account Link */}
        <div className="mt-10 text-center text-sm">
          <p className="font-medium text-gray-600">
            New user?{" "}
            <Link
              to="/register"
              className="bg-gradient-to-br from-pink-900 via-red-700 to-pink-500 bg-clip-text text-transparent font-semibold transition duration-150 focus:outline-none hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
