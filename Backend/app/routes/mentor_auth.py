from fastapi import APIRouter, HTTPException, status, Depends, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User as UserModel
from app.auth.jwt import create_access_token
from datetime import timedelta
import bcrypt
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/mentor/auth",
    tags=["mentor authentication"]
)

IS_PRODUCTION = os.getenv("ENVIRONMENT", "development").lower() == "production"
COOKIE_NAME = "access_token"


class MentorLoginRequest(BaseModel):
    email: EmailStr
    password: str


class MentorLoginResponse(BaseModel):
    message: str
    mentor_id: int
    name: str
    email: str
    role: str


@router.post("/login", response_model=MentorLoginResponse)
def mentor_login(login_data: MentorLoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Mentor login — sets JWT in HTTPOnly cookie (same flow as user login).
    BUG FIX: was returning raw token in body; now uses cookie like /auth/login.
    """
    user = db.query(UserModel).filter(UserModel.email == login_data.email).first()

    # BUG FIX: original checked role before password — leaked which emails are mentors.
    # Check password first, then role.
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    try:
        password_valid = bcrypt.checkpw(
            login_data.password.encode("utf-8"),
            user.password.encode("utf-8")
        )
    except Exception:
        password_valid = False

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if user.role != "mentor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to mentors only"
        )

    token = create_access_token(
        claims={"sub": str(user.id), "email": user.email, "role": user.role},
        expires_delta=timedelta(hours=1)
    )

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        max_age=3600,
        path="/",
    )

    return MentorLoginResponse(
        message="Login successful",
        mentor_id=user.id,
        name=user.name,
        email=user.email,
        role=user.role
    )
