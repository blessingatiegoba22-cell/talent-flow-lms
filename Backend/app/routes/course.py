from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.database import get_db
from sqlalchemy.orm import Session, defer
from sqlalchemy import func, and_, or_
from app.schemas.course import CourseResponse, CourseEnrollmentResponse, UserCourseResponse
from app.models.course import Course, course_enrollments
from app.models.user import User as UserModel
from app.models.mentor import Mentor, MentorAssignment
from app.middlewares.auth import AuthMiddleware
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/courses",
    tags=["courses"]
)


@router.get("/", response_model=List[dict])
def get_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all published courses with filtering and pagination"""
    try:
        query = db.query(Course).filter(Course.is_published == True)
        
        if category:
            query = query.filter(Course.category.ilike(f"%{category}%"))
        
        if level:
            query = query.filter(Course.level == level)
        
        if search:
            query = query.filter(
                or_(
                    Course.title.ilike(f"%{search}%"),
                    Course.description.ilike(f"%{search}%")
                )
            )
        
        courses = query.offset(skip).limit(limit).all()
        
        # Convert to dict format
        course_list = []
        for course in courses:
            # Convert to dict format with user-friendly price
            course_dict = {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "category": course.category,
                "level": course.level,
                "duration_hours": course.duration_hours,
                "price": f"${course.price / 100:.2f}" if course.price else "Free",  # Convert cents to dollars
                "instructor_id": course.instructor_id,
                "is_published": course.is_published,
                "created_at": course.created_at,
                "updated_at": course.updated_at,
                "enrollment_count": 0  # Will be implemented later
            }
            course_list.append(course_dict)
        
        return course_list
        
    except Exception as e:
        logger.error(f"Failed to get courses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get courses"
        )




@router.get("/{course_id}", response_model=dict)
def get_course(course_id: int, db: Session = Depends(get_db)):
    """Get a specific course by ID"""
    try:
        course = db.query(Course).filter(
            and_(
                Course.id == course_id,
                Course.is_published == True
            )
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        # Get enrollment count
        enrollment_count = db.query(course_enrollments).filter(
            and_(
                course_enrollments.c.course_id == course.id,
                course_enrollments.c.is_active == True
            )
        ).count()
        
        course_dict = {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "category": course.category,
            "level": course.level,
            "duration_hours": course.duration_hours,
            "price": f"${course.price / 100:.2f}" if course.price else "Free",
            "instructor_id": course.instructor_id,
            "is_published": course.is_published,
            "created_at": course.created_at,
            "updated_at": course.updated_at,
            "enrollment_count": enrollment_count
        }
        
        return course_dict
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get course: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get course"
        )


@router.post("/{course_id}/enroll", response_model=dict)
def enroll_in_course(
    course_id: int,
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Enroll the current user in a course"""
    try:
        # Check if course exists and is published
        course = db.query(Course).filter(
            and_(
                Course.id == course_id,
                Course.is_published == True
            )
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        # Check if user is already enrolled
        existing_enrollment = db.query(course_enrollments).filter(
            and_(
                course_enrollments.c.user_id == current_user.id,
                course_enrollments.c.course_id == course_id,
                course_enrollments.c.is_active == True
            )
        ).first()
        
        if existing_enrollment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already enrolled in this course"
            )
        
        # Create enrollment
        db.execute(
            course_enrollments.insert().values(
                user_id=current_user.id,
                course_id=course_id,
                progress=0,
                is_active=True
            )
        )
        
        # Assign a mentor to the student
        mentor = db.query(Mentor).filter(Mentor.is_active == True).order_by(func.random()).first()
        
        if mentor:
            mentor_assignment = MentorAssignment(
                mentor_id=mentor.id,
                user_id=current_user.id,
                course_id=course_id,
                notes=f"Auto-assigned mentor for course: {course.title}"
            )
            db.add(mentor_assignment)
            logger.info(f"Assigned mentor {mentor.id} to user {current_user.id} for course {course_id}")
        else:
            logger.warning(f"No active mentors available for course {course_id}")
        
        db.commit()
        
        return {
            "message": "Successfully enrolled in course",
            "course_id": course_id,
            "user_id": current_user.id,
            "mentor_assigned": mentor.id if mentor else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to enroll in course: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to enroll in course"
        )


