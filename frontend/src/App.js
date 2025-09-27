import React, { useState, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons per category
const categoryIcons = {
  general: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  medical: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  shelter: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  supplies: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  rescue: new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

const geocodeLocation = async (locationName) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }
  return null;
};

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [location, setLocation] = useState("");
  const [logs, setLogs] = useState([]);

  // Fetch logs from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  // Submit new log
  const handleSubmit = async (e) => {
    e.preventDefault();

    const coords = await geocodeLocation(location);
    const newLog = {
      name,
      message,
      category,
      location,
      coords,
      time: new Date().toISOString(),
    };

    fetch("http://127.0.0.1:5000/log", {
      method: "POST",
      body: JSON.stringify(newLog),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        setLogs([...logs, newLog]);
        setName("");
        setMessage("");
        setCategory("general");
        setLocation("");
      })
      .catch((err) => console.error("Error submitting log:", err));
  };

  return (
    <div className="App">
      <h1>🚨 RescueNet</h1>
      <p className="subtitle">Community-powered disaster response tool</p>

      {/* Form */}
      <form className="log-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Message (e.g., Need medical help, food, or shelter)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="general">General</option>
          <option value="medical">Medical</option>
          <option value="shelter">Shelter</option>
          <option value="supplies">Supplies</option>
          <option value="rescue">Rescue</option>
        </select>
        <input
          type="text"
          placeholder="Location (city, area, or GPS)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Submit Log</button>
      </form>

      {/* Map */}
      <h2>🗺️ Map of Reports</h2>
      <MapContainer center={[33.749, -84.388]} zoom={5} className="leaflet-container" style={{ height: "400px", width: "90%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {logs.map((log, index) =>
          log.coords ? (
            <Marker
              key={index}
              position={log.coords}
              icon={categoryIcons[log.category] || categoryIcons.general}
            >
              <Popup>
                <strong>{log.name || "Anonymous"}</strong> <br />
                {log.category} – {log.message} <br />
                📍 {log.location}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* Logs List */}
      <h2>📋 Reported Logs</h2>
      <div className="logs-container">
        {logs.length === 0 ? (
          <p>No logs yet. Be the first to submit.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-card ${log.category}`}>
              <p><strong>{log.name || "Anonymous"}</strong> – <em>{log.category}</em></p>
              <p>{log.message}</p>
              {log.location && <p>📍 {log.location}</p>}
              <small>{log.time}</small>
            </div>

          ))
        )}
      </div>
    </div>
  );
}

export default App;


