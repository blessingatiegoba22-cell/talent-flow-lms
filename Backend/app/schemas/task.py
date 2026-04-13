from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums matching the model enums
class TaskType(str, Enum):
    assignment = "assignment"
    quiz = "quiz"
    project = "project"
    reading = "reading"
    video = "video"


class TaskStatus(str, Enum):
    draft = "draft"
    published = "published"
    closed = "closed"


class SubmissionStatus(str, Enum):
    pending = "pending"
    submitted = "submitted"
    graded = "graded"
    returned = "returned"


class GradeStatus(str, Enum):
    excellent = "excellent"
    good = "good"
    satisfactory = "satisfactory"
    needs_improvement = "needs_improvement"
    fail = "fail"


# Task Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    instructions: Optional[str] = None
    task_type: TaskType = TaskType.assignment
    max_score: int = Field(default=100, ge=1, le=1000)
    due_date: Optional[datetime] = None
    estimated_hours: Optional[int] = Field(None, ge=1)
    allow_file_submission: bool = True
    max_file_size_mb: int = Field(default=10, ge=1, le=100)
    allowed_file_types: str = "pdf,doc,docx,txt"
    course_id: int

    @validator('due_date')
    def validate_due_date(cls, v):
        if v:
            # Parse the datetime if it's a string
            if isinstance(v, str):
                from dateutil.parser import parse
                v = parse(v)
            # Compare with timezone-aware datetime
            if v <= datetime.now(v.tzinfo if v.tzinfo else None):
                raise ValueError('Due date must be in the future')
        return v

    class Config:
        from_attributes = True


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    instructions: Optional[str] = None
    task_type: Optional[TaskType] = None
    status: Optional[TaskStatus] = None
    max_score: Optional[int] = Field(None, ge=1, le=1000)
    due_date: Optional[datetime] = None
    estimated_hours: Optional[int] = Field(None, ge=1)
    allow_file_submission: Optional[bool] = None
    max_file_size_mb: Optional[int] = Field(None, ge=1, le=100)
    allowed_file_types: Optional[str] = None

    @validator('due_date')
    def validate_due_date(cls, v):
        if v and v <= datetime.now():
            raise ValueError('Due date must be in the future')
        return v

    class Config:
        from_attributes = True


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    instructions: Optional[str]
    task_type: TaskType
    status: TaskStatus
    mentor_id: int
    mentor_name: Optional[str] = None
    course_id: int
    max_score: int
    due_date: Optional[datetime]
    estimated_hours: Optional[int]
    allow_file_submission: bool
    max_file_size_mb: int
    allowed_file_types: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    
    # Include related data
    mentor_name: Optional[str] = None
    course_title: Optional[str] = None
    submission_count: Optional[int] = 0

    class Config:
        from_attributes = True


class TaskList(BaseModel):
    tasks: List[TaskOut]
    total: int
    page: int
    per_page: int


# Task Submission Schemas
class TaskSubmissionCreate(BaseModel):
    text_content: Optional[str] = None
    
    class Config:
        from_attributes = True


class TaskSubmissionUpdate(BaseModel):
    text_content: Optional[str] = None
    
    class Config:
        from_attributes = True


class TaskSubmissionOut(BaseModel):
    id: int
    task_id: int
    user_id: int
    text_content: Optional[str]
    file_path: Optional[str]
    file_name: Optional[str]
    file_size: Optional[int]
    status: SubmissionStatus
    submitted_at: Optional[datetime]
    last_updated: datetime
    score: Optional[int]
    grade_status: Optional[GradeStatus]
    mentor_feedback: Optional[str]
    graded_at: Optional[datetime]
    graded_by: Optional[int]
    
    # Include related data
    task_title: Optional[str] = None
    student_name: Optional[str] = None
    mentor_name: Optional[str] = None
    max_score: Optional[int] = None
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# Task Grade Schemas
class TaskGradeCreate(BaseModel):
    score: int = Field(..., ge=0)
    max_score: int = Field(..., ge=1)
    grade_status: GradeStatus
    overall_feedback: Optional[str] = None
    detailed_feedback: Optional[str] = None
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    criteria_scores: Optional[str] = None  # JSON string

    @validator('score')
    def validate_score(cls, v, values):
        if 'max_score' in values and v > values['max_score']:
            raise ValueError('Score cannot exceed max_score')
        return v

    class Config:
        from_attributes = True


class TaskGradeUpdate(BaseModel):
    score: Optional[int] = Field(None, ge=0)
    grade_status: Optional[GradeStatus] = None
    overall_feedback: Optional[str] = None
    detailed_feedback: Optional[str] = None
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    criteria_scores: Optional[str] = None

    class Config:
        from_attributes = True


class TaskGradeOut(BaseModel):
    id: int
    submission_id: int
    mentor_id: int
    score: int
    max_score: int
    grade_status: GradeStatus
    overall_feedback: Optional[str]
    detailed_feedback: Optional[str]
    strengths: Optional[str]
    improvements: Optional[str]
    criteria_scores: Optional[str]
    graded_at: datetime
    updated_at: datetime
    
    # Include related data
    mentor_name: Optional[str] = None
    student_name: Optional[str] = None
    task_title: Optional[str] = None

    class Config:
        from_attributes = True


# File Upload Schemas
class TaskFileCreate(BaseModel):
    file_name: str
    file_path: str
    file_size: int
    file_type: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class TaskFileOut(BaseModel):
    id: int
    task_id: int
    file_name: str
    file_path: str
    file_size: int
    file_type: str
    description: Optional[str]
    uploaded_at: datetime

    class Config:
        from_attributes = True


# Student View Schemas
class StudentTaskView(BaseModel):
    """Simplified view for students"""
    id: int
    title: str
    description: str
    instructions: Optional[str]
    task_type: TaskType
    max_score: int
    due_date: Optional[datetime]
    estimated_hours: Optional[int]
    allow_file_submission: bool
    max_file_size_mb: int
    allowed_file_types: str
    published_at: Optional[datetime]
    
    # Student-specific info
    submission_status: Optional[SubmissionStatus] = None
    submitted_at: Optional[datetime] = None
    score: Optional[int] = None
    grade_status: Optional[GradeStatus] = None
    mentor_feedback: Optional[str] = None

    class Config:
        from_attributes = True


class MentorTaskView(BaseModel):
    """Enhanced view for mentors"""
    id: int
    title: str
    description: str
    instructions: Optional[str]
    task_type: TaskType
    status: TaskStatus
    max_score: int
    due_date: Optional[datetime]
    estimated_hours: Optional[int]
    created_at: datetime
    published_at: Optional[datetime]
    
    # Mentor-specific info
    submission_count: int = 0
    graded_count: int = 0
    pending_count: int = 0
    average_score: Optional[float] = None

    class Config:
        from_attributes = True


# API Response Schemas
class TaskResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None

    class Config:
        from_attributes = True


class SubmissionResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None

    class Config:
        from_attributes = True
    success: bool = True
    message: str
    data: Optional[dict] = None

    class Config:
        from_attributes = True
