import os
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import routes
from app.routes.emergency import router as emergency_router
from app.routes.route import router as route_router
from app.routes.traffic import router as traffic_router

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

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "ok", "message": "Smart Traffic System Backend is fully operational."}

# Bonus: WebSocket support for future real-time pushed updates
@app.websocket("/ws/traffic")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time traffic updates.
    Can be used by the frontend to replace polling.
    """
    await websocket.accept()
    logger.info("WebSocket connection established")
    try:
        while True:
            # In a real app, this would wait for events via PubSub or Event Emitter.
            # Here we just keep the connection alive.
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
