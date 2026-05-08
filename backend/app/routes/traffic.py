from fastapi import APIRouter
from app.models.schemas import TrafficStatusResponse, TrafficSignal
import random

router = APIRouter()

# Store state to make the transitions realistic
signal_states = [
    {"id": 1, "status": "green", "density": 85},
    {"id": 2, "status": "red", "density": 40},
    {"id": 3, "status": "yellow", "density": 60},
    {"id": 4, "status": "green", "density": 90},
    {"id": 5, "status": "red", "density": 30},
]

@router.get("/traffic-status", response_model=TrafficStatusResponse)
async def get_traffic_status():
    """
    Returns live signal and traffic density data.
    Simulates changing traffic conditions.
    """
    
    # Randomize signal states slightly to simulate real-time
    colors = ["red", "yellow", "green"]
    
    for signal in signal_states:
        # 10% chance to change color
        if random.random() > 0.9:
            current_idx = colors.index(signal["status"])
            signal["status"] = colors[(current_idx + 1) % 3]
            
        # Fluctuate density by -5 to +5
        change = random.randint(-5, 5)
        signal["density"] = max(10, min(95, signal["density"] + change))
        
    avg_congestion = sum(s["density"] for s in signal_states) // len(signal_states)
    
    return TrafficStatusResponse(
        signals=[TrafficSignal(**s) for s in signal_states],
        city_congestion=avg_congestion,
        active_emergency=random.random() > 0.8 # 20% chance of active emergency
    )
