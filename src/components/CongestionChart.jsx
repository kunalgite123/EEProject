import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CongestionChart = ({ data }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-300 font-bold text-sm tracking-widest">LIVE CONGESTION TREND</h3>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[10px] text-cyan-400 font-mono">LIVE UPDATE</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#45f3ff" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#45f3ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2833" vertical={false} />
            <XAxis dataKey="time" stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 10}} tickLine={false} axisLine={false} />
            <YAxis stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 10}} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(11, 12, 16, 0.9)', borderColor: 'rgba(69, 243, 255, 0.3)', borderRadius: '8px' }}
              itemStyle={{ color: '#45f3ff', fontWeight: 'bold' }}
              labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#45f3ff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCongestion)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CongestionChart;
