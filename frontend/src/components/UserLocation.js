// src/components/UserLocation.js
import React, { useState } from "react";
import axios from "axios";

export default function UserLocation() {
  const [userId, setUserId] = useState("");
  const [location, setLocation] = useState(null);
  const [msg, setMsg] = useState("");

  const fetchLocation = async (e) => {
    e.preventDefault();
    setMsg("Fetching...");
    try {
      const resp = await axios.get(`http://localhost:8080/api/location/${userId}`);
      setLocation(resp.data);
      setMsg("");
    } catch (err) {
      setMsg("No location found or error: " + (err.response?.data || err.message));
      setLocation(null);
    }
  };

  return (
    <form onSubmit={fetchLocation}>
      <input
        value={userId}
        onChange={e => setUserId(e.target.value)}
        placeholder="User ID"
      />
      <button type="submit">Get Location</button>
      <div>{msg}</div>
      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Timestamp: {location.timestamp}</p>
        </div>
      )}
    </form>
  );
}
