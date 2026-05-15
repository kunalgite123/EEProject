from fastapi import APIRouter
from app.models.schemas import RouteResponse
from pydantic import BaseModel
import random

router = APIRouter()

class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float

@router.post("/calculate-route")
async def calculate_route(req: RouteRequest):
    # A pseudo-Manhattan routing algorithm to simulate city block navigation
    
    # Step 1: Start point
    route = [[req.start_lat, req.start_lng]]
    
    # Step 2: Intermediate point 1 (Vertical movement)
    mid_lat = req.start_lat + (req.end_lat - req.start_lat) * 0.5
    route.append([mid_lat, req.start_lng])
    
    # Step 3: Intermediate point 2 (Horizontal movement)
    route.append([mid_lat, req.end_lng])
    
    # Step 4: End point
    route.append([req.end_lat, req.end_lng])
    
    return {
        "route": route,
        "estimated_time_saved": f"{random.randint(4, 12)} mins",
        "traffic_level": random.choice(["low", "moderate", "high"])
    }

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
