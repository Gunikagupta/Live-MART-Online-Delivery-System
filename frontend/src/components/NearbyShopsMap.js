import React, { useEffect, useState } from "react";
import { getNearbyItems } from "../api/apiClient"; // Use the named import
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
    // Renamed shops to nearbyItems (same reasoning as above)
  const [nearbyItems, setNearbyItems] = useState([]); 
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCoords([lat, lng]);

      // --- UPDATED FETCH CALL ---
      // Use the new function and parameters (userLat, userLon, radiusKm)
      const res = await getNearbyItems(lat, lng, 5); 

      setNearbyItems(res.data);
    });
  }, []);

  if (!coords) return <p>Loading map...</p>;

    // To prevent duplicate markers for the same shop, we need to extract unique shop locations
    const uniqueShops = nearbyItems.reduce((acc, item) => {
        if (!acc.find(s => s.shopName === item.shopName)) {
            acc.push({
                name: item.shopName,
                latitude: item.latitude,
                longitude: item.longitude,
                distanceKm: item.distanceKm
            });
        }
        return acc;
    }, []);

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

        {uniqueShops.map((shop, index) => (
          <Marker
            key={index}
            position={[shop.latitude, shop.longitude]}
            icon={icon}
          >
            <Popup>
              <strong>{shop.name}</strong>
              <br />
              {shop.distanceKm.toFixed(1)} km away
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NearbyShopsMap;