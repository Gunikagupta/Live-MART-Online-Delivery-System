import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const NearbyShopsMap = () => {
  const [shops, setShops] = useState([]);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCoords([lat, lng]);

      const res = await api.get("/shops/nearby", {
        params: { lat, lng, distance: 5 },
      });

      setShops(res.data);
    });
  }, []);

  if (!coords) return <p>Loading map...</p>;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={coords}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={coords} icon={icon}>
          <Popup>You are here</Popup>
        </Marker>

        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.latitude, shop.longitude]}
            icon={icon}
          >
            <Popup>
              <strong>{shop.name}</strong>
              <br />
              {shop.address}
              <br />
              {shop.distance.toFixed(1)} km away
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NearbyShopsMap;
