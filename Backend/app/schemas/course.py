from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class CourseLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class CourseStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

class CourseBase(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[CourseLevel] = None
    duration_hours: Optional[int] = Field(default=None, ge=1)
    price: Optional[int] = Field(default=None, ge=0)  # Price in cents

class CourseCreate(CourseBase):
    instructor_id: Optional[str] = None  # Admin can specify which instructor teaches the course

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[CourseLevel] = None
    duration_hours: Optional[int] = Field(default=None, ge=1)
    price: Optional[int] = Field(default=None, ge=0)
    is_published: Optional[bool] = None

class CourseResponse(CourseBase):
    id: int
    instructor_id: Optional[str] = None
    is_published: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    enrollment_count: Optional[int] = 0

    class Config:
        from_attributes = True

class CourseEnrollment(BaseModel):
    course_id: int
    user_id: int
    progress: int = Field(ge=0, le=100)
    enrolled_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class CourseEnrollmentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    level: Optional[CourseLevel]
    duration_hours: Optional[int]
    price: Optional[int]
    progress: int
    enrolled_at: Optional[datetime]
    completed_at: Optional[datetime]
    instructor_name: Optional[str]

    class Config:
        from_attributes = True

class UserCourseResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    progress: int
    enrolled_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True
