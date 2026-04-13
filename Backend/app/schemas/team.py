from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class TeamStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    archived = "archived"


class TeamRole(str, Enum):
    member = "member"
    lead = "lead"
    assistant = "assistant"


class TeamCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    max_members: int = Field(default=10, ge=1, le=50)
    status: TeamStatus = TeamStatus.active
    team_lead_id: Optional[int] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    max_members: Optional[int] = Field(None, ge=1, le=50)
    status: Optional[TeamStatus] = None
    team_lead_id: Optional[int] = None


class TeamOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    max_members: int
    status: TeamStatus
    created_by: int
    team_lead_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    # Additional fields
    member_count: int = 0
    lead_name: Optional[str] = None
    lead_email: Optional[str] = None
    
    class Config:
        from_attributes = True


class TeamMemberCreate(BaseModel):
    user_id: int
    role: TeamRole = TeamRole.member
    team_lead_id: Optional[int] = None


class TeamMemberUpdate(BaseModel):
    role: Optional[TeamRole] = None
    team_lead_id: Optional[int] = None
    is_active: Optional[bool] = None


class TeamMemberOut(BaseModel):
    id: int
    team_id: int
    user_id: int
    role: TeamRole
    joined_at: datetime
    left_at: Optional[datetime]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    # Additional fields
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    team_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class TeamCourseCreate(BaseModel):
    course_id: int


class TeamCourseOut(BaseModel):
    id: int
    team_id: int
    course_id: int
    assigned_at: datetime
    created_at: datetime
    updated_at: datetime
    
    # Additional fields
    team_name: Optional[str] = None
    course_title: Optional[str] = None
    
    class Config:
        from_attributes = True


class TeamList(BaseModel):
    teams: List[TeamOut]
    total: int
    page: int
    per_page: int


class TeamDetail(BaseModel):
    team: TeamOut
    members: List[TeamMemberOut]
    courses: List[TeamCourseOut]
    member_count: int
    course_count: int
