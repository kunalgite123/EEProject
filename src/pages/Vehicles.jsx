import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Cpu, Car, ScanLine, Activity } from 'lucide-react';
import StatsCards from '../components/StatsCards';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  // Simulate incoming ANPR (Automatic Number Plate Recognition) data
  useEffect(() => {
    const generatePlate = () => {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      let plate = "";
      for(let i=0; i<2; i++) plate += letters.charAt(Math.floor(Math.random() * letters.length));
      plate += " ";
      for(let i=0; i<2; i++) plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
      plate += " ";
      for(let i=0; i<3; i++) plate += letters.charAt(Math.floor(Math.random() * letters.length));
      return plate;
    };

    const initialVehicles = Array.from({ length: 8 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      plate: generatePlate(),
      type: Math.random() > 0.8 ? 'Truck' : Math.random() > 0.9 ? 'Bus' : 'Sedan',
      speed: Math.floor(Math.random() * 40) + 30,
      confidence: Math.floor(Math.random() * 10) + 90,
      node: Math.floor(Math.random() * 4) + 1,
      flagged: Math.random() > 0.9,
      timestamp: new Date(Date.now() - i * 5000).toLocaleTimeString()
    }));
    setVehicles(initialVehicles);

    const interval = setInterval(() => {
      setVehicles(prev => {
        const newVehicle = {
          id: Math.random().toString(36).substr(2, 9),
          plate: generatePlate(),
          type: Math.random() > 0.8 ? 'Truck' : Math.random() > 0.9 ? 'Bus' : 'Sedan',
          speed: Math.floor(Math.random() * 40) + 30,
          confidence: Math.floor(Math.random() * 10) + 90,
          node: Math.floor(Math.random() * 4) + 1,
          flagged: Math.random() > 0.95,
          timestamp: new Date().toLocaleTimeString()
        };
        return [newVehicle, ...prev.slice(0, 9)];
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col h-full gap-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Vehicle Tracking Radar</h2>
            <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded border border-cyan-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              LIVE
            </span>
          </div>
          <p className="text-gray-400 text-sm">Advanced ANPR detection, telemetrics, and threat analysis</p>
        </div>
        
        <div className="hidden md:flex gap-4">
          <div className="glass-panel px-4 py-2 rounded-lg border-purple-500/30 flex flex-col items-center">
             <ScanLine size={16} className="text-purple-400 mb-1" />
             <span className="text-xs text-gray-400 font-mono">SCANS/MIN</span>
             <span className="text-lg font-bold text-white font-mono">1,492</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-lg border-green-500/30 flex flex-col items-center">
             <Activity size={16} className="text-green-400 mb-1" />
             <span className="text-xs text-gray-400 font-mono">ACCURACY</span>
             <span className="text-lg font-bold text-white font-mono">98.4%</span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <StatsCards />
      </div>

      <div className="glass-panel border border-cyan-500/20 rounded-2xl flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h3 className="font-bold text-gray-200 tracking-wider flex items-center gap-2 text-sm">
            <Cpu size={16} className="text-cyan-400" />
            LIVE ANPR FEED
          </h3>
          <div className="flex gap-2">
             <div className="flex items-center gap-1.5 text-xs text-gray-400 px-2 py-1 bg-white/5 rounded">
               <ShieldCheck size={12} className="text-green-400" /> Confirmed
             </div>
             <div className="flex items-center gap-1.5 text-xs text-gray-400 px-2 py-1 bg-white/5 rounded">
               <AlertTriangle size={12} className="text-yellow-400" /> Flagged
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-500 font-mono border-b border-white/5">
                <th className="p-4 font-medium">TIMESTAMP</th>
                <th className="p-4 font-medium">LICENSE PLATE</th>
                <th className="p-4 font-medium">TYPE</th>
                <th className="p-4 font-medium">SPEED</th>
                <th className="p-4 font-medium">NODE</th>
                <th className="p-4 font-medium">AI CONFIDENCE</th>
                <th className="p-4 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {vehicles.map((v) => (
                  <motion.tr 
                    key={v.id}
                    initial={{ opacity: 0, x: -20, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
                    animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4 text-sm text-gray-400 font-mono">{v.timestamp}</td>
                    <td className="p-4 font-bold text-white font-mono tracking-wider">
                      <span className="px-2 py-1 bg-gray-800 rounded border border-gray-600 group-hover:border-cyan-500/50 transition-colors">
                        {v.plate}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-300 flex items-center gap-2">
                      <Car size={14} className="text-cyan-400" /> {v.type}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`${v.speed > 60 ? 'text-yellow-400' : 'text-green-400'} font-mono`}>
                        {v.speed} km/h
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">Node {v.node}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                           <div className="h-full bg-cyan-400" style={{ width: `${v.confidence}%` }}></div>
                        </div>
                        <span className="text-xs font-mono text-cyan-400">{v.confidence}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {v.flagged ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-bold flex items-center gap-1 w-max pulse-animation">
                          <AlertTriangle size={12} /> FLAGGED
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-bold flex items-center gap-1 w-max">
                          <ShieldCheck size={12} /> SECURE
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Vehicles;
