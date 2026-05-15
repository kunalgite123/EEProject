import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { BrainCircuit, TrendingUp, Zap, Clock } from 'lucide-react';
import CongestionChart from '../components/CongestionChart';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
const vehicleData = [
  { name: 'Sedans', value: 4500 },
  { name: 'SUVs', value: 3200 },
  { name: 'Trucks', value: 1200 },
  { name: 'Buses', value: 600 },
  { name: 'Emergency', value: 24 },
];

const PredictionCard = ({ icon, title, value, subtext, color }) => (
  <div className={`glass-panel p-4 rounded-xl border border-${color}-500/20 hover:border-${color}-500/50 transition-colors group relative overflow-hidden`}>
    <div className={`absolute -right-4 -top-4 w-16 h-16 bg-${color}-500/10 rounded-full blur-xl group-hover:bg-${color}-500/20 transition-all`}></div>
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400`}>
        {icon}
      </div>
      <h4 className="text-gray-300 font-bold text-sm tracking-wider">{title}</h4>
    </div>
    <div className="text-2xl font-bold text-white font-mono mb-1">{value}</div>
    <div className="text-xs text-gray-400">{subtext}</div>
  </div>
);

const Analytics = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(Array.from({length: 15}, (_, i) => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - (15 - i));
      const pseudoRandom = (i * 17) % 30;
      return {
        time: `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`,
        value: 40 + pseudoRandom
      };
    }));
  }, []);

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
            <BrainCircuit className="text-purple-400" size={28} />
            AI Analytics Matrix
          </h2>
          <p className="text-gray-400 text-sm mt-1">Deep learning insights, predictive congestion modeling, and vehicle distribution</p>
        </div>
        
        <div className="glass-panel px-4 py-2 rounded-lg border-cyan-500/30 flex items-center gap-3 hidden md:flex">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs text-gray-300 font-mono">MODEL: YOLOv8-TRAFFIC-V2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PredictionCard icon={<TrendingUp size={18} />} title="PEAK PREDICTION" value="17:30 PM" subtext="85% probability of heavy congestion" color="red" />
        <PredictionCard icon={<Clock size={18} />} title="AVG DELAY" value="-4.2 mins" subtext="Time saved vs non-AI routing" color="green" />
        <PredictionCard icon={<Zap size={18} />} title="SIGNAL EFFICIENCY" value="94.8%" subtext="Optimization index running nominal" color="yellow" />
        <PredictionCard icon={<BrainCircuit size={18} />} title="AI INFERENCES" value="1.2M" subtext="Total objects processed last 24h" color="purple" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl border-cyan-500/20 flex flex-col min-h-[350px]">
          <h3 className="text-sm font-bold text-gray-300 tracking-widest mb-4">REAL-TIME CONGESTION INDEX</h3>
          <div className="flex-1">
            <CongestionChart data={chartData} />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-purple-500/20 flex flex-col min-h-[350px]">
          <h3 className="text-sm font-bold text-gray-300 tracking-widest mb-4">VEHICLE CLASSIFICATION</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#ccc' }}/>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <div className="text-center">
                 <div className="text-2xl font-bold text-white font-mono">9.5k</div>
                 <div className="text-[10px] text-gray-400">TOTAL</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
