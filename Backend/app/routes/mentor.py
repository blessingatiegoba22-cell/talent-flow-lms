from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.database import get_db
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, and_, or_
from app.schemas.mentor import MentorCreate, MentorResponse, MentorUpdate, MentorAssignmentResponse
from app.models.mentor import Mentor, MentorAssignment
from app.models.user import User as UserModel
from app.models.course import Course as CourseModel
from app.middlewares.auth import AuthMiddleware
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/mentors",
    tags=["mentors"]
)

@router.get("/", response_model=List[MentorResponse])
def get_mentors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    expertise: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all mentors"""
    try:
        query = db.query(Mentor, UserModel).join(UserModel, Mentor.user_id == UserModel.id)
        
        if expertise:
            query = query.filter(Mentor.expertise.ilike(f"%{expertise}%"))
        
        mentors = query.offset(skip).limit(limit).all()
        
        mentor_list = []
        for mentor, user in mentors:
            mentor_dict = MentorResponse.model_validate(mentor)
            mentor_dict.user_name = user.name
            mentor_dict.user_email = user.email
            mentor_list.append(mentor_dict)
        
        return mentor_list
        
    except Exception as e:
        logger.error(f"Failed to get mentors: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get mentors"
        )

@router.get("/{mentor_id}", response_model=MentorResponse)
def get_mentor(mentor_id: int, db: Session = Depends(get_db)):
    """Get a specific mentor by ID"""
    try:
        mentor = db.query(Mentor, UserModel).join(UserModel, Mentor.user_id == UserModel.id).filter(
            Mentor.id == mentor_id
        ).first()
        
        if not mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mentor not found"
            )
        
        mentor_data, user_data = mentor
        mentor_response = MentorResponse.model_validate(mentor_data)
        mentor_response.user_name = user_data.name
        mentor_response.user_email = user_data.email
        
        return mentor_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get mentor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get mentor"
        )

@router.get("/me/mentees", response_model=List[MentorAssignmentResponse])
def get_my_mentees(
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Get current mentor's assigned mentees"""
    try:
        # Check if user is a mentor
        mentor = db.query(Mentor).filter(Mentor.user_id == current_user.id).first()
        if not mentor:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not a mentor"
            )
        
        # Create aliases for UserModel to avoid conflicts
        StudentUser = aliased(UserModel)
        MentorUser = aliased(UserModel)
        
        assignments = db.query(
            MentorAssignment, Mentor, StudentUser, CourseModel
        ).join(
            Mentor, MentorAssignment.mentor_id == Mentor.id
        ).join(
            StudentUser, MentorAssignment.user_id == StudentUser.id
        ).join(
            CourseModel, MentorAssignment.course_id == CourseModel.id
        ).join(
            MentorUser, Mentor.user_id == MentorUser.id
        ).filter(
            and_(
                MentorAssignment.mentor_id == mentor.id,
                MentorAssignment.is_active == True
            )
        ).all()
        
        mentee_list = []
        for assignment, mentor_data, user_data, course_data in assignments:
            assignment_dict = MentorAssignmentResponse.model_validate(assignment)
            # Get mentor name separately since we can't join it properly
            mentor_user = db.query(UserModel).filter(UserModel.id == mentor_data.user_id).first()
            assignment_dict.mentor_name = mentor_user.name if mentor_user else None
            assignment_dict.mentor_expertise = mentor_data.expertise
            assignment_dict.user_name = user_data.name
            assignment_dict.course_title = course_data.title
            mentee_list.append(assignment_dict)
        
        return mentee_list
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get mentees: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get mentees"
        )

@router.get("/me/mentor", response_model=MentorAssignmentResponse)
def get_my_mentor(
    current_user = Depends(AuthMiddleware),
    course_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Get current user's mentor for a specific course"""
    try:
        # Create aliases for UserModel to avoid conflicts
        StudentUser = aliased(UserModel)
        MentorUser = aliased(UserModel)
        
        assignment = db.query(
            MentorAssignment, Mentor, StudentUser, CourseModel, MentorUser
        ).join(
            Mentor, MentorAssignment.mentor_id == Mentor.id
        ).join(
            StudentUser, MentorAssignment.user_id == StudentUser.id
        ).join(
            CourseModel, MentorAssignment.course_id == CourseModel.id
        ).join(
            MentorUser, Mentor.user_id == MentorUser.id
        ).filter(
            and_(
                MentorAssignment.user_id == current_user.id,
                MentorAssignment.course_id == course_id,
                MentorAssignment.is_active == True
            )
        ).first()
        
        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No mentor assigned for this course"
            )
        
        assignment_data, mentor_data, student_data, course_data, mentor_user_data = assignment
        assignment_dict = MentorAssignmentResponse.model_validate(assignment_data)
        assignment_dict.mentor_name = mentor_user_data.name
        assignment_dict.mentor_expertise = mentor_data.expertise
        assignment_dict.user_name = student_data.name
        assignment_dict.course_title = course_data.title
        
        return assignment_dict
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get mentor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get mentor"
        )
