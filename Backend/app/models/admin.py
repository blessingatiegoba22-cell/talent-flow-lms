from sqlalchemy import Column, String, Boolean, DateTime, Enum as SAEnum, Text, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.orm import relationship
from app.models.base import Base
from datetime import datetime
import uuid
import enum


class AdminRole(str, enum.Enum):
    admin = "admin"
    instructor = "instructor"
    learner = "learner"


class ProgramStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    completed = "completed"


class CourseStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    inactive = "inactive"


class Admin(Base):
    __tablename__ = "users"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    identifier = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(AdminRole), nullable=False, default=AdminRole.learner)
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)


class Program(Base):
    """A learning program is a collection of courses e.g 'Backend Engineering Cohort 1'"""
    __tablename__ = "programs"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    identifier = Column(String(50), unique=True, nullable=False)  # e.g TF-PROG-XXXXXX
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SAEnum(ProgramStatus), default=ProgramStatus.active, nullable=False)
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)


class Course(Base):
    """Basic course model - will be extended by teammates"""
    __tablename__ = "courses"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    identifier = Column(String(50), unique=True, nullable=False)  # e.g TF-CRS-XXXXXX
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SAEnum(CourseStatus), default=CourseStatus.draft, nullable=False)
    program_id = Column(CHAR(36), ForeignKey("programs.id"), nullable=True)
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)