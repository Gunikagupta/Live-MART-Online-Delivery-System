import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      navigate("/");
    } catch (error) {
      alert("Registration failed. Check backend or DB connection.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone number (with +country code)"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="CUSTOMER">Customer</option>
          <option value="RETAILER">Retailer</option>
          <option value="WHOLESALER">Wholesaler</option>
        </select>

        {!otpSent ? (
          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
        ) : !otpVerified ? (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        ) : (
          <button type="submit">Register</button>
        )},
      </form>
      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
}

export default Register;
