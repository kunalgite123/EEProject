import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RadioReceiver, Leaf, Wifi, Zap, Hexagon } from 'lucide-react';

const V2X = () => {
  const [data, setData] = useState([]);
  const [connections, setConnections] = useState([]);

  // Generate carbon footprint data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emissionsSaved: Math.floor(Math.random() * 50) + 100 + (i * 2)
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emissionsSaved: Math.floor(Math.random() * 20) + prev[prev.length - 1].emissionsSaved
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate pinging connections
  useEffect(() => {
    const generateConnection = () => {
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: Math.random() > 0.5 ? 'Vehicle' : 'Infrastructure',
        signal: Math.floor(Math.random() * 100),
        latency: Math.floor(Math.random() * 15) + 2
      };
    };

    setConnections(Array.from({ length: 5 }, generateConnection));

    const interval = setInterval(() => {
      setConnections(prev => {
        const newConn = [generateConnection(), ...prev.slice(0, 4)];
        return newConn;
      });
    }, 2000);

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
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <RadioReceiver className="text-green-400" size={28} />
            V2X Telemetrics & Environment
          </h2>
          <p className="text-gray-400 text-sm mt-1">Vehicle-to-Everything communication and Carbon Emission Tracking</p>
        </div>
        
        <div className="glass-panel px-4 py-2 rounded-lg border-green-500/30 flex items-center gap-3 hidden md:flex">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-gray-300 font-mono">NETWORK: 5G DSRC ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        <div className="glass-panel p-6 rounded-2xl border-green-500/30 flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-400 font-mono mb-1 flex items-center gap-2"><Leaf size={14} className="text-green-400"/> TOTAL CO2 SAVED</p>
             <h3 className="text-4xl font-bold text-white font-mono">
               {data.length > 0 ? (data[data.length - 1].emissionsSaved / 10).toFixed(1) : '0'} <span className="text-lg text-gray-500">kg</span>
             </h3>
           </div>
           <div className="w-16 h-16 rounded-full border-4 border-green-500/20 flex items-center justify-center border-t-green-500 animate-spin" style={{ animationDuration: '3s' }}>
             <div className="w-12 h-12 rounded-full border-4 border-green-500/20 flex items-center justify-center border-b-green-400 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
             </div>
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-400 font-mono mb-1 flex items-center gap-2"><Wifi size={14} className="text-cyan-400"/> V2X CONNECTIONS</p>
             <h3 className="text-4xl font-bold text-white font-mono">
               12,492 <span className="text-lg text-gray-500">nodes</span>
             </h3>
           </div>
           <div className="relative flex justify-center items-center">
             <div className="absolute w-12 h-12 bg-cyan-500/20 rounded-full animate-ping"></div>
             <RadioReceiver size={24} className="text-cyan-400 relative z-10" />
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-purple-500/30 flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-400 font-mono mb-1 flex items-center gap-2"><Zap size={14} className="text-purple-400"/> AVG LATENCY</p>
             <h3 className="text-4xl font-bold text-white font-mono">
               4.2 <span className="text-lg text-gray-500">ms</span>
             </h3>
           </div>
           <Hexagon size={48} className="text-purple-400/20 stroke-[1] fill-purple-500/10" />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl border-green-500/20 flex flex-col min-h-[350px]">
          <h3 className="text-sm font-bold text-gray-300 tracking-widest mb-4">CARBON EMISSIONS REDUCTION TREND</h3>
          <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="time" stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                 <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}
                   itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="emissionsSaved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-cyan-500/20 flex flex-col min-h-[350px]">
          <h3 className="text-sm font-bold text-gray-300 tracking-widest mb-4">LIVE V2X HANDSHAKES</h3>
          <div className="flex-1 flex flex-col gap-3 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>
            
            <AnimatePresence>
              {connections.map((conn) => (
                <motion.div 
                  key={conn.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-cyan-500/20 rounded">
                      <RadioReceiver size={14} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-300 font-mono font-bold">{conn.type}</div>
                      <div className="text-[10px] text-gray-500 font-mono">ID: {conn.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-400 font-mono">{conn.signal}% sig</div>
                    <div className="text-[10px] text-purple-400 font-mono">{conn.latency}ms</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default V2X;
