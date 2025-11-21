import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link for 'Login here'

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    // Basic validation before sending OTP
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        alert("Please fill in all required fields first.");
        return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", {
        phone: formData.phone,
      });
      setOtpSent(true);
      alert("OTP sent to your phone!");
    } catch (error) {
      alert("Error while sending OTP. Check backend.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/verify-otp", {
        phone: formData.phone,
        otp: otp,
      });
      alert(res.data);
      setOtpVerified(true);
    } catch (error) {
      alert("Invalid or expired OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify your OTP before registering");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", formData);
      alert(res.data);
      navigate("/dashboard"); // Navigate to login page after successful registration
    } catch (error) {
      alert("Registration failed. Check backend or DB connection.");
    }
  };

  // --- UI RENDERING ---
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-200">
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {otpSent 
            ? otpVerified ? "Verification complete. Ready to finalize!" : "Enter the OTP sent to your phone."
            : "Fill in your details and verify your phone number."
          }
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Fields (Disabled after OTP is sent) */}
          <fieldset disabled={otpSent} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            {/* Email & Password (Left out for brevity but keep original structure if needed) */}
             <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>
            </div>
            
            {/* Phone and Role */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (+Country Code)</label>
                <input
                  name="phone" type="tel" placeholder="+91-1234567890" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="w-1/4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role" value={formData.role} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="RETAILER">Retailer</option>
                  <option value="WHOLESALER">Wholesaler</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* DYNAMIC BUTTONS BASED ON STATE */}
          
          {/* 1. Initial State: Send OTP Button */}
          {!otpSent && (
            <button type="button" onClick={sendOtp} className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200">
              Send OTP & Continue
            </button>
          )}

          {/* 2. OTP Sent State: Input & Verify Button */}
          {otpSent && !otpVerified && (
            <div className="flex space-x-4 items-end pt-2">
              <div className="flex-1">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  id="otp" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 text-xl text-center tracking-widest"
                />
              </div>
              <button type="button" onClick={verifyOtp} className="w-1/3 py-3 px-4 rounded-lg shadow-md text-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition duration-200">
                Verify
              </button>
            </div>
          )}

          {/* 3. OTP Verified State: Final Register Button */}
          {otpVerified && (
            <button type="submit" className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200">
              Register Account
              <span className="ml-2">✅</span>
            </button>
          )}
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center text-sm">
          <p className="font-medium text-gray-600">
            Already have an account? 
            <Link
              to="/login" // Use Link for navigation
              className="text-indigo-600 hover:text-indigo-500 ml-1 font-semibold transition duration-150 focus:outline-none"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;