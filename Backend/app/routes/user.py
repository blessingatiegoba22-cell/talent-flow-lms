from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from database import get_db
from sqlalchemy.orm import Session, defer
from schemas.user import User as UserSchema, UserResponse, UserUpdate
from models.user import User as UserModel
from middlewares.auth import AuthMiddleware
import bcrypt
import logging
import pymysql

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


def handle_database_error(error: Exception, operation: str = "operation"):
    """Handle database errors consistently"""
    logger.error(f"Failed to {operation}: {error}")
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={
            "status": "error",
            "message": f"Failed to {operation}: {error}",
            "timestamp": f"{datetime.utcnow()}"
        }
    )


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_request: UserSchema, db: Session = Depends(get_db)):
    """Create a new user"""
    try:
        # Check if user already exists
        existing_user = db.query(UserModel).filter(
            (UserModel.email == user_request.email) | 
            (UserModel.phone == user_request.phone)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email or phone already exists"
            )
        
        # Hash password
        salt = bcrypt.gensalt(rounds=12)
        hashed_password = bcrypt.hashpw(user_request.password.encode('utf-8'), salt)
        
        # Create new user
        new_user = UserModel(
            name=user_request.name,
            phone=user_request.phone,
            email=user_request.email,
            password=hashed_password.decode(),
            gender=user_request.gender.value,
            location=user_request.location
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
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Get all users with pagination"""
    try:
        users = db.query(UserModel)\
            .options(defer(UserModel.password))\
            .offset(skip)\
            .limit(limit)\
            .all()
        return users
    except Exception as e:
        handle_database_error(e, "get users")


@router.get("/me", response_model=UserResponse)
def get_current_user(current_user = Depends(AuthMiddleware)):
    """Get current authenticated user"""
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, current_user = Depends(AuthMiddleware), db: Session = Depends(get_db)):
    """Get user by ID"""
    try:
        user = db.query(UserModel)\
            .options(defer(UserModel.password))\
            .filter(UserModel.id == user_id)\
            .first()
        
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


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Update user completely"""
    try:
        user_to_update = db.query(UserModel).filter(UserModel.id == user_id).first()
        
        if not user_to_update:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update all provided fields
        update_data = user_update.dict(exclude_unset=True)
        
        # Handle password hashing if provided
        if "password" in update_data and update_data["password"]:
            salt = bcrypt.gensalt(rounds=12)
            update_data["password"] = bcrypt.hashpw(
                update_data["password"].encode('utf-8'), 
                salt
            ).decode()
        
        for field, value in update_data.items():
            setattr(user_to_update, field, value)
        
        db.commit()
        db.refresh(user_to_update)
        
        return user_to_update
        
    except HTTPException:
        raise
    except Exception as e:
        handle_database_error(e, "update user")


@router.patch("/{user_id}", response_model=UserResponse)
def partial_update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Partially update user"""
    try:
        user_to_update = db.query(UserModel).filter(UserModel.id == user_id).first()
        
        if not user_to_update:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update only provided fields
        update_data = user_update.dict(exclude_unset=True)
        
        # Handle password hashing if provided
        if "password" in update_data and update_data["password"]:
            salt = bcrypt.gensalt(rounds=12)
            update_data["password"] = bcrypt.hashpw(
                update_data["password"].encode('utf-8'), 
                salt
            ).decode()
        
        for field, value in update_data.items():
            setattr(user_to_update, field, value)
        
        db.commit()
        db.refresh(user_to_update)
        
        return user_to_update
        
    except HTTPException:
        raise
    except Exception as e:
        handle_database_error(e, "partial update user")


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Delete user by ID"""
    try:
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
