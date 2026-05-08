import { useState, useEffect } from 'react';
import { Camera, AlertCircle, Maximize2 } from 'lucide-react';

const CameraFeed = ({ activeNode = 4 }) => {
  const [boxes, setBoxes] = useState([]);
  const [isSwitching, setIsSwitching] = useState(false);

  // Simulate camera switch effect when activeNode changes
  useEffect(() => {
    setIsSwitching(true);
    // Randomize video a bit by clearing boxes
    setBoxes([]);
    const timer = setTimeout(() => {
      setIsSwitching(false);
    }, 500); // 500ms static/switch effect
    return () => clearTimeout(timer);
  }, [activeNode]);

  // Simulate AI Bounding Boxes for the traffic video
  useEffect(() => {
    if (isSwitching) return;
    
    const interval = setInterval(() => {
      // Simulate random car detections that fit well on a road video
      const numCars = Math.floor(Math.random() * 5) + 3; // 3 to 7 objects
      const newBoxes = Array.from({ length: numCars }).map(() => {
        // Cars should be slightly smaller as they are further away
        const width = Math.random() * 12 + 5; // 5% to 17% width
        const height = Math.random() * 10 + 5; // 5% to 15% height
        const x = Math.random() * (100 - width);
        // Keep them generally in the lower 2/3rds of the screen (on the road)
        const y = Math.random() * (60 - height) + 30; 

        return {
          id: Math.random().toString(36).substring(7),
          x,
          y,
          width,
          height,
          confidence: Math.floor(Math.random() * 10) + 90, // 90% to 99%
          type: Math.random() > 0.8 ? 'truck' : 'car'
        };
      });
      setBoxes(newBoxes);
    }, 900); // Update every 900ms 

    return () => clearInterval(interval);
  }, [isSwitching]);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 flex-1 flex flex-col overflow-hidden relative group h-full">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-cyan-400" />
          <h3 className="text-gray-300 font-bold text-sm tracking-widest">LIVE CCTV - NODE {activeNode}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs font-mono tracking-wider text-red-400">
            REC
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative rounded-xl overflow-hidden bg-black border border-gray-700/50 min-h-[150px] flex items-center justify-center">
        
        {/* Looping Traffic Video Element */}
        <video 
          autoPlay 
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSwitching ? 'opacity-20' : 'opacity-90'}`}
          src="https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4"
        />
        
        {/* Switching Effect Overlay */}
        {isSwitching && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
            <div className="text-cyan-400 font-mono text-xs flex flex-col items-center">
               <Camera className="animate-pulse mb-2" size={24} />
               <span>CONNECTING TO NODE {activeNode}...</span>
            </div>
          </div>
        )}
        
        {/* Scan line effect overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10 mix-blend-overlay"></div>
        
        {/* Bounding Boxes */}
        {boxes.map(box => (
          <div
            key={box.id}
            className="absolute border-2 border-green-500 bg-green-500/10 transition-all duration-300 ease-linear z-20 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          >
            <div className="bg-green-500 text-black text-[10px] font-mono px-1.5 py-0.5 font-bold whitespace-nowrap absolute -top-5 left-[-2px] rounded-t-sm">
              {box.type} {box.confidence}%
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
          <AlertCircle size={12} className="text-green-400" />
          <span className="text-[10px] font-mono text-green-400">
            YOLOv8 Active | {boxes.length} objects detected
          </span>
        </div>
        
        <button className="absolute top-2 right-2 z-20 p-1.5 bg-black/50 hover:bg-black/80 rounded-md text-white/70 hover:text-white transition-colors border border-white/10 backdrop-blur-sm">
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default CameraFeed;
