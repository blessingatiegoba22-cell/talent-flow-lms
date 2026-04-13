from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from fastapi import Request,Depends,HTTPException,status
from app.database import get_db
from sqlalchemy.orm import Session
from app.auth.jwt import verify_access_token
from app.models.user import User as UserModel
import logging
from datetime import datetime


logger = logging.getLogger(__name__)

# HttpBearer is responsible for extracting Bearer token from authorization headers
security = HTTPBearer()




class JWTBearer(HTTPBearer):

    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request, db: Session = Depends(get_db)):
        try:
            # Get credentials using the parent class method
            credentials = await super().__call__(request)
            
            # Validate Credentials
            if credentials:
                if credentials.scheme != 'Bearer':
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid authorization scheme. expected 'Bearer'",
                        headers={"WWW-Authenticate": "Bearer"},
                    )

                return self.verify_jwt(credentials.credentials, db)
                
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authorization code",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    def verify_jwt(self, token: str, db: Session):
        try:
            payload = verify_access_token(token)
            user_id = payload.get('sub')
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )

            user = db.query(UserModel).filter(UserModel.id == int(user_id)).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User does not exist"
                )

            return user

        except Exception as e:
            # Handle JWT errors including blacklisted tokens
            error_msg = str(e).lower()
            if "revoked" in error_msg or "expired" in error_msg or "invalid" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token is invalid or has been revoked"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"JWT verification failed: {str(e)}"
                )

def raiseHttpException(e, status=status.HTTP_403_FORBIDDEN):
    raise HTTPException(
        status_code= status,
        detail= {
            "message": e,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

AuthMiddleware = JWTBearer()