import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "982520762305-0hqpoq34bmctonak7jn9no4n7djd48s4.apps.googleusercontent.com";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);
      alert("Welcome " + res.data.name + " (" + res.data.role + ")");
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
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
    // Full-screen centered layout with a subtle background color
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
      {/* Login Card Container - Modern, rounded, elevated look */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign in to access your dashboard.
        </p>

        {/* Form Submission */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="********"
            />
          </div>

          {/* Login Button - Primary Call to Action */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 font-medium text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-in Provider */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="w-full">
            {/* The GoogleLogin component is placed inside a div to control its width */}
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => alert("Google login failed")}
              // You can use a shape prop for a different look if desired
              // shape="pill" 
              // theme="outline"
              size="large" // Set a large size for prominence
            />
          </div>
        </GoogleOAuthProvider>

        {/* Create Account Link */}
        <div className="mt-8 text-center text-sm">
          <p className="font-medium text-gray-600">
            New user? 
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500 ml-1 font-semibold transition duration-150 focus:outline-none"
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