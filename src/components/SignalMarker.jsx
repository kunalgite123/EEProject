import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createIcon = (color, id) => {
  const getGlowColor = () => {
    switch(color) {
      case 'green': return 'rgba(34, 197, 94, 0.6)';
      case 'red': return 'rgba(239, 68, 68, 0.6)';
      case 'yellow': return 'rgba(234, 179, 8, 0.6)';
      default: return 'rgba(34, 197, 94, 0.6)';
    }
  };

  const html = `
    <div class="relative flex items-center justify-center w-12 h-12">
      <div class="absolute inset-0 rounded-full animate-ping opacity-50" style="background-color: ${getGlowColor()}"></div>
      <div class="relative w-8 h-8 bg-gray-900 border-2 border-gray-700 rounded-lg flex flex-col items-center justify-center shadow-lg overflow-hidden">
        <div class="w-2 h-2 rounded-full mb-0.5 ${color === 'red' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gray-700'}"></div>
        <div class="w-2 h-2 rounded-full mb-0.5 ${color === 'yellow' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-gray-700'}"></div>
        <div class="w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-700'}"></div>
      </div>
      <div class="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] font-bold px-1 rounded border border-gray-600">
        ${id}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-signal-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

const SignalMarker = ({ signal, onClick }) => {
  const getCongestionColor = (val) => {
    if (val > 80) return 'text-red-500';
    if (val > 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Marker 
      position={signal.position} 
      icon={createIcon(signal.color, signal.id)}
      eventHandlers={{ click: onClick }}
    >
      <Popup className="glass-popup">
        <div className="bg-gray-900/90 text-white p-3 rounded-lg border border-cyan-500/30 backdrop-blur-md min-w-[200px]">
          <h3 className="font-bold text-lg text-cyan-400 mb-2 border-b border-gray-700 pb-1">{signal.name}</h3>
          
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">STATUS:</span>
              <span className={`uppercase font-bold ${
                signal.color === 'red' ? 'text-red-500' : 
                signal.color === 'yellow' ? 'text-yellow-500' : 'text-green-500'
              }`}>{signal.color}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">TIMER:</span>
              <span className="text-white font-bold">{signal.timer}s</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">CONGESTION:</span>
              <span className={`font-bold ${getCongestionColor(signal.congestion)}`}>{signal.congestion}%</span>
            </div>
            
            <div className="mt-3 pt-2 border-t border-gray-700">
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-1">
                <div 
                  className={`h-1.5 rounded-full ${
                    signal.congestion > 80 ? 'bg-red-500' : 
                    signal.congestion > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${signal.congestion}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default SignalMarker;
