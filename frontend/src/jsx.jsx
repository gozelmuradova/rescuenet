export default App;
<header>
  <h1>🚨 RescueNet</h1>
  <p className="subtitle">Community-powered disaster response tool</p>
</header>

{logs.map((log, index) => {
    if (!log.coords) return null;
    return (
      <Marker
        key={index}
        position={log.coords}
        icon={categoryIcons[log.category] || categoryIcons.general}
      >
        <Popup>
          <strong>{log.name || "Anonymous"}</strong> <br />
          🏷️ {log.category} <br />
          💬 {log.message} <br />
          📍 {log.location}
        </Popup>
      </Marker>
    );
  })}

<div className="map-legend">
  <div><span style={{background:"#757575"}}></span> General</div>
  <div><span style={{background:"#388e3c"}}></span> Medical</div>
  <div><span style={{background:"#1976d2"}}></span> Shelter</div>
  <div><span style={{background:"#fbc02d"}}></span> Supplies</div>
  <div><span style={{background:"#d32f2f"}}></span> Rescue</div>
</div>

