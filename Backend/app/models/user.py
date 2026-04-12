from sqlalchemy import Integer, Column, String, DateTime, Enum
from .base import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship



class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    gender = Column(Enum("male", "female", name="gender_enum"), nullable=False)
    role = Column(Enum("student", "admin", "mentor", name="role_enum"), default="student", nullable=False)
    verified = Column(Enum("verified", "unverified", name="reputation_enum"), default="unverified", nullable=False)
    location = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)