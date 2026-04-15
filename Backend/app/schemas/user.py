import re
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from datetime import datetime
from typing import Optional
from app.models.enums import RoleEnum
from enum import Enum


class StudentSignup(BaseModel):
    name: str = Field(min_length=4, max_length=30)
    email: EmailStr
    password: str = Field(min_length=6, max_length=24)
    confirm_password: str

    @field_validator("name")
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Cannot be empty")
        return v

    @field_validator("password")
    def validate_password(cls, value):
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit.")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Password must contain at least one special character.")
        return value

    @model_validator(mode='after')
    def validate_confirm_password(self):
        if self.password != self.confirm_password:
            raise ValueError('Passwords must match')
        return self


class MentorSignup(BaseModel):
    name: str = Field(min_length=4, max_length=30)
    email: EmailStr
    password: str = Field(min_length=6, max_length=24)
    confirm_password: str

    @field_validator("name")
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Cannot be empty")
        return v

    @field_validator("password")
    def validate_password(cls, value):
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit.")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Password must contain at least one special character.")
        return value

    @model_validator(mode='after')
    def validate_confirm_password(self):
        if self.password != self.confirm_password:
            raise ValueError('Passwords must match')
        return self


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: RoleEnum
    verified: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=4, max_length=30)
    email: Optional[str] = None
    password: Optional[str] = None

    @field_validator('password')
    def validate_password(cls, v):
        if v is None:
            return v
        if not (8 <= len(v) <= 24):
            raise ValueError('Password must be between 8 and 24 characters long')
        if not any(c.isalpha() for c in v):
            raise ValueError('Password must contain at least one letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

    class Config:
        from_attributes = True