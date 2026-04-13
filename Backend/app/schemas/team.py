from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# --- Team Schemas ---

class TeamCreate(BaseModel):
    """Admin creates a team with a grouping parameter"""
    name: str
    description: Optional[str] = None
    parameter: str  # The shared attribute used to group users (e.g. "cohort-1", "backend-track")


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parameter: Optional[str] = None
    status: Optional[str] = None  # "active" or "inactive"


class TeamMemberOut(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_email: str
    is_active: bool
    joined_at: datetime

    class Config:
        from_attributes = True


class TeamOut(BaseModel):
    id: int
    identifier: str
    name: str
    description: Optional[str]
    parameter: str
    status: str
    created_by: int
    created_at: datetime
    members: List[TeamMemberOut] = []

    class Config:
        from_attributes = True


class TeamOutSimple(BaseModel):
    """Lightweight response without member list (for list endpoints)"""
    id: int
    identifier: str
    name: str
    description: Optional[str]
    parameter: str
    status: str
    created_by: int
    created_at: datetime
    member_count: int = 0

    class Config:
        from_attributes = True


# --- Team Member Schemas ---

class AddMembersRequest(BaseModel):
    """Admin adds one or more users to a team by their user IDs"""
    user_ids: List[int]


class RemoveMemberRequest(BaseModel):
    user_id: int
