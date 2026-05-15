import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { nashikCenter, initialSignals, emergencyRouteCoordinates } from '../data/signals';
import SignalMarker from './SignalMarker';
import EmergencyRoute from './EmergencyRoute';
import axios from 'axios';
import { Maximize, Minimize, Navigation, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';

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

const MapView = ({ onSignalClick, activeNode, emergencyTriggered, weatherState: parentWeatherState = 'CLEAR' }) => {
  const [signals, setSignals] = useState(initialSignals);
  const [routeCoords, setRouteCoords] = useState(emergencyRouteCoordinates);
  const [activeEmergency, setActiveEmergency] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveWeather, setLiveWeather] = useState(parentWeatherState);
  const { telemetry, connected } = useWebSocket();
  
  // Dispatch Simulator State
  const [simulatorMode, setSimulatorMode] = useState(false);
  const [roadblockMode, setRoadblockMode] = useState(false);
  const [dispatchStart, setDispatchStart] = useState(null);
  const [dispatchEnd, setDispatchEnd] = useState(null);
  const [roadblocks, setRoadblocks] = useState([]);

  // Map Click Handler Component
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!simulatorMode) return;
        const { lat, lng } = e.latlng;
        if (!dispatchStart) {
          setDispatchStart([lat, lng]);
        } else if (!dispatchEnd) {
          setDispatchEnd([lat, lng]);
          calculateDispatchRoute([dispatchStart[0], dispatchStart[1]], [lat, lng]);
        } else {
          // Reset
          setDispatchStart([lat, lng]);
          setDispatchEnd(null);
          setRouteCoords([]);
        }
      },
    });
    return null;
  };

  const calculateDispatchRoute = async (start, end) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/calculate-route', {
        start_lat: start[0],
        start_lng: start[1],
        end_lat: end[0],
        end_lng: end[1]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setRouteCoords(res.data.route);
      setActiveEmergency(true);
    } catch (err) {
      console.error("Failed to calculate route", err);
      // Fallback pseudo-manhattan
      setRouteCoords([
        start,
        [start[0] + (end[0] - start[0]) / 2, start[1]],
        [start[0] + (end[0] - start[0]) / 2, end[1]],
        end
      ]);
      setActiveEmergency(true);
    }
  };

  // Fetch real weather data from Open-Meteo (Nashik Coordinates)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=19.9975&longitude=73.7898&current=precipitation,weather_code');
        const code = res.data.current.weather_code;
        // WMO Weather interpretation codes (Rain/Drizzle: 51-67, 80-82, Thunderstorm: 95-99)
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 99)) {
          setLiveWeather('RAIN');
        } else if (code === 45 || code === 48) {
          setLiveWeather('FOG');
        } else {
          setLiveWeather('CLEAR');
        }
      } catch (err) {
        console.error("Failed to fetch live weather", err);
      }
    };
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000); // 5 mins
    return () => clearInterval(weatherInterval);
  }, []);

  // WebSocket Real-time Telemetry updates
  useEffect(() => {
    if (telemetry && telemetry.signals) {
      setBackendError(false);
      setSignals(prev => prev.map(sig => {
        const liveMatch = telemetry.signals.find(s => s.id === sig.id);
        if (liveMatch) {
          let newTimer = sig.timer - 2; // Subtract approx WS interval
          if (newTimer <= 0) {
              newTimer = sig.color === 'green' ? 45 : sig.color === 'red' ? 30 : 5;
          }
          return {
            ...sig,
            congestion: liveMatch.density,
            timer: newTimer
          };
        }
        return sig;
      }));
      // Only let WS trigger emergency if we aren't manually simulating one
      if (!simulatorMode && !dispatchEnd) {
        setActiveEmergency(telemetry.active_emergency);
      }
    }
  }, [telemetry]);

  // Fallback Polling if WebSocket is disconnected
  useEffect(() => {
    if (connected) return; // Don't poll if WS is connected

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
            let newTimer = sig.timer - 3;
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

        if (!simulatorMode && !dispatchEnd) {
          setActiveEmergency(trafficRes.data.active_emergency);
        }
        if (!simulatorMode) {
          setRouteCoords(routeRes.data.route);
        }
        setBackendError(false);
      } catch (err) {
        console.warn("Backend not reachable. Falling back to local simulation.");
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
  }, [connected, simulatorMode, dispatchEnd]);

  // EVPS Override
  useEffect(() => {
    if (emergencyTriggered) {
      setSignals(prev => prev.map(sig => ({
        ...sig,
        color: 'green',
        timer: 99
      })));
    }
  }, [emergencyTriggered]);

  return (
    <div className={
      isFullscreen 
        ? "fixed inset-0 z-[1000] bg-black" 
        : "w-full h-full rounded-2xl overflow-hidden border border-cyan-500/30 neon-border relative z-0"
    }>
      <MapContainer 
        center={nashikCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        <MapClickHandler />
        
        {dispatchStart && (
          <Marker position={dispatchStart}>
             <Popup>Dispatch Origin</Popup>
          </Marker>
        )}
        {dispatchEnd && (
          <Marker position={dispatchEnd}>
             <Popup>Dispatch Destination</Popup>
          </Marker>
        )}
        
        {signals.map(signal => {
          const isRoadblock = roadblocks.includes(signal.id);
          return (
          <SignalMarker 
            key={signal.id} 
            signal={{
              ...signal, 
              color: isRoadblock ? 'red' : signal.color,
              timer: isRoadblock ? 999 : signal.timer,
              // Modify congestion based on weather
              congestion: isRoadblock ? 100 : liveWeather === 'RAIN' ? Math.min(100, signal.congestion + 30) : 
                          liveWeather === 'FOG' ? Math.min(100, signal.congestion + 15) : signal.congestion
            }} 
            isActive={signal.id === activeNode || isRoadblock}
            onClick={() => {
              if (roadblockMode) {
                setRoadblocks(prev => prev.includes(signal.id) ? prev.filter(id => id !== signal.id) : [...prev, signal.id]);
              } else if (onSignalClick) {
                onSignalClick(signal.id);
              }
            }} 
          />
        )})}

        {(activeEmergency || emergencyTriggered) && <EmergencyRoute routeCoordinates={routeCoords} />}
      </MapContainer>
      
      {/* Weather Overlays */}
      {liveWeather === 'RAIN' && (
        <div className="absolute inset-0 z-[300] pointer-events-none overflow-hidden mix-blend-screen opacity-40">
          <div className="w-full h-full bg-[url('https://cdn.pixabay.com/photo/2014/10/25/08/30/rain-502596_1280.jpg')] bg-cover opacity-50 mix-blend-overlay animate-pulse"></div>
          <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[1px]"></div>
        </div>
      )}
      
      {liveWeather === 'FOG' && (
        <div className="absolute inset-0 z-[300] pointer-events-none bg-gray-500/30 backdrop-blur-[4px] mix-blend-hard-light transition-all duration-1000"></div>
      )}
      
      {/* Overlay UI elements */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-2">
          <button 
            onClick={() => {
              setRoadblockMode(!roadblockMode);
              if (simulatorMode) setSimulatorMode(false);
            }}
            className={`glass-panel p-2 rounded-lg border-orange-500/30 transition-colors cursor-pointer flex items-center justify-center ${roadblockMode ? 'bg-orange-500/40 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'hover:bg-orange-500/20 text-orange-400'}`}
            title="Toggle Dynamic Roadblocks (Maintenance)"
          >
            <AlertTriangle size={20} />
          </button>
          
          <button 
            onClick={() => {
              setSimulatorMode(!simulatorMode);
              if (roadblockMode) setRoadblockMode(false);
              if (simulatorMode) {
                setDispatchStart(null);
                setDispatchEnd(null);
                setActiveEmergency(false);
              }
            }}
            className={`glass-panel p-2 rounded-lg border-cyan-500/30 transition-colors cursor-pointer flex items-center justify-center ${simulatorMode ? 'bg-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'hover:bg-cyan-500/20 text-cyan-400'}`}
            title="Interactive Dispatch Simulator"
          >
            <Navigation size={20} />
          </button>
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="glass-panel p-2 rounded-lg border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 transition-colors cursor-pointer flex items-center justify-center"
            title={isFullscreen ? "Exit Full Screen" : "Full Screen Map"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        <div className="pointer-events-auto flex flex-col gap-2 items-end">
          {connected ? (
            <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 border-cyan-500/50 bg-cyan-500/10">
              <Wifi size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-cyan-400 font-mono text-xs font-bold">LIVE WEBSOCKET</span>
            </div>
          ) : (
            <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2 border-gray-500/50">
              <WifiOff size={14} className="text-gray-400" />
              <span className="text-gray-400 font-mono text-xs font-bold">POLLING MODE</span>
            </div>
          )}

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
    </div>
  );
};

export default MapView;
