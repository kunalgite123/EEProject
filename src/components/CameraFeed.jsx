import { useState, useEffect, useRef } from 'react';
import { Camera, AlertCircle, Maximize2, UploadCloud, Link as LinkIcon, Check, X } from 'lucide-react';

const CameraFeed = ({ activeNode = 4, initialVideoSrc = "https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4" }) => {
  const [videoSrc, setVideoSrc] = useState(initialVideoSrc);
  const [customTitle, setCustomTitle] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isYoutube, setIsYoutube] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInputVal, setLinkInputVal] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsYoutube(false);
      setCustomTitle(`CUSTOM FEED - ${file.name.toUpperCase()}`);
    }
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (!linkInputVal.trim()) return;
    
    let finalUrl = linkInputVal.trim();
    let isYt = false;

    // Simple youtube URL regex
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = finalUrl.match(ytRegex);
    
    if (match && match[1]) {
      // Add autoplay, mute, loop, and playlist (required for loop) params
      finalUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${match[1]}`;
      isYt = true;
    }
    
    setVideoSrc(finalUrl);
    setIsYoutube(isYt);
    setCustomTitle(`LINK FEED`);
    setShowLinkInput(false);
    setLinkInputVal('');
  };

  // Simulate camera switch effect when activeNode or videoSrc changes
  useEffect(() => {
    setIsSwitching(true);
    setBoxes([]);
    const timer = setTimeout(() => {
      setIsSwitching(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, [activeNode, videoSrc]);

  // Simulate AI Bounding Boxes for the traffic video
  useEffect(() => {
    if (isSwitching) return;
    
    const interval = setInterval(() => {
      const numCars = Math.floor(Math.random() * 5) + 3; 
      const newBoxes = Array.from({ length: numCars }).map(() => {
        const width = Math.random() * 12 + 5; 
        const height = Math.random() * 10 + 5; 
        const x = Math.random() * (100 - width);
        const y = Math.random() * (60 - height) + 30; 

        const typeRand = Math.random();
        const type = typeRand > 0.8 ? 'truck' : typeRand > 0.6 ? 'pedestrian' : 'car';
        const speed = type === 'pedestrian' ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 60) + 10;

        return {
          id: Math.random().toString(36).substring(7),
          x,
          y,
          width,
          height,
          confidence: Math.floor(Math.random() * 10) + 90, 
          type,
          speed
        };
      });
      setBoxes(newBoxes);
    }, 900); 

    return () => clearInterval(interval);
  }, [isSwitching]);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 flex-1 flex flex-col overflow-hidden relative group h-full">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-cyan-400" />
          <h3 className="text-gray-300 font-bold text-sm tracking-widest">
            {customTitle || `LIVE CCTV - NODE ${activeNode}`}
          </h3>
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
        {isYoutube ? (
          <iframe 
            src={videoSrc}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSwitching ? 'opacity-20' : 'opacity-90'} pointer-events-none`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />
        ) : (
          <video 
            autoPlay 
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSwitching ? 'opacity-20' : 'opacity-90'}`}
            src={videoSrc}
          />
        )}
        
        {/* Switching Effect Overlay */}
        {isSwitching && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
            <div className="text-cyan-400 font-mono text-xs flex flex-col items-center">
               <Camera className="animate-pulse mb-2" size={24} />
               <span>{customTitle ? 'INITIALIZING FEED...' : `CONNECTING TO NODE ${activeNode}...`}</span>
            </div>
          </div>
        )}
        
        {/* Scan line effect overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10 mix-blend-overlay"></div>
        
        {/* Bounding Boxes */}
        {boxes.map(box => {
          const colorClass = box.type === 'pedestrian' ? 'border-yellow-500 bg-yellow-500/10' : 
                             box.type === 'truck' ? 'border-orange-500 bg-orange-500/10' : 
                             'border-green-500 bg-green-500/10';
          const badgeClass = box.type === 'pedestrian' ? 'bg-yellow-500' : 
                             box.type === 'truck' ? 'bg-orange-500' : 
                             'bg-green-500';
          return (
          <div
            key={box.id}
            className={`absolute border-2 transition-all duration-300 ease-linear z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${colorClass}`}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          >
            <div className={`text-black text-[10px] font-mono px-1.5 py-0.5 font-bold whitespace-nowrap absolute -top-5 left-[-2px] rounded-t-sm ${badgeClass}`}>
              {box.type.toUpperCase()} {box.confidence}% | {box.speed} km/h
            </div>
            
            {/* Speed Vector line */}
            <div className={`absolute top-1/2 left-1/2 w-0.5 opacity-70 origin-bottom -translate-x-1/2 -translate-y-full ${badgeClass}`} style={{ height: `${box.speed}px` }}>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-inherit"></div>
            </div>
          </div>
        )})}
        
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
          <AlertCircle size={12} className="text-green-400" />
          <span className="text-[10px] font-mono text-green-400">
            YOLOv8 Active | {boxes.length} objects detected
          </span>
        </div>
        
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="p-1.5 bg-black/50 hover:bg-cyan-500/50 rounded-md text-white/70 hover:text-white transition-colors border border-white/10 backdrop-blur-sm group"
              title="Add Feed via Link"
            >
              <LinkIcon size={14} className="group-hover:text-cyan-300" />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-black/50 hover:bg-purple-500/50 rounded-md text-white/70 hover:text-white transition-colors border border-white/10 backdrop-blur-sm group"
              title="Upload Custom Feed"
            >
              <UploadCloud size={14} className="group-hover:text-purple-300" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="video/*" 
              className="hidden" 
            />
            <button className="p-1.5 bg-black/50 hover:bg-black/80 rounded-md text-white/70 hover:text-white transition-colors border border-white/10 backdrop-blur-sm">
              <Maximize2 size={14} />
            </button>
          </div>
          
          {showLinkInput && (
            <form onSubmit={handleLinkSubmit} className="flex items-center gap-1 bg-black/80 p-1.5 rounded-lg border border-cyan-500/50 backdrop-blur-md">
              <input 
                type="text" 
                value={linkInputVal}
                onChange={(e) => setLinkInputVal(e.target.value)}
                placeholder="Paste YT or MP4 link..." 
                className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-32 px-1"
                autoFocus
              />
              <button type="submit" className="p-1 text-green-400 hover:bg-green-400/20 rounded">
                <Check size={12} />
              </button>
              <button type="button" onClick={() => setShowLinkInput(false)} className="p-1 text-red-400 hover:bg-red-400/20 rounded">
                <X size={12} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
