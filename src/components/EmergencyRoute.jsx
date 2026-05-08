import { useEffect, useState } from 'react';
import { Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';

const ambulanceIcon = L.divIcon({
  html: `
    <div class="relative w-8 h-8 flex items-center justify-center bg-red-600 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.8)] border-2 border-white pulse-animation z-[1000]">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8a2 2 0 0 0-2 2v7h2"></path>
        <circle cx="5.5" cy="16.5" r="2.5"></circle>
        <circle cx="16.5" cy="16.5" r="2.5"></circle>
        <path d="M10 6v4m-2-2h4"></path>
      </svg>
    </div>
  `,
  className: 'ambulance-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const EmergencyRoute = ({ routeCoordinates }) => {
  const [currentPos, setCurrentPos] = useState(routeCoordinates[0]);

  // Animate ambulance along the route
  useEffect(() => {
    if (!routeCoordinates || routeCoordinates.length === 0) return;
    
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % routeCoordinates.length;
      setCurrentPos(routeCoordinates[index]);
    }, 2000); // Move every 2 seconds

    return () => clearInterval(interval);
  }, [routeCoordinates]);

  if (!routeCoordinates || routeCoordinates.length === 0) return null;

  return (
    <>
      <Polyline 
        positions={routeCoordinates} 
        color="#ef4444" 
        weight={6} 
        opacity={0.7} 
        dashArray="10, 10" 
        className="emergency-path-glow"
      />
      <Polyline 
        positions={routeCoordinates} 
        color="#ffffff" 
        weight={2} 
        opacity={1} 
      />
      <Marker position={currentPos || routeCoordinates[0]} icon={ambulanceIcon} zIndexOffset={1000} />
    </>
  );
};

export default EmergencyRoute;
