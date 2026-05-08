import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import MapView from '../components/MapView';
import CongestionChart from '../components/CongestionChart';
import NotificationPopup from '../components/NotificationPopup';
import CameraFeed from '../components/CameraFeed';
import { motion } from 'framer-motion';
import { Siren, Cpu } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [detectedVehicle, setDetectedVehicle] = useState("AMBULANCE");
  const [isDetecting, setIsDetecting] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeCameraNode, setActiveCameraNode] = useState(4);

  // Initialize chart data on mount to avoid impure functions during render
  useEffect(() => {
    setChartData(Array.from({length: 15}, (_, i) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - (15 - i));
      // Using a deterministic approach instead of Math.random
      const pseudoRandom = (i * 17) % 30;
      return {
        time: `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`,
        value: 40 + pseudoRandom
      };
    }));
  }, []);

  // Update chart data to simulate real-time graph
  useEffect(() => {
    if (chartData.length === 0) return;
    const interval = setInterval(() => {
      setChartData(prev => {
        if (prev.length === 0) return prev;
        const newData = [...prev.slice(1)];
        const d = new Date();
        const nextTime = `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
        
        newData.push({
          time: nextTime,
          value: Math.max(10, Math.min(95, prev[prev.length - 1].value + (Math.random() * 15 - 7.5)))
        });
        return newData;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [chartData.length]);

  const simulateEmergencyDetection = async () => {
    setIsDetecting(true);
    try {
      const payload = {
        vehicle_type: "white ambulance with lights",
        siren_detected: true,
        image_description: "Speeding towards heavy traffic intersection"
      };
      
      const res = await axios.post('http://127.0.0.1:8000/api/detect-emergency', payload);
      
      if (res.data.emergency_detected) {
        setDetectedVehicle(res.data.vehicle);
        setShowNotification(true);
      }
    } catch {
      console.warn("Backend API offline, using local simulation");
      setDetectedVehicle("AMBULANCE");
      setShowNotification(true);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />
      <NotificationPopup 
        active={showNotification} 
        vehicle={detectedVehicle} 
        onDismiss={() => setShowNotification(false)} 
      />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-20 p-4 md:p-6 overflow-y-auto flex flex-col min-h-[calc(100vh-64px)] transition-all duration-300 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-between items-end gap-4 mb-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Command Center</h2>
              <p className="text-gray-400 text-sm mt-1">Real-time smart city traffic monitoring and AI analysis</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={simulateEmergencyDetection}
                disabled={isDetecting}
                className="glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 border-red-500/50 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all group disabled:opacity-50"
              >
                {isDetecting ? (
                  <Cpu className="text-red-400 animate-spin" size={18} />
                ) : (
                  <Siren className="text-red-400 group-hover:animate-pulse" size={18} />
                )}
                <span className="text-sm font-bold text-red-400 tracking-wider">
                  {isDetecting ? 'ANALYZING FEED...' : 'SIMULATE EMERGENCY'}
                </span>
              </button>

              <div className="glass-panel px-4 py-2.5 rounded-lg flex items-center gap-3 border-cyan-500/30">
                <span className="text-xs text-gray-400 font-mono">CLAUDE AI</span>
                <span className="text-sm font-bold text-cyan-400 neon-text pulse-animation">ONLINE</span>
              </div>
            </div>
          </motion.div>

          <StatsCards />
          
          <div className="flex-1 w-full flex flex-col xl:flex-row gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-[2] relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] min-h-[500px]"
            >
              <MapView onSignalClick={(id) => setActiveCameraNode(id)} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 flex flex-col gap-6 min-w-[350px]"
            >
              <div className="h-[250px] shrink-0">
                <CongestionChart data={chartData} />
              </div>
              
              <div className="h-[300px] shrink-0">
                <CameraFeed activeNode={activeCameraNode} />
              </div>
              
              <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 flex-1 flex flex-col min-h-[200px]">
                 <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-300 font-bold text-sm tracking-widest">SYSTEM LOGS</h3>
                  <Cpu size={16} className="text-purple-400" />
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {[
                    { time: "Just now", msg: "AI model optimized route 4B", type: "info" },
                    { time: "2 mins ago", msg: "Traffic density increased at Node 7", type: "warn" },
                    { time: "15 mins ago", msg: "Signal sync completed successfully", type: "success" },
                    { time: "1 hr ago", msg: "Routine system maintenance finished", type: "info" },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-gray-500 font-mono text-xs whitespace-nowrap">{log.time}</span>
                      <span className={`${log.type === 'warn' ? 'text-yellow-400' : log.type === 'success' ? 'text-green-400' : 'text-gray-300'}`}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
