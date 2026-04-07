from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User as UserModel
from app.auth.jwt import create_access_token
from datetime import timedelta
import bcrypt
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/mentor/auth",
    tags=["mentor authentication"]
)

class MentorLoginRequest(BaseModel):
    email: str
    password: str

class MentorTokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    mentor: dict

@router.post("/login", response_model=MentorTokenResponse)
def mentor_login(login_data: MentorLoginRequest, db: Session = Depends(get_db)):
    """Mentor login endpoint"""
    # Find user by email
    user = db.query(UserModel).filter(UserModel.email == login_data.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if user is a mentor
    if user.role != "mentor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to mentors only"
        )
    
    # Verify password
    try:
        if not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password.encode('utf-8')):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "name": user.name
    }
    
    access_token = create_access_token(
        claims=token_data,
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 1800,  # 30 minutes in seconds
        "mentor": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
