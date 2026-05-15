import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import MapView from '../components/MapView';
import { motion } from 'framer-motion';
import { Siren, Cpu } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { setShowNotification, setDetectedVehicle, autoRefresh, soundAlerts } = useOutletContext();
  const [isDetecting, setIsDetecting] = useState(false);
  const [activeCameraNode, setActiveCameraNode] = useState(1);
  const [simulationActive, setSimulationActive] = useState(false);
  const [weatherState, setWeatherState] = useState('CLEAR'); // CLEAR, RAIN, FOG

  // Cycle through nodes 1 to 4 every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setActiveCameraNode((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const simulateEmergencyDetection = async () => {
    if (simulationActive) return;
    setIsDetecting(true);
    setSimulationActive(true);
    
    try {
      const payload = {
        vehicle_type: "white ambulance with lights",
        siren_detected: true,
        image_description: "Speeding towards heavy traffic intersection"
      };
      
      const res = await axios.post('http://127.0.0.1:8000/api/detect-emergency', payload);
      
      if (res.data.emergency_detected) {
        setDetectedVehicle("AMBULANCE (EVPS TRIGGERED)");
        setShowNotification(true);
        if (soundAlerts) {
          const audio = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audio.createOscillator();
          const gainNode = audio.createGain();
          osc.connect(gainNode);
          gainNode.connect(audio.destination);
          osc.type = 'square';
          osc.frequency.value = 800;
          gainNode.gain.setValueAtTime(0.1, audio.currentTime);
          osc.start();
          setTimeout(() => osc.stop(), 500);
        }
      }
    } catch {
      console.warn("Backend API offline, using local simulation");
      setDetectedVehicle("AMBULANCE (EVPS PREEMPTION)");
      setShowNotification(true);
      if (soundAlerts) {
        const audio = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audio.createOscillator();
        const gainNode = audio.createGain();
        osc.connect(gainNode);
        gainNode.connect(audio.destination);
        osc.type = 'square';
        osc.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, audio.currentTime);
        osc.start();
        setTimeout(() => osc.stop(), 500);
      }
    } finally {
      setIsDetecting(false);
      // Let the ambulance run its course for 10 seconds before turning off
      setTimeout(() => setSimulationActive(false), 10000);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-between items-end gap-4"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Command Center</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time smart city traffic monitoring and AI analysis</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass-panel px-2 py-1.5 rounded-lg flex items-center gap-2 border-blue-500/30 bg-gray-900/50">
            <select 
              value={weatherState}
              onChange={(e) => setWeatherState(e.target.value)}
              className="bg-transparent text-xs text-cyan-300 font-mono outline-none cursor-pointer"
            >
              <option value="CLEAR">☀️ CLEAR</option>
              <option value="RAIN">🌧️ HEAVY RAIN</option>
              <option value="FOG">🌫️ DENSE FOG</option>
            </select>
          </div>

          <button 
            onClick={simulateEmergencyDetection}
            disabled={isDetecting || simulationActive}
            className={`glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all group disabled:opacity-50 ${simulationActive ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] bg-green-500/20' : 'border-red-500/50 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
          >
            {isDetecting ? (
              <Cpu className="text-red-400 animate-spin" size={18} />
            ) : (
              <Siren className={simulationActive ? 'text-green-400 animate-pulse' : 'text-red-400 group-hover:animate-pulse'} size={18} />
            )}
            <span className={`text-sm font-bold tracking-wider ${simulationActive ? 'text-green-400' : 'text-red-400'}`}>
              {isDetecting ? 'ANALYZING...' : simulationActive ? 'EVPS ACTIVE' : 'SIMULATE EMERGENCY'}
            </span>
          </button>

          <div className="glass-panel px-4 py-2.5 rounded-lg flex items-center gap-3 border-cyan-500/30">
            <span className="text-xs text-gray-400 font-mono">CLAUDE AI</span>
            <span className="text-sm font-bold text-cyan-400 neon-text pulse-animation">ONLINE</span>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] min-h-[500px]"
        >
          <MapView 
            activeNode={activeCameraNode} 
            onSignalClick={(id) => setActiveCameraNode(id)} 
            emergencyTriggered={simulationActive}
            weatherState={weatherState}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
