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
        await axios.post("http://localhost:8080/api/auth/send-otp", {
          phone: formData.phone,
        });
        setOtpSent(true);
        alert("OTP sent!");
      } catch {
        alert("Error sending OTP");
      }
    };

    const verifyOtp = async () => {
      try {
        let res = await axios.post("http://localhost:8080/api/auth/verify-otp", {
          phone: formData.phone,
          otp,
        });
        alert(res.data);
        setOtpVerified(true);
      } catch {
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
      } catch {
        alert("Registration failed");
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center py-12 px-6">
        <div className="bg-white rounded-3xl shadow-xl border border-pink-50 max-w-md w-full p-10 relative overflow-hidden">
          {/* Soft Pink Accent Circle */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-pink-50 opacity-50 blur-3xl pointer-events-none"></div>

          {/* Logo and Heading */}
          <h1 className="text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent select-none">
            BazzarBari
          </h1>
          <h1 className="text-3xl font-extrabold mb-6 text-center bg-black bg-clip-text text-transparent select-none">
    Register
  </h1>


          {/* Namaste Image */}
          <div className="flex justify-center mb-6">
            <img src="/namaste.jpg" alt="Namaste" className="w-24 opacity-90" />
          </div>

          <h2 className="text-center text-3xl font-bold mb-1 select-none">नमस्ते</h2>
          <p className="text-center text-gray-600 mb-8">
            Register to get started with BazzarBari
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6 z-10 relative">
            {/* Disable inputs after OTP is sent */}
            <fieldset disabled={otpSent} className="space-y-5">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                required
              />
              <input
                name="phone"
                placeholder="Phone Number (+91...)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="RETAILER">Retailer</option>
                <option value="WHOLESALER">Wholesaler</option>
              </select>
            </fieldset>

            {/* Send OTP Button */}
            {!otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                className="w-full py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 shadow-lg hover:shadow-xl transition"
              >
                Send OTP
              </button>
            )}

            {/* OTP Input and Verify Button */}
            {otpSent && !otpVerified && (
              <div className="space-y-4">
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-center tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full py-4 rounded-2xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* Register Button */}
            {otpVerified && (
              <button
                type="submit"
                className="w-full py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 shadow-lg hover:shadow-xl transition"
              >
                Register Account ✔
              </button>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  export default Register;
