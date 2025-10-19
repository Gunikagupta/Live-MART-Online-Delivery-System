import React, { useState } from "react";
import axios from "axios";

function OtpRegister() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", { phone });
      alert("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert("Error sending OTP. Check server logs.");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", { phone, otp });
      alert("OTP verified successfully!");
      setVerified(true);
    } catch (err) {
      alert("Invalid or expired OTP");
    }
  };

  return (
    <div className="otp-container">
      <h2>Phone Verification (OTP)</h2>
      <input
        type="text"
        placeholder="Enter your phone e.g. +911234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {!otpSent ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
      {verified && <p>✅ OTP verified successfully!</p>}
    </div>
  );
}

export default OtpRegister;
