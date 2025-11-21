import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      alert("Fill all fields first");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", { phone: formData.phone });
      setOtpSent(true);
      alert("OTP sent!");
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      let res = await axios.post("http://localhost:8080/api/auth/verify-otp", {
        phone: formData.phone,
        otp
      });
      alert(res.data);
      setOtpVerified(true);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Verify OTP first");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-10 border border-gray-200">

        {/* Logo */}
<h1 className="text-5xl font-extrabold text-center mb-1">
  <span className="text-red-600">Live</span>Mart
</h1>
<p className="text-center text-gray-600 mb-6 -mt-1">
  Online Delivery System
</p>

{/* Namaste Icon */}
<div className="flex justify-center mb-2">
  <img src="/namaste.png" alt="Namaste" className="w-20 opacity-90" />
</div>

{/* नमस्ते */}
<h2 className="text-center text-3xl font-bold mb-1">नमस्ते</h2>
<p className="text-center text-gray-600 mb-8">
  Register to get started with LiveMart
</p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Disable these after OTP is sent */}
          <fieldset disabled={otpSent} className="space-y-5">

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm"
            />

            <input
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm"
            />

            <input
              name="phone"
              placeholder="Phone Number (+91...)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm bg-white"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="RETAILER">Retailer</option>
              <option value="WHOLESALER">Wholesaler</option>
            </select>
          </fieldset>

          {/* Send OTP button */}
          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="w-full py-3 text-white text-lg rounded-xl
               bg-gradient-to-r from-red-500 to-pink-500 shadow-lg"
            >
              Send OTP
            </button>
          )}

          {/* OTP Input */}
          {otpSent && !otpVerified && (
            <div className="space-y-3">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-widest border rounded-xl shadow-sm text-xl"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="w-full py-3 text-white text-lg rounded-xl bg-green-600 shadow-md"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Final Register Button */}
          {otpVerified && (
            <button
              type="submit"
              className="w-full py-3 text-white text-lg rounded-xl
               bg-gradient-to-r from-red-500 to-pink-500 shadow-lg"
            >
              Register Account ✔
            </button>
          )}
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
