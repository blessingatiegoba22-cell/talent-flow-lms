from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.models.base import Base
from datetime import datetime
from app.core.enums import AdminRole


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    identifier = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(SQLEnum(AdminRole, name="admin_role"), nullable=False,default=AdminRole.admin)
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)


class Program(Base):
    """A learning program is a collection of courses e.g 'Backend Engineering Cohort 1'"""
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    identifier = Column(String(50), unique=True, nullable=False)  # e.g TF-PROG-XXXXXX
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum("active", "inactive", "completed", name="program_status_enum"),nullable=False,default="active"
)
    created_by = Column(Integer, ForeignKey("admins.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)


class Course(Base):
    """Basic course model - will be extended by teammates"""
    __tablename__ = "admin_courses"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    identifier = Column(String(50), unique=True, nullable=False)  # e.g TF-CRS-XXXXXX
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum("draft", "active", "inactive", name="course_status_enum"),nullable=False,default="draft")
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("admins.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)