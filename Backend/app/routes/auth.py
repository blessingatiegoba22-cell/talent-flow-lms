from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User as UserModel
from app.middlewares.auth import AuthMiddleware
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from app.auth.token_blacklist import add_to_blacklist

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dd876043d55eebc302f01b3deeb99d8e5c3dceaf92675427c11067963fdefc55")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int = 3600

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    try:
        # Find user by email
        user = db.query(UserModel).filter(UserModel.email == login_data.email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify password
        if bcrypt.checkpw(login_data.password.encode('utf-8'), user.password.encode('utf-8')):
            # Create JWT token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": str(user.id), "email": user.email}, 
                expires_delta=access_token_expires
            )
            
            return TokenResponse(
                access_token=access_token,
                token_type="bearer",
                expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Convert to seconds
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

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/logout")
def logout(request: Request):
    """Logout user by blacklisting JWT token"""
    try:
        # Debug: Print all headers
        print(f"All headers: {dict(request.headers)}")
        
        # Get Authorization header - try multiple ways
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            auth_header = request.headers.get("authorization")
        
        print(f"Auth header found: {auth_header}")

        if not auth_header:
            return {"message": "No token provided - already logged out"}

        # Format: Bearer <token>
        try:
            token = auth_header.split(" ")[1]
            print(f"Extracted token: {token[:20]}...")
        except IndexError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token format"
            )

        # Add token to blacklist
        add_to_blacklist(token)
        print(f"Token added to blacklist")

        return {
            "message": "Successfully logged out"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Logout error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Logout failed: {str(e)}"
        )
