import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { nashikCenter, initialSignals, emergencyRouteCoordinates } from '../data/signals';
import SignalMarker from './SignalMarker';
import EmergencyRoute from './EmergencyRoute';
import axios from 'axios';

// Fix for default marker icons in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ onSignalClick }) => {
  const [signals, setSignals] = useState(initialSignals);
  const [routeCoords, setRouteCoords] = useState(emergencyRouteCoordinates);
  const [activeEmergency, setActiveEmergency] = useState(false);
  const [backendError, setBackendError] = useState(false);

  // Poll backend for real-time traffic and route data
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const [trafficRes, routeRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/traffic-status'),
          axios.get('http://127.0.0.1:8000/api/get-route')
        ]);

        const liveSignals = trafficRes.data.signals;
        
        setSignals(prev => prev.map(sig => {
          const liveMatch = liveSignals.find(s => s.id === sig.id);
          if (liveMatch) {
            let newTimer = sig.timer - 3; // Subtract polling interval
            if (newTimer <= 0) {
                newTimer = liveMatch.status === 'green' ? 45 : liveMatch.status === 'red' ? 30 : 5;
            }
            return {
              ...sig,
              color: liveMatch.status,
              congestion: liveMatch.density,
              timer: newTimer
            };
          }
          return sig;
        }));

        setActiveEmergency(trafficRes.data.active_emergency);
        setRouteCoords(routeRes.data.route);
        setBackendError(false);
      } catch (err) {
        console.warn("Backend not reachable. Falling back to local simulation.", err.message);
        setBackendError(true);
        // Fallback local simulation
        setSignals(prevSignals => prevSignals.map(sig => {
          let newTimer = sig.timer - 3;
          let newColor = sig.color;
          if (newTimer <= 0) {
            if (sig.color === 'green') { newColor = 'yellow'; newTimer = 5; } 
            else if (sig.color === 'yellow') { newColor = 'red'; newTimer = 30 + Math.floor(Math.random() * 20); } 
            else { newColor = 'green'; newTimer = 20 + Math.floor(Math.random() * 30); }
          }
          let newCongestion = Math.max(10, Math.min(95, sig.congestion + (Math.random() > 0.5 ? 2 : -2)));
          return { ...sig, timer: newTimer, color: newColor, congestion: newCongestion };
        }));
      }
    };

    fetchRealTimeData(); // Initial fetch
    const interval = setInterval(fetchRealTimeData, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-cyan-500/30 neon-border relative z-0">
      <MapContainer 
        center={nashikCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {signals.map(signal => (
          <SignalMarker key={signal.id} signal={signal} onClick={() => onSignalClick && onSignalClick(signal.id)} />
        ))}

        <EmergencyRoute routeCoordinates={routeCoords} />
      </MapContainer>
      
      {/* Overlay UI elements */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        {backendError && (
          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 border-yellow-500/30">
            <span className="text-yellow-400 font-mono text-xs font-bold">USING LOCAL MOCK</span>
          </div>
        )}
        
        {activeEmergency ? (
          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 border-red-500/50 bg-red-500/10">
            <div className="w-3 h-3 rounded-full bg-red-500 pulse-animation"></div>
            <span className="text-white font-mono text-sm font-bold tracking-widest">EMERGENCY ACTIVE</span>
          </div>
        ) : (
          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 border-green-500/50 bg-green-500/10">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-white font-mono text-sm font-bold tracking-widest">NORMAL TRAFFIC</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
