import { motion } from 'framer-motion';
import { Video, Server, Activity, Shield } from 'lucide-react';
import CameraFeed from '../components/CameraFeed';

const Cameras = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col h-full gap-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Video className="text-cyan-400" size={28} />
            Global Surveillance System
          </h2>
          <p className="text-gray-400 text-sm mt-1">Multi-node live streaming with active YOLOv8 object detection</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="glass-panel px-4 py-2 rounded-lg border-cyan-500/30 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-mono">BANDWIDTH</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">1.4 GB/s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 hidden md:grid">
        <div className="glass-panel p-3 rounded-xl border border-white/5 flex items-center gap-3">
          <Server size={20} className="text-gray-400" />
          <div>
            <div className="text-xs text-gray-500 font-mono">ACTIVE NODES</div>
            <div className="text-white font-bold font-mono">24/24 ONLINE</div>
          </div>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-white/5 flex items-center gap-3">
          <Activity size={20} className="text-green-400" />
          <div>
            <div className="text-xs text-gray-500 font-mono">FRAME RATE</div>
            <div className="text-white font-bold font-mono">60 FPS (SYNCED)</div>
          </div>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-white/5 flex items-center gap-3">
          <Shield size={20} className="text-blue-400" />
          <div>
            <div className="text-xs text-gray-500 font-mono">AI MODEL STATUS</div>
            <div className="text-white font-bold font-mono">YOLOv8 ACTIVE</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Nodes */}
        <CameraFeed activeNode={1} />
        
        {/* Other Nodes */}
        <CameraFeed activeNode={2} />
        <CameraFeed activeNode={3} />
        <CameraFeed activeNode={4} />
      </div>
    </motion.div>
  );
};

export default Cameras;