@router.delete("/{course_id}/enroll", response_model=dict)
def unenroll_from_course(
    course_id: int,
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Unenroll the current user from a course"""
    try:
        # Check if user is enrolled
        existing_enrollment = db.query(course_enrollments).filter(
            and_(
                course_enrollments.c.user_id == current_user.id,
                course_enrollments.c.course_id == course_id,
                course_enrollments.c.is_active == True
            )
        ).first()
        
        if not existing_enrollment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not enrolled in this course"
            )
        
        # Deactivate enrollment (soft delete)
        db.execute(
            course_enrollments.update().where(
                and_(
                    course_enrollments.c.user_id == current_user.id,
                    course_enrollments.c.course_id == course_id
                )
            ).values(is_active=False)
        )
        db.commit()
        
        return {
            "message": "Successfully unenrolled from course",
            "course_id": course_id,
            "user_id": current_user.id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to unenroll from course: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to unenroll from course"
        )


@router.get("/me/enrollments", response_model=List[CourseEnrollmentResponse])
def get_my_enrollments(
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Get current user's course enrollments"""
    try:
        enrollments = db.query(Course, course_enrollments.c.progress, course_enrollments.c.enrolled_at, course_enrollments.c.completed_at, UserModel.name.label('instructor_name')).join(
            course_enrollments,
            Course.id == course_enrollments.c.course_id
        ).join(
            UserModel,
            Course.instructor_id == UserModel.id,
            isouter=True
        ).filter(
            and_(
                course_enrollments.c.user_id == current_user.id,
                course_enrollments.c.is_active == True
            )
        ).all()
        
        enrollment_responses = []
        for course, progress, enrolled_at, completed_at, instructor_name in enrollments:
            enrollment_dict = {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "category": course.category,
                "level": course.level,
                "duration_hours": course.duration_hours,
                "price": course.price,
                "progress": progress,
                "enrolled_at": enrolled_at,
                "completed_at": completed_at,
                "instructor_name": instructor_name
            }
            enrollment_responses.append(CourseEnrollmentResponse(**enrollment_dict))
        
        return enrollment_responses
        
    except Exception as e:
        logger.error(f"Failed to get enrollments: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get enrollments"
        )


@router.get("/{course_id}/students", response_model=List[UserCourseResponse])
def get_course_students(
    course_id: int,
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Get all students enrolled in a course (instructor only)"""
    try:
        # Check if user is the instructor of this course
        course = db.query(Course).filter(Course.id == course_id).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        if course.instructor_id != current_user.id and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only course instructor or admin can view students"
            )
        
        # Get all enrolled students
        students = db.query(UserModel, course_enrollments.c.progress, course_enrollments.c.enrolled_at, course_enrollments.c.completed_at).join(
            course_enrollments,
            UserModel.id == course_enrollments.c.user_id
        ).filter(
            and_(
                course_enrollments.c.course_id == course_id,
                course_enrollments.c.is_active == True
            )
        ).all()
        
        student_responses = []
        for user, progress, enrolled_at, completed_at in students:
            student_dict = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "progress": progress,
                "enrolled_at": enrolled_at,
                "completed_at": completed_at
            }
            student_responses.append(UserCourseResponse(**student_dict))
        
        return student_responses
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get course students: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get course students"
        )


@router.put("/{course_id}/progress", response_model=dict)
def update_course_progress(
    course_id: int,
    progress_data: dict,
    current_user = Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Update user's progress in a course"""
    try:
        progress = progress_data.get("progress", 0)
        
        if not (0 <= progress <= 100):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Progress must be between 0 and 100"
            )
        
        # Check if user is enrolled
        enrollment = db.query(course_enrollments).filter(
            and_(
                course_enrollments.c.user_id == current_user.id,
                course_enrollments.c.course_id == course_id,
                course_enrollments.c.is_active == True
            )
        ).first()
        
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not enrolled in this course"
            )
        
        # Update progress
        update_values = {"progress": progress}
        
        # Mark as completed if progress is 100
        if progress == 100 and not enrollment.completed_at:
            update_values["completed_at"] = datetime.utcnow()
        
        db.execute(
            course_enrollments.update().where(
                and_(
                    course_enrollments.c.user_id == current_user.id,
                    course_enrollments.c.course_id == course_id
                )
            ).values(**update_values)
        )
        db.commit()
        
        return {
            "message": "Progress updated successfully",
            "course_id": course_id,
            "progress": progress,
            "completed": progress == 100
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update progress: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update progress"
        )
