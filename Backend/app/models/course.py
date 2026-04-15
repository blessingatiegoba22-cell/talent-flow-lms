from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship
from .base import Base
from sqlalchemy.sql import func
import uuid

# Association table for course enrollments
course_enrollments = Table(
    'course_enrollments',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('course_id', Integer, ForeignKey('courses.id'), primary_key=True),
    Column('enrolled_at', DateTime(timezone=True), server_default=func.now()),
    Column('completed_at', DateTime(timezone=True), nullable=True),
    Column('progress', Integer, default=0),  # Progress percentage 0-100
    Column('is_active', Boolean, default=True)
)

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    instructor_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # UUID of instructor
    category = Column(String(100), nullable=True)
    level = Column(String(50), nullable=True)  # beginner, intermediate, advanced
    duration_hours = Column(Integer, nullable=True)
    price = Column(Integer, nullable=True)  # Price in cents
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships will be added in the user model to avoid circular imports
