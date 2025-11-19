// src/pages/NearbyShopsMap.jsx
import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const NearbyShopsMap = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get("/shops/nearby");
      setShops(res.data);
    } catch (err) {
      console.error("Map fetch error:", err);
    }
  };

  return (
    <div className="p-4 fade-in">
      <h1 className="text-2xl font-bold mb-4">Nearby Shops - Map View</h1>

      <MapContainer
        center={[19.0760, 72.8777]} // Default Mumbai
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {shops.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lon]}>
            <Popup>
              <b>{s.name}</b><br />
              Distance: {s.distance} km<br />
              Avg Cost: ₹{s.avgItemPrice}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NearbyShopsMap;
