import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Four demo shops in Mumbai with name/location/distance
const shops = [
  { id: 1, name: "Green Farm Organics", lat: 19.0728, lon: 72.8826, distance: 1.2 },
  { id: 2, name: "SuperMart Daily", lat: 19.0840, lon: 72.8467, distance: 2.1 },
  { id: 3, name: "The Bakery Junction", lat: 19.0601, lon: 72.8375, distance: 3.6 },
  { id: 4, name: "Kirana King", lat: 19.0750, lon: 72.8777, distance: 0.9 }
];

export default function NearbyShopsMap() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Back to Categories link at the top */}
      <div className="mb-8 flex justify-center">
        <Link
          to="/categories"
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 text-white shadow hover:scale-105 transition"
        >
          ← Back to Categories
        </Link>
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 bg-clip-text text-transparent mb-6">
        Nearby Shops Map View
      </h1>
      <div className="w-full max-w-3xl h-[500px] mb-8 bg-white rounded-3xl shadow-lg border border-pink-200 overflow-hidden">
        <MapContainer
          center={[19.0760, 72.8777]} // Mumbai center
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {shops.map(shop => (
            <Marker key={shop.id} position={[shop.lat, shop.lon]}>
              <Popup>
                <b>{shop.name}</b><br />
                Distance: {shop.distance} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Link
        to="/shops/nearby"
        className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-900 via-red-700 to-pink-400 text-white shadow hover:scale-105 transition"
      >
        ← Back to Nearby Shops
      </Link>
    </div>
  );
}