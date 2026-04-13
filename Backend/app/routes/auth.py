from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User as UserModel
from app.auth.jwt import create_access_token    # ← add this import
import bcrypt

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    try:
        # Find user by email
        user = db.query(UserModel).filter(
            UserModel.email == login_data.email
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # Verify password
        if bcrypt.checkpw(
            login_data.password.encode('utf-8'),
            user.password.encode('utf-8')       # ← fix here
        ):
            return TokenResponse(
                access_token=create_access_token({"sub": str(user.id)}),  # ← fix here
                token_type="bearer",
                expires_in=3600
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to login: {e}"
        )