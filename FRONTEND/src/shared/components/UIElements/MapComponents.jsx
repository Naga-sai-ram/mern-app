// MapComponent.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './Map.css';
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords);
  }, [coords, map]);
  return null;
};

const MapComponent = ({ coords, name }) => {
  const position = coords || [40.748817, -73.985428]; // Default
  return (
    <div className="map-container">
      <MapContainer
        center={position}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <RecenterMap coords={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {name || "Selected Location"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
