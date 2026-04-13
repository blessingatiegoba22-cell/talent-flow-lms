from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.database import get_db
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, and_, or_
from app.schemas.mentor import MentorCreate, MentorResponse, MentorUpdate, MentorAssignmentResponse
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut, TaskSubmissionOut, TaskGradeCreate, TaskGradeOut, MentorTaskView, TaskResponse
from app.models.mentor import Mentor, MentorAssignment
from app.models.task import Task, TaskSubmission, TaskGrade
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


# Task Management Endpoints for Mentors
def get_mentor_by_user_id(db: Session, user_id: int) -> Optional[Mentor]:
    """Get mentor by user ID"""
    return db.query(Mentor).filter(Mentor.user_id == user_id).first()

def check_task_access(db: Session, task_id: int, user_id: int, is_mentor: bool = False) -> Task:
    """Check if user can access task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if is_mentor:
        # Mentor can only access their own tasks
        mentor = get_mentor_by_user_id(db, user_id)
        if not mentor or task.mentor_id != mentor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only access your own tasks"
            )
    else:
        # Student can only access published tasks
        if task.status != "published":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Task is not published"
            )
    
    return task

@router.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(AuthMiddleware)
):
    """Create a new task (mentor only)"""
    # Check if user is a mentor
    mentor = get_mentor_by_user_id(db, current_user.id)
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only mentors can create tasks"
        )
    
    # Verify course exists
    course = db.query(CourseModel).filter(CourseModel.id == task_data.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Create task
    task = Task(
        title=task_data.title,
        description=task_data.description,
        instructions=task_data.instructions,
        task_type=task_data.task_type,
        mentor_id=mentor.id,
        course_id=task_data.course_id,
        max_score=task_data.max_score,
        due_date=task_data.due_date,
        estimated_hours=task_data.estimated_hours,
        allow_file_submission=task_data.allow_file_submission,
        max_file_size_mb=task_data.max_file_size_mb,
        allowed_file_types=task_data.allowed_file_types
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Add related data
    task.mentor_name = mentor.user.name if mentor.user else None
    
    return task

@router.get("/tasks", response_model=List[MentorTaskView])
def get_mentor_tasks(
    course_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(AuthMiddleware)
):
    """Get tasks for current mentor"""
    mentor = get_mentor_by_user_id(db, current_user.id)
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for mentors only"
        )
    
    query = db.query(Task).filter(Task.mentor_id == mentor.id)
    
    if course_id:
        query = query.filter(Task.course_id == course_id)
    if status:
        query = query.filter(Task.status == status)
    
    tasks = query.all()
    
    # Convert to mentor view with statistics
    mentor_tasks = []
    for task in tasks:
        submissions = task.submissions
        
        # Calculate statistics
        submission_count = len(submissions)
        graded_count = len([s for s in submissions if s.status == "graded"])
        pending_count = len([s for s in submissions if s.status == "submitted"])
        
        scores = [s.score for s in submissions if s.score is not None]
        average_score = sum(scores) / len(scores) if scores else None
        
        task_view = MentorTaskView(
            id=task.id,
            title=task.title,
            description=task.description,
            instructions=task.instructions,
            task_type=task.task_type,
            status=task.status,
            max_score=task.max_score,
            due_date=task.due_date,
            estimated_hours=task.estimated_hours,
            created_at=task.created_at,
            published_at=task.published_at,
            submission_count=submission_count,
            graded_count=graded_count,
            pending_count=pending_count,
            average_score=average_score
        )
        
        mentor_tasks.append(task_view)
    
    return mentor_tasks

@router.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(AuthMiddleware)
):
    """Get a specific task"""
    mentor = get_mentor_by_user_id(db, current_user.id)
    task = check_task_access(db, task_id, current_user.id, is_mentor=bool(mentor))
    
    # Add related data
    if task.mentor:
        task.mentor_name = task.mentor.user.name if task.mentor.user else None
    task.submission_count = len(task.submissions)
    
    return task

@router.get("/tasks/{task_id}/submissions", response_model=List[TaskSubmissionOut])
def get_task_submissions(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(AuthMiddleware)
):
    """Get all submissions for a task (mentor only)"""
    mentor = get_mentor_by_user_id(db, current_user.id)
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only mentors can view task submissions"
        )
    
    task = check_task_access(db, task_id, current_user.id, is_mentor=True)
    
    submissions = db.query(TaskSubmission).filter(TaskSubmission.task_id == task_id).all()
    
    # Add related data
    for submission in submissions:
        if submission.task:
            submission.task_title = submission.task.title
            submission.max_score = submission.task.max_score
            submission.due_date = submission.task.due_date
        if submission.student:
            submission.student_name = submission.student.name
        if submission.grader:
            submission.mentor_name = submission.grader.user.name if submission.grader.user else None
    
    return submissions

@router.post("/tasks/submissions/{submission_id}/grade", response_model=TaskGradeOut, status_code=status.HTTP_201_CREATED)
def grade_submission(
    submission_id: int,
    grade_data: TaskGradeCreate,
    db: Session = Depends(get_db),
    current_user = Depends(AuthMiddleware)
):
    """Grade a submission (mentor only)"""
    mentor = get_mentor_by_user_id(db, current_user.id)
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only mentors can grade submissions"
        )
    
    submission = db.query(TaskSubmission).filter(TaskSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # Check if mentor can grade this submission
    task = check_task_access(db, submission.task_id, current_user.id, is_mentor=True)
    
    # Create grade
    grade = TaskGrade(
        submission_id=submission_id,
        mentor_id=mentor.id,
        score=grade_data.score,
        max_score=grade_data.max_score,
        grade_status=grade_data.grade_status,
        overall_feedback=grade_data.overall_feedback,
        detailed_feedback=grade_data.detailed_feedback,
        strengths=grade_data.strengths,
        improvements=grade_data.improvements,
        criteria_scores=grade_data.criteria_scores
    )
    
    db.add(grade)
    
    # Update submission
    submission.score = grade_data.score
    submission.grade_status = grade_data.grade_status
    submission.mentor_feedback = grade_data.overall_feedback
    submission.graded_at = datetime.utcnow()
    submission.graded_by = mentor.id
    submission.status = "graded"
    
    db.commit()
    db.refresh(grade)
    
    # Add related data
    grade.mentor_name = mentor.user.name if mentor.user else None
    if submission.student:
        grade.student_name = submission.student.name
    if submission.task:
        grade.task_title = submission.task.title
    
    return grade

