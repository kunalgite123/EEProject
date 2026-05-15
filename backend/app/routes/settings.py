from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db, AuditLog

router = APIRouter()

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
async def change_password(request: PasswordChangeRequest):
    # Dummy implementation
    if request.current_password != "admin123":
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    return {"status": "success", "message": "Password changed successfully."}

@router.post("/toggle-2fa")
async def toggle_2fa():
    # Toggle 2FA status - just mock success
    return {"status": "success", "message": "Two-Factor Authentication toggled.", "enabled": True}

@router.get("/active-sessions")
async def get_active_sessions():
    return {
        "status": "success",
        "sessions": [
            {"id": "ses_1", "ip": "192.168.1.104", "device": "Chrome / Windows 11", "last_active": "Just now", "current": True},
            {"id": "ses_2", "ip": "10.0.0.42", "device": "Safari / iOS", "last_active": "2 hours ago", "current": False}
        ]
    }

@router.get("/export-logs")
async def export_logs():
    # Simulate a log export link
    return {
        "status": "success", 
        "download_url": "/api/download/system_logs_2026.csv",
        "message": "Logs aggregated successfully."
    }

@router.post("/clear-cache")
async def clear_cache():
    # Simulate clearing redis/memcache
    return {"status": "success", "message": "System cache and temporary files cleared. 1.2GB freed."}

@router.post("/reset-analytics")
async def reset_analytics():
    return {"status": "success", "message": "Analytics database indices reset. Live data stream restarted."}

@router.get("/audit-logs")
async def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(50).all()
    return {
        "status": "success",
        "logs": [{"id": l.id, "user": l.user, "action": l.action, "timestamp": l.timestamp.isoformat(), "details": l.details} for l in logs]
    }
