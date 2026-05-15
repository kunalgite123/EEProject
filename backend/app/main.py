import os
import logging
import asyncio
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import routes
from app.routes.emergency import router as emergency_router
from app.routes.route import router as route_router
from app.routes.traffic import router as traffic_router
from app.routes.auth import router as auth_router
from app.routes.settings import router as settings_router
from app.routes.ai import router as ai_router

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Smart Traffic Management API",
    description="Backend API for real-time traffic monitoring and emergency route optimization",
    version="1.0.0"
)

# CORS configuration - allow localhost:5173 (Vite default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(emergency_router, prefix="/api", tags=["Emergency"])
app.include_router(route_router, prefix="/api", tags=["Route Optimization"])
app.include_router(traffic_router, prefix="/api", tags=["Traffic Status"])
app.include_router(auth_router, prefix="/api", tags=["Auth"])
app.include_router(settings_router, prefix="/api", tags=["Settings"])
app.include_router(ai_router, prefix="/api", tags=["AI Generation"])

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "ok", "message": "Smart Traffic System Backend is fully operational."}

# Bonus: WebSocket support for future real-time pushed updates
@app.websocket("/ws/traffic")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time traffic updates.
    Pushes data continuously to connected clients, replacing polling.
    """
    await websocket.accept()
    logger.info("WebSocket connection established")
    try:
        while True:
            # Generate simulated telemetry
            payload = {
                "type": "TELEMETRY",
                "active_emergency": random.random() > 0.95, # 5% chance of random emergency
                "signals": [
                    {"id": 1, "density": random.randint(10, 95)},
                    {"id": 2, "density": random.randint(10, 95)},
                    {"id": 3, "density": random.randint(10, 95)},
                    {"id": 4, "density": random.randint(10, 95)},
                ]
            }
            await websocket.send_json(payload)
            await asyncio.sleep(2)  # Push every 2 seconds
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
