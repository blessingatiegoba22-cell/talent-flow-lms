from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.user import User
from datetime import datetime


class Team(Base):
    """A team is a group of users with a shared parameter (e.g. cohort, track, location)"""
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    identifier = Column(String(50), unique=True, nullable=False)  # e.g. TF-TEAM-000001
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    parameter = Column(String(255), nullable=False)  # The grouping parameter (e.g. "cohort-1", "backend-track")
    status = Column(SQLEnum("active", "inactive", name="team_status_enum"), nullable=False, default="active")
    created_by = Column(Integer, ForeignKey("admins.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    # Relationships
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    creator = relationship("Admin", foreign_keys=[created_by])


class TeamMember(Base):
    """Join table linking users to teams"""
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    user = relationship("User")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="members")
    user = relationship("User", foreign_keys=[user_id])
