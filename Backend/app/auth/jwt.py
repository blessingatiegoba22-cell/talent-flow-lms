from jose import jwt, JWTError
import os
from typing import Optional
from datetime import timedelta, datetime

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRATION_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))


def create_access_token(claims: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT with expiry."""
    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY environment variable is not set")

    to_encode = claims.copy()
    expiration_time = datetime.utcnow() + (
        expires_delta if expires_delta
        else timedelta(minutes=ACCESS_TOKEN_EXPIRATION_MINUTES)
    )
    to_encode.update({"exp": expiration_time})
    return jwt.encode(to_encode, SECRET_KEY, ALGORITHM)


def verify_access_token(token: str) -> dict:
    """Decode and verify a JWT. Raises JWTError on failure."""
    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY environment variable is not set")
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
