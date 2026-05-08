import { Activity, Bell, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="glass-panel w-full h-16 flex items-center justify-between px-6 fixed top-0 z-50 border-b border-cyan-500/30">
      <div className="flex items-center gap-3">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="text-cyan-400"
        >
          <Activity size={28} />
        </motion.div>
        <h1 className="text-xl font-bold tracking-wider text-white">
          <span className="text-cyan-400 neon-text">AI</span> TRAFFIC NEXUS
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm text-gray-300 font-mono">SYSTEM ONLINE</span>
        </div>
        
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-cyan-400 transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="hover:text-cyan-400 transition-colors">
            <Settings size={20} />
          </button>
          <button className="hover:text-cyan-400 transition-colors ml-2 bg-gray-800/50 p-1.5 rounded-full border border-gray-700">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
