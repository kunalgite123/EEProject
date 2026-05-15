import { Map, BarChart2, ShieldAlert, Cpu, Video, Car, RadioReceiver, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: <Map size={22} />, label: "Live Map", path: "/" },
    { icon: <BarChart2 size={22} />, label: "Analytics", path: "/analytics" },
    { icon: <Video size={22} />, label: "Cameras", path: "/cameras" },
    { icon: <ShieldAlert size={22} />, label: "Incidents", path: "/incidents" },
    { icon: <Cpu size={22} />, label: "AI Models", path: "/ai-models" },
    { icon: <Car size={22} />, label: "Vehicles", path: "/vehicles" },
    { icon: <RadioReceiver size={22} />, label: "V2X Signals", path: "/v2x" },
    { icon: <Database size={22} />, label: "Audit Logs", path: "/audit-logs" },
  ];

  return (
    <div className="glass-panel w-20 hover:w-64 transition-all duration-300 h-screen fixed left-0 top-0 pt-20 flex flex-col z-40 overflow-hidden group">
      <div className="flex flex-col gap-2 p-3">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 neon-border" 
                : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
            }`}
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-4 w-full"
              >
                <div className="min-w-[24px] flex justify-center">
                  {item.icon}
                </div>
                <span className="whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
      
      <div className="mt-auto mb-6 p-4">
        <div className="glass-panel p-4 rounded-xl border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-xs text-gray-400 mb-2 font-mono">SERVER LOAD</p>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
            <div className="bg-cyan-400 h-1.5 rounded-full w-[45%]"></div>
          </div>
          <p className="text-xs text-right text-cyan-400 font-mono">45%</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
