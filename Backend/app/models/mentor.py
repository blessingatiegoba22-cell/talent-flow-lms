from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from .base import Base
from sqlalchemy.sql import func
from datetime import datetime

class Mentor(Base):
    __tablename__ = 'mentors'

    id = Column(Integer, primary_key=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    bio = Column(Text, nullable=True)
    expertise = Column(String(255), nullable=True)  # e.g., "Python, Web Development"
    experience_years = Column(Integer, nullable=True)
    rating = Column(Integer, default=0)  # 1-5 rating
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    mentees = relationship("MentorAssignment", back_populates="mentor")

class MentorAssignment(Base):
    __tablename__ = 'mentor_assignments'

    id = Column(Integer, primary_key=True, nullable=False, index=True)
    mentor_id = Column(Integer, ForeignKey('mentors.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_active = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)  # Mentor notes about the mentee

    # Relationships
    mentor = relationship("Mentor", back_populates="mentees")
    user = relationship("User")
    # course = relationship("CourseModel")
