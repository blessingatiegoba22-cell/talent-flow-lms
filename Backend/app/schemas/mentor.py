from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MentorBase(BaseModel):
    bio: Optional[str] = None
    expertise: Optional[str] = None
    experience_years: Optional[int] = Field(default=None, ge=0)
    rating: Optional[int] = Field(default=0, ge=1, le=5)

class MentorCreate(MentorBase):
    pass  # user_id will be auto-determined from email

class MentorUpdate(BaseModel):
    bio: Optional[str] = None
    expertise: Optional[str] = None
    experience_years: Optional[int] = Field(default=None, ge=0)
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    is_active: Optional[bool] = None

class MentorResponse(MentorBase):
    id: int
    user_id: int
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Include user info
    user_name: Optional[str] = None
    user_email: Optional[str] = None

    class Config:
        from_attributes = True

class MentorAssignmentResponse(BaseModel):
    id: int
    mentor_id: int
    user_id: int
    course_id: int
    assigned_at: Optional[datetime] = None
    is_active: bool
    notes: Optional[str] = None
    
    # Include related info
    mentor_name: Optional[str] = None
    mentor_expertise: Optional[str] = None
    user_name: Optional[str] = None
    course_title: Optional[str] = None

    class Config:
        from_attributes = True

class MentorAssignment(BaseModel):
    mentor_id: int
    user_id: int
    course_id: int
    notes: Optional[str] = None
