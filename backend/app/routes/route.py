from fastapi import APIRouter
from app.models.schemas import RouteResponse
import random

router = APIRouter()

@router.get("/get-route", response_model=RouteResponse)
async def get_route():
    """
    Returns an optimized emergency route.
    In a real system, this would calculate paths based on real-time traffic graph data (e.g., Dijkstra/A*).
    """
    
    # Base emergency route in Nashik
    base_route = [
        [19.9885, 73.7745], # Mumbai Naka
        [19.9930, 73.7800],
        [19.9975, 73.7915], # Dwarka Circle
        [20.0022, 73.7845], # CBS
        [20.0065, 73.7865], # Ashok Stambh
    ]
    
    # Randomize the route slightly to simulate dynamic rerouting
    dynamic_route = base_route.copy()
    if random.random() > 0.5:
        # Simulate taking an alternate side road due to traffic
        dynamic_route.insert(2, [19.9950, 73.7850])
        
    return RouteResponse(
        route=dynamic_route,
        estimated_time_saved=f"{random.randint(4, 12)} mins",
        traffic_level=random.choice(["low", "moderate", "high"])
    )
