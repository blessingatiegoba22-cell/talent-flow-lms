from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from .base import Base
from sqlalchemy.sql import func
from datetime import datetime


class Team(Base):
    """Team model for organizing users into teams"""
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    max_members = Column(Integer, nullable=False, default=10)
    status = Column(
        SQLEnum("active", "inactive", "archived", name="team_status_enum"),
        nullable=False,
        default="active"
    )
    
    # Relationships
    created_by = Column(Integer, ForeignKey("admins.id"), nullable=False)
    team_lead_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    creator = relationship("Admin", back_populates="created_teams")
    team_lead = relationship("User", foreign_keys=[team_lead_id])
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    courses = relationship("TeamCourse", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    """Team member model for tracking user-team relationships"""
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(
        SQLEnum("member", "lead", "assistant", name="team_role_enum"),
        nullable=False,
        default="member"
    )
    joined_at = Column(DateTime(timezone=True, server_default=func.now(), nullable=False)
    left_at = Column(DateTime(timezone=True, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")


class TeamCourse(Base):
    """Team-course relationship model"""
    __tablename__ "team_courses"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("admin_courses.id"), nullable=False)
    assigned_at = Column(DateTime(timezone=True, server_default=func.now(), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    team = relationship("Team", back_populates="courses")
    course = relationship("Course", back_populates="teams")
