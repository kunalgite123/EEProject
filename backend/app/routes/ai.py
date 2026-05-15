from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db, AuditLog
import anthropic
import os
import random
from datetime import datetime

router = APIRouter()

@router.get("/generate-report")
async def generate_incident_report(db: Session = Depends(get_db)):
    """
    Generates a human-readable summary of the latest system events using an LLM.
    """
    # Fetch recent logs
    recent_logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(15).all()
    
    if not recent_logs:
        return {"report": "No recent events to summarize."}
        
    log_text = "\n".join([f"[{l.timestamp.strftime('%H:%M:%S')}] {l.user} performed {l.action}: {l.details}" for l in recent_logs])
    
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if api_key and api_key != "your_api_key_here":
        try:
            client = anthropic.Anthropic(api_key=api_key)
            prompt = f"You are an AI Traffic Command Center assistant. Summarize the following recent system logs into a brief, professional 2-paragraph incident report for the city mayor. Highlight any emergencies or anomalies:\n\n{log_text}"
            
            message = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=300,
                temperature=0.3,
                system="You are an expert traffic analyst.",
                messages=[{"role": "user", "content": prompt}]
            )
            report_content = message.content[0].text
        except Exception as e:
            report_content = f"[AI Generation Failed - using fallback]\n\nRecent Activity Summary:\n- {len(recent_logs)} events recorded recently.\n- Primary active user: {recent_logs[0].user}.\n- Last action: {recent_logs[0].action}."
    else:
        # Mock Report
        anomalies = len([l for l in recent_logs if "FAILED" in l.action])
        report_content = f"### AI Incident Report (Simulated)\n\nOver the last operational period, the AI Nexus recorded {len(recent_logs)} critical system events. The network is currently running at optimal efficiency with {anomalies} anomalies detected.\n\nAn emergency ambulance routing protocol was successfully handled by the AI, reducing transit time by an estimated 8 minutes. No further manual intervention is required at this time."

    return {
        "status": "success",
        "timestamp": datetime.utcnow().isoformat(),
        "report": report_content
    }
