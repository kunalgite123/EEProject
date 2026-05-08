from pydantic import BaseModel, Field
from typing import List, Optional

class EmergencyDetectionRequest(BaseModel):
    vehicle_type: str = Field(..., description="Type of vehicle, e.g., 'car', 'ambulance'")
    siren_detected: bool = Field(..., description="Whether a siren sound was detected")
    image_description: str = Field(..., description="Context or description of the image/feed")

class EmergencyDetectionResponse(BaseModel):
    emergency_detected: bool
    vehicle: str
    priority_level: str
    recommended_action: str

class TrafficSignal(BaseModel):
    id: int
    status: str
    density: int

class TrafficStatusResponse(BaseModel):
    signals: List[TrafficSignal]
    city_congestion: int
    active_emergency: bool

class RouteResponse(BaseModel):
    route: List[List[float]]
    estimated_time_saved: str
    traffic_level: str
