from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime
from typing import List, Optional
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.schemas.course import CourseResponse, CourseEnrollmentResponse, ProgressUpdate, UserCourseResponse, CourseCreate
from app.models.course import Course, course_enrollments
from app.models.user import User as UserModel
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
    """Get all published courses with optional filtering and pagination."""
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

        course_list = []
        for course in courses:
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
                "enrollment_count": 0,
            }
            course_list.append(course_dict)

        return course_list

    except Exception as e:
        logger.error(f"Failed to get courses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get courses"
        )


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_course(
    course_data: CourseCreate,
    current_user=Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Create a new course - Admin or Mentor only."""
    if current_user.role not in ["admin", "mentor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins or mentors can create courses"
        )

    try:
        instructor_id = course_data.instructor_id or current_user.id

        course = Course(
            title=course_data.title,
            description=course_data.description,
            category=course_data.category,
            level=course_data.level.value if course_data.level else None,
            duration_hours=course_data.duration_hours,
            price=course_data.price,
            instructor_id=instructor_id,
            is_published=False,
        )
        db.add(course)
        db.commit()
        db.refresh(course)

        return {
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
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create course: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create course"
        )


@router.get("/{course_id}", response_model=dict)
def get_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    """Get a single course by ID."""
    try:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )

        return {
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
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get course: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get course"
        )


@router.patch("/{course_id}/publish", response_model=dict)
def publish_course(
    course_id: int,
    current_user=Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Publish a course - Admin or owning Mentor only."""
    if current_user.role not in ["admin", "mentor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins or mentors can publish courses"
        )

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    course.is_published = True
    db.commit()
    db.refresh(course)

    return {"message": "Course published successfully", "course_id": course.id}


@router.post("/{course_id}/enroll", response_model=dict)
def enroll_in_course(
    course_id: int,
    current_user=Depends(AuthMiddleware),
    db: Session = Depends(get_db)
):
    """Enroll the current user in a course."""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.is_published == True
    ).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or not published"
        )

    # Check if already enrolled
    existing = db.execute(
        course_enrollments.select().where(
            course_enrollments.c.user_id == current_user.id,
            course_enrollments.c.course_id == course_id
        )
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already enrolled in this course"
        )

    db.execute(
        course_enrollments.insert().values(
            user_id=current_user.id,
            course_id=course_id,
            progress=0,
            is_active=True
        )
    )
    db.commit()

    return {"message": "Enrolled successfully", "course_id": course_id}