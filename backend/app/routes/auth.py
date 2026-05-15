from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import bcrypt
from app.database import get_db, User, AuditLog
from datetime import datetime
import secrets

router = APIRouter()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        # Log failed attempt
        db.add(AuditLog(user=credentials.username, action="LOGIN_FAILED", details="Invalid credentials attempted"))
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid username or password")
        
    token = secrets.token_hex(32)
    
    # Log success
    db.add(AuditLog(user=credentials.username, action="LOGIN_SUCCESS", details=f"User {credentials.username} authenticated successfully. Role: {user.role}"))
    db.commit()
    
    return {"token": token, "role": user.role, "message": "Authentication successful"}
