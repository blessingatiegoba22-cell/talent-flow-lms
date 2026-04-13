from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User as UserModel
from app.auth.jwt import create_access_token
import bcrypt
import os

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

IS_PRODUCTION = os.getenv("ENVIRONMENT", "development").lower() == "production"
COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = 3600  # 1 hour in seconds


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginSuccessResponse(BaseModel):
    message: str
    user_id: int
    email: str


class LogoutResponse(BaseModel):
    message: str


@router.post("/login", response_model=LoginSuccessResponse)
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Login user and set JWT inside an HTTPOnly cookie.
    The token is NOT returned in the response body — it lives in the cookie only.
    """
    try:
        user = db.query(UserModel).filter(
            UserModel.email == login_data.email
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        password_valid = bcrypt.checkpw(
            login_data.password.encode("utf-8"),
            user.password.encode("utf-8")
        )

        if not password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        token = create_access_token({"sub": str(user.id)})

        # Set the JWT inside an HTTPOnly cookie — frontend never touches it directly
        response.set_cookie(
            key=COOKIE_NAME,
            value=token,
            httponly=True,                   # JS cannot read this cookie
            secure=IS_PRODUCTION,            # HTTPS only in production
            samesite="lax",                  # Protects against CSRF
            max_age=COOKIE_MAX_AGE,
            path="/",
        )

        return LoginSuccessResponse(
            message="Login successful",
            user_id=user.id,
            email=user.email
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {e}"
        )


@router.post("/logout", response_model=LogoutResponse)
def logout(response: Response):
    """
    Logout by clearing the HTTPOnly authentication cookie.
    No token needed — just call this endpoint and the browser cookie is erased.
    """
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        path="/",
    )
    return LogoutResponse(message="Logged out successfully")
