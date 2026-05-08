from fastapi import APIRouter, HTTPException
from app.models.schemas import EmergencyDetectionRequest, EmergencyDetectionResponse
from app.services.claude_service import analyze_emergency

router = APIRouter()

@router.post("/detect-emergency", response_model=EmergencyDetectionResponse)
async def detect_emergency(request: EmergencyDetectionRequest):
    """
    Endpoint to detect emergency vehicles using AI.
    Simulates sending feed data to Claude for advanced classification.
    """
    try:
        result = await analyze_emergency(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process emergency detection: {str(e)}")
