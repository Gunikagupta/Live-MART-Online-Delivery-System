import React, { useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const centerDefault = {
  lat: 28.6139,  // Default to New Delhi
  lng: 77.209
};

function LocationMap() {
  const [center, setCenter] = useState(centerDefault);
  const [markerPosition, setMarkerPosition] = useState(centerDefault);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY"
  });

  const onMapClick = useCallback((event) => {
    const newPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarkerPosition(newPos);
    setCenter(newPos);
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userPos);
          setMarkerPosition(userPos);
        },
        () => alert("Error getting your location")
      );
    } else {
      alert("Geolocation not supported by your browser");
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <button onClick={getUserLocation}>Get My Location</button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onClick={onMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </div>
  );
}

export default React.memo(LocationMap);
