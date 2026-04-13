from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum


# class UserRole(str, Enum):
#     admin = "admin"
#     instructor = "instructor"
#     learner = "learner"

# --- Staff Management Schemas ---
class StaffRole(str, Enum):
    admin = "admin"
    instructor = "instructor"



class ProgramStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    completed = "completed"


class CourseStatus(str, Enum):
    draft = "draft"
    active = "active"
    inactive = "inactive"


# --- Auth Schemas ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminOut(BaseModel):
    id: int
    identifier: str
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminOut


# --- User Management Schemas ---
# No longer used - admin does not create learners
# class UserCreate(BaseModel):
#     full_name: str
#     email: EmailStr
#     password: str
#     role: UserRole

class StaffCreate(BaseModel):
    """Admin creates instructor or admin accounts only"""
    name: str
    email: EmailStr
    password: str
    role: StaffRole #admin or instructor

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[StaffRole] = None
    is_active: Optional[bool] = None


class UserOut(BaseModel):
    id: int
    identifier: str
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Program ---
class ProgramCreate(BaseModel):
    title: str
    description: Optional[str] = None


class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProgramStatus] = None


class ProgramOut(BaseModel):
    id: int
    identifier: str
    title: str
    description: Optional[str]
    status: str
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Course ---
class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    program_id: Optional[int] = None


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[CourseStatus] = None
    program_id: Optional[int] = None


class CourseOut(BaseModel):
    id: int
    identifier: str
    title: str
    description: Optional[str]
    status: str
    program_id: Optional[int]
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class MentorCreate(BaseModel):
    email: str
    bio: Optional[str] = None
    expertise: Optional[str] = None
    experience_years: Optional[int] = None

class MentorOut(BaseModel):
    id: int
    user_id: int
    bio: Optional[str]
    expertise: Optional[str]
    experience_years: Optional[int]
    rating: Optional[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MentorAssignmentCreate(BaseModel):
    """Admin assigns a mentor to a learner for a specific course"""
    mentor_id: int
    user_id: int
    course_id: int
    notes: Optional[str] = None


class MentorAssignmentOut(BaseModel):
    id: int
    mentor_id: int
    user_id: int
    course_id: int
    is_active: bool
    notes: Optional[str]
    assigned_at: datetime

    class Config:
        from_attributes = True


# --- Report ---
class ReportOut(BaseModel):
    total_learners: int
    total_instructors: int
    total_active_users: int
    total_courses: int
    total_programs: int
    active_courses: int
    inactive_courses: int
    draft_courses: int


# --- API Response ---
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict | list] = None