from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Optional
from database import engine, get_db
from sqlalchemy.orm import Session, defer
from schemas.user import User, UserResponse, UserUpdate
from models import user_model
from middlewares.auth import AuthMiddleware
from fastapi import APIRouter
import bcrypt
import logging
import pymysql

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserResponse)
def get_current_user(current_user = Depends(AuthMiddleware), db: Session = Depends(get_db)):
    return current_user


@router.post("/create", response_model=UserResponse)
def create_user(user_request: User, db: Session = Depends(get_db)):
    user_exists = db.query(user_model).filter((user_model.email == user_request.email) | (user_model.phone == user_request.phone)).first()
    if user_exists:
        raise HTTPException(status_code=404, detail="User already exists!")
          
    salts = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(user_request.password.encode('utf-8'), salts)

    new_user = user_model(
        **user_request.dict(exclude={"password", "confirm_password", "gender"}),
        password=hashed_password.decode(),
        gender = user_request.gender.value
    )

    try:  
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user
    except pymysql.DataError as e:
        raiseError(e)
    except Exception as e:
        raiseError(e)

def raiseError(e):
    logger.error(f"failed to create record error: {e}")
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail = {
            "status": "error",
            "message": f"failed to create user: {e}",
            "timestamp": f"{datetime.utcnow()}"
        }
    )

 

@router.get("/", response_model=list[UserResponse])
def get_users(current_user = Depends(AuthMiddleware), db: Session = Depends(get_db)):
    return db.query(user_model).options(defer(user_model.password)).all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user_with_id(user_id: int, current_user = Depends(AuthMiddleware), db: Session = Depends(get_db)):
    user = db.query(user_model).filter(user_model.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User does not exixts!")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, current_user = Depends(AuthMiddleware), db: Session = Depends(get_db)):
    user_to_update = db.query(user_model).filter(user_model.id == user_id).first()
    if not user_to_update:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "User not found!"
        )
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user_to_update, field, value)
    db.commit()
    db.refresh(user_to_update)
    return user_to_update

@router.patch("/{user_id}", response_model=UserResponse)
def partial_update_user(user_id: int, user_update: UserUpdate, current_user = Depends(AuthMiddleware), db: Session = Depends(get_db)):
    user_to_update = db.query(user_model).filter(user_model.id == user_id).first()
    if not user_to_update:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "User not found!"
        )
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user_to_update, field, value)
    db.commit()
    db.refresh(user_to_update)
    return user_to_update

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(current_user = Depends(AuthMiddleware), db: Session = Depends(get_db)):
    db_user = db.query(user_model).filter(user_model.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User does not exixts!")

    db.delete(db_user)
    db.commit()
    return None
    