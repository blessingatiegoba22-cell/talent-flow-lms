from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from .base import Base
from sqlalchemy.sql import func
from datetime import datetime


class Task(Base):
    """Task/Assignment created by mentors for students"""
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    instructions = Column(Text, nullable=True)
    task_type = Column(Enum("assignment", "quiz", "project", "reading", "video", name="task_type_enum"), nullable=False, default="assignment")
    status = Column(Enum("draft", "published", "closed", name="task_status_enum"), nullable=False, default="draft")
    
    # Relationships
    mentor_id = Column(Integer, ForeignKey('mentors.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    
    # Task details
    max_score = Column(Integer, nullable=False, default=100)
    due_date = Column(DateTime(timezone=True), nullable=True)
    estimated_hours = Column(Integer, nullable=True)
    
    # File attachments support
    allow_file_submission = Column(Boolean, default=True)
    max_file_size_mb = Column(Integer, default=10)
    allowed_file_types = Column(String(255), default="pdf,doc,docx,txt")  # Comma-separated
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    mentor = relationship("Mentor")
    submissions = relationship("TaskSubmission", back_populates="task", cascade="all, delete-orphan")


class TaskSubmission(Base):
    """Student submission for a task"""
    __tablename__ = 'task_submissions'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Submission content
    text_content = Column(Text, nullable=True)  # For text-based submissions
    file_path = Column(String(500), nullable=True)  # For file submissions
    file_name = Column(String(255), nullable=True)
    file_size = Column(Integer, nullable=True)
    
    # Status tracking
    status = Column(Enum("pending", "submitted", "graded", "returned", name="submission_status_enum"), nullable=False, default="pending")
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Grading
    score = Column(Integer, nullable=True)
    grade_status = Column(Enum("excellent", "good", "satisfactory", "needs_improvement", "fail", name="grade_status_enum"), nullable=True)
    mentor_feedback = Column(Text, nullable=True)
    graded_at = Column(DateTime(timezone=True), nullable=True)
    graded_by = Column(Integer, ForeignKey('mentors.id'), nullable=True)

    # Relationships
    task = relationship("Task", back_populates="submissions")
    student = relationship("User")
    grader = relationship("Mentor", foreign_keys=[graded_by])
    grade = relationship("TaskGrade", back_populates="submission", uselist=False, cascade="all, delete-orphan")


class TaskGrade(Base):
    """Detailed grading information for a submission"""
    __tablename__ = 'task_grades'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    submission_id = Column(Integer, ForeignKey('task_submissions.id'), nullable=False)
    mentor_id = Column(Integer, ForeignKey('mentors.id'), nullable=False)
    
    # Grading details
    score = Column(Integer, nullable=False)
    max_score = Column(Integer, nullable=False)
    grade_status = Column(Enum("excellent", "good", "satisfactory", "needs_improvement", "fail", name="grade_status_enum"), nullable=False)
    
    # Feedback
    overall_feedback = Column(Text, nullable=True)
    detailed_feedback = Column(Text, nullable=True)  # JSON or structured feedback
    strengths = Column(Text, nullable=True)
    improvements = Column(Text, nullable=True)
    
    # Grading criteria (can be JSON)
    criteria_scores = Column(Text, nullable=True)  # JSON string for criteria-based grading
    
    # Timestamps
    graded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    submission = relationship("TaskSubmission", back_populates="grade")
    mentor = relationship("Mentor")


class TaskFile(Base):
    """File attachments for tasks"""
    __tablename__ = 'task_files'

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    
    # File information
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String(100), nullable=False)
    
    # Description
    description = Column(Text, nullable=True)
    
    # Timestamps
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    task = relationship("Task")
