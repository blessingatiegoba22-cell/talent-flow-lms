from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List
from app.database import get_db
from sqlalchemy.orm import Session, defer
from app.schemas.user import User as UserSchema, UserResponse, UserUpdate
from app.models.user import User as UserModel
from app.middlewares.auth import AuthMiddleware
import bcrypt
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


def handle_database_error(error: Exception, operation: str = "operation"):
    logger.error(f"Failed to {operation}: {error}")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={
            "status": "error",
            "message": f"Failed to {operation}",
            "timestamp": datetime.utcnow().isoformat()
        }
    )


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserSchema, db: Session = Depends(get_db)):
    """Register a new user."""
    try:
        if db.query(UserModel).filter(UserModel.email == user.email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        if db.query(UserModel).filter(UserModel.phone == user.phone).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Phone number already registered"
            )

        hashed_password = bcrypt.hashpw(
            user.password.encode("utf-8"),
            bcrypt.gensalt(rounds=12)
        ).decode("utf-8")

        new_user = UserModel(
            name=user.name,
            phone=user.phone,
            email=user.email,
            password=hashed_password,
            gender=user.gender,
            location=user.location
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    except HTTPException:
        raise
    except Exception as e:
        handle_database_error(e, "create user")


@router.get("/", response_model=List[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    current_user=Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Get all users (authenticated). Admin use only."""
    try:
        users = (
            db.query(UserModel)
            .options(defer(UserModel.password))
            .offset(skip)
            .limit(min(limit, 100))
            .all()
        )
        return users
    except Exception as e:
        handle_database_error(e, "get users")


@router.get("/me", response_model=UserResponse)
def get_current_user(current_user=Depends(AuthMiddleware)):
    """Get the currently authenticated user's profile."""
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user=Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Get a user by ID."""
    try:
        user = (
            db.query(UserModel)
            .options(defer(UserModel.password))
            .filter(UserModel.id == user_id)
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        handle_database_error(e, "get user")


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user=Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """
    Partially update a user.
    Uses PATCH (not PUT) because all fields are optional.
    Users may only update themselves; admin bypass can be added later.
    """
    try:
        if current_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own profile"
            )

        user_to_update = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user_to_update:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        update_data = user_update.dict(exclude_unset=True)

        if "password" in update_data and update_data["password"]:
            update_data["password"] = bcrypt.hashpw(
                update_data["password"].encode("utf-8"),
                bcrypt.gensalt(rounds=12)
            ).decode("utf-8")

        for field, value in update_data.items():
            setattr(user_to_update, field, value)

        db.commit()
        db.refresh(user_to_update)
        return user_to_update

    except HTTPException:
        raise
    except Exception as e:
        handle_database_error(e, "update user")


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_user=Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Delete user. Users can only delete themselves."""
    try:
        if current_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own account"
            )

        user_to_delete = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user_to_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        db.delete(user_to_delete)
        db.commit()
        return None

    except HTTPException:
        raise
    except Exception as e:
        handle_database_error(e, "delete user")
