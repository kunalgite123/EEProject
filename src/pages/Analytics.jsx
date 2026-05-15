import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { BrainCircuit, TrendingUp, Zap, Clock } from 'lucide-react';
import CongestionChart from '../components/CongestionChart';
import NodeSelector from '../components/NodeSelector';

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
  const [selectedNode, setSelectedNode] = useState('ALL');
  const [predictionHours, setPredictionHours] = useState(0);

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

  const nodeFactor = selectedNode === 'ALL' ? 1 : parseInt(selectedNode.replace('NODE ', '')) * 0.25 + 0.5;
  
  const displayChartData = (() => {
    let baseData = [...chartData];
    if (predictionHours > 0) {
      baseData = baseData.map((d, i) => {
        const [h, m] = d.time.split(':');
        const futureH = (parseInt(h) + parseInt(predictionHours)) % 24;
        const timeOffset = parseInt(predictionHours);
        const jitter = Math.sin((i + timeOffset) * 0.8) * (15 + timeOffset * 2);
        return {
          time: `${futureH}:${m}`,
          value: Math.max(10, Math.min(95, d.value + jitter))
        };
      });
    }
    return baseData.map(d => ({ ...d, value: Math.min(100, Math.round(d.value * nodeFactor)) }));
  })();

  const displayVehicleData = vehicleData.map(d => ({ ...d, value: Math.round(d.value * nodeFactor) }));

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
            <BrainCircuit className="text-purple-400" size={28} />
            AI Analytics Matrix
          </h2>
          <p className="text-gray-400 text-sm mt-1">Deep learning insights, predictive congestion modeling, and vehicle distribution</p>
        </div>
        
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <NodeSelector selectedNode={selectedNode} onSelectNode={setSelectedNode} />
          <div className="glass-panel px-4 py-2 rounded-lg border-cyan-500/30 flex items-center gap-3 hidden md:flex">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-xs text-gray-300 font-mono">MODEL: YOLOv8-TRAFFIC-V2</span>
          </div>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-300 tracking-widest">
              {predictionHours > 0 ? `PREDICTED CONGESTION (+${predictionHours} HOURS)` : "REAL-TIME CONGESTION INDEX"}
            </h3>
            {predictionHours > 0 && (
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded font-mono animate-pulse border border-purple-500/30">AI PREDICTION MODE</span>
            )}
          </div>
          
          <div className="flex-1">
            <CongestionChart data={displayChartData} />
          </div>
          
          <div className="mt-4 pt-4 border-t border-cyan-500/20">
            <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
              <span>LIVE</span>
              <span className="text-purple-400">PREDICT (+24h)</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="24" 
              value={predictionHours} 
              onChange={(e) => setPredictionHours(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-purple-500/20 flex flex-col min-h-[350px]">
          <h3 className="text-sm font-bold text-gray-300 tracking-widest mb-4">VEHICLE CLASSIFICATION</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayVehicleData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {displayVehicleData.map((entry, index) => (
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
                 <div className="text-2xl font-bold text-white font-mono">
                   {(displayVehicleData.reduce((acc, curr) => acc + curr.value, 0) / 1000).toFixed(1)}k
                 </div>
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
