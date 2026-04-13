from fastapi import Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.jwt import verify_access_token
from app.models.user import User
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

COOKIE_NAME = "access_token"


class JWTBearer(HTTPBearer):
    """
    Auth middleware that reads the JWT from:
      1. HTTPOnly cookie (preferred — set by /auth/login)
      2. Authorization: Bearer <token> header (fallback for API clients)
    """

    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=False)  # We handle errors ourselves
        self.auto_error = auto_error

    async def __call__(self, request: Request, db: Session = Depends(get_db)):
        # 1. Try cookie first
        token = request.cookies.get(COOKIE_NAME)

        # 2. Fall back to Authorization header
        if not token:
            credentials: HTTPAuthorizationCredentials = await super().__call__(request)
            if credentials and credentials.scheme.lower() == "bearer":
                token = credentials.credentials

        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "message": "Not authenticated. Please log in.",
                    "timestamp": datetime.utcnow().isoformat()
                }
            )

        return self._verify_jwt(token, db)

    def _verify_jwt(self, token: str, db: Session) -> User:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "message": "Invalid or expired token. Please log in again.",
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        try:
            payload = verify_access_token(token)
            user_id = payload.get("sub")
            if user_id is None:
                raise credentials_exception

            user = db.query(User).filter(User.id == int(user_id)).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail={
                        "message": "User account no longer exists.",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            return user

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"JWT verification failed: {e}")
            raise credentials_exception


AuthMiddleware = JWTBearer()
