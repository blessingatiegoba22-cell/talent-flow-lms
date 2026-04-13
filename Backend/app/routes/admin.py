from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.admin import Admin, AdminRole, Course, Program
from app.models.user import User
from app.models.mentor import Mentor, MentorAssignment
from app.schemas.admin import (
    CourseStatus, MentorAssignmentCreate, MentorAssignmentOut,
    MentorCreate, MentorOut, ProgramStatus, LoginRequest, LoginResponse,
    AdminOut, StaffCreate, UserUpdate, UserOut, CourseCreate, CourseUpdate,
    CourseOut, ProgramCreate, ProgramUpdate, ProgramOut, ReportOut, APIResponse
)
from app.auth.security import verify_password, create_access_token, get_current_admin, hash_password
from datetime import datetime
import bcrypt

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── AUTH ─────────────────────────────────────────────────────────────────────

@router.post("/login", response_model=LoginResponse)
def admin_login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Admin login — returns JWT token in response body (admin clients use Bearer)"""
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()

    # Check existence and password together to prevent email enumeration
    if not admin or not bcrypt.checkpw(
        credentials.password.encode("utf-8"),
        admin.password.encode("utf-8")
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # NOTE: role check comes AFTER credential verification to avoid leaking
    # which emails belong to admins vs non-admins
    if admin.role != AdminRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to admins only"
        )
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    token = create_access_token(data={"sub": str(admin.id), "role": admin.role})
    return LoginResponse(access_token=token, admin=AdminOut.model_validate(admin))


@router.get("/me", response_model=AdminOut)
def get_admin_profile(current_admin: Admin = Depends(get_current_admin)):
    """Get currently logged-in admin profile"""
    return AdminOut.model_validate(current_admin)


# ─── STAFF MANAGEMENT ─────────────────────────────────────────────────────────

@router.post("/staff", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin creates a new instructor or admin staff account"""
    existing = db.query(Admin).filter(Admin.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    role_prefix = {"instructor": "TF-INST", "admin": "TF-ADMIN"}
    prefix = role_prefix.get(data.role, "TF-STAFF")

    last_staff = db.query(Admin).filter(
        Admin.identifier.like(f"{prefix}-%")
    ).order_by(Admin.id.desc()).first()

    try:
        last_num = int(last_staff.identifier.split("-")[-1]) if last_staff else 0
    except (ValueError, AttributeError):
        last_num = 0

    identifier = f"{prefix}-{str(last_num + 1).zfill(6)}"

    staff = Admin(
        identifier=identifier,
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
        is_active=True
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return UserOut.model_validate(staff)


# ─── USER MANAGEMENT ──────────────────────────────────────────────────────────

@router.get("/users", response_model=List[UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin lists all staff/admin accounts"""
    users = db.query(Admin).filter(Admin.deleted_at == None).all()
    return [UserOut.model_validate(u) for u in users]


@router.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets a single staff account by ID"""
    # BUG FIX: was querying Admin table but representing as "user" — now explicit
    user = db.query(Admin).filter(
        Admin.id == user_id,
        Admin.deleted_at == None
    ).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserOut.model_validate(user)


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin updates a staff account (PATCH — all fields optional)"""
    user = db.query(Admin).filter(
        Admin.id == user_id,
        Admin.deleted_at == None
    ).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if data.name is not None:
        user.name = data.name
    if data.email is not None:
        user.email = data.email
    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active

    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.delete("/users/{user_id}", response_model=APIResponse)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin soft-deletes a staff account"""
    # BUG FIX: original set user.verified which doesn't exist on Admin model
    user = db.query(Admin).filter(
        Admin.id == user_id,
        Admin.deleted_at == None
    ).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_active = False
    user.deleted_at = datetime.utcnow()
    db.commit()
    return APIResponse(success=True, message=f"User {user.name} deactivated successfully")


# ─── REGULAR USER MANAGEMENT (students, etc.) ─────────────────────────────────

@router.get("/regular-users", response_model=List[dict])
def get_all_regular_users(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin lists all regular users (students, mentors)"""
    users = db.query(User).all()
    return [
        {
            "id": u.id, "name": u.name, "email": u.email,
            "phone": u.phone, "gender": u.gender, "role": u.role,
            "verified": u.verified, "location": u.location,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "updated_at": u.updated_at.isoformat() if u.updated_at else None,
        }
        for u in users
    ]


@router.delete("/regular-users/{user_id}", response_model=APIResponse)
def delete_regular_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin hard-deletes a regular user account"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user_name = user.name
    db.delete(user)
    db.commit()
    return APIResponse(success=True, message=f"User {user_name} deleted successfully")


# ─── PROGRAM MANAGEMENT ───────────────────────────────────────────────────────

def _next_identifier(db: Session, model, prefix: str) -> str:
    last = db.query(model).filter(
        model.identifier.like(f"{prefix}-%")
    ).order_by(model.id.desc()).first()
    try:
        last_num = int(last.identifier.split("-")[-1]) if last else 0
    except (ValueError, AttributeError):
        last_num = 0
    return f"{prefix}-{str(last_num + 1).zfill(6)}"


@router.post("/programs", response_model=ProgramOut, status_code=status.HTTP_201_CREATED)
def create_program(
    data: ProgramCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    program = Program(
        identifier=_next_identifier(db, Program, "TF-PROG"),
        title=data.title,
        description=data.description,
        status=ProgramStatus.active,
        created_by=current_admin.id
    )
    db.add(program)
    db.commit()
    db.refresh(program)
    return ProgramOut.model_validate(program)


@router.get("/programs", response_model=List[ProgramOut])
def get_all_programs(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    programs = db.query(Program).filter(Program.deleted_at == None).all()
    return [ProgramOut.model_validate(p) for p in programs]


@router.get("/programs/{program_id}", response_model=ProgramOut)
def get_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    program = db.query(Program).filter(
        Program.id == program_id, Program.deleted_at == None
    ).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    return ProgramOut.model_validate(program)


@router.patch("/programs/{program_id}", response_model=ProgramOut)
def update_program(
    program_id: int,
    data: ProgramUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    program = db.query(Program).filter(
        Program.id == program_id, Program.deleted_at == None
    ).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    if data.title is not None:
        program.title = data.title
    if data.description is not None:
        program.description = data.description
    if data.status is not None:
        program.status = data.status

    program.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(program)
    return ProgramOut.model_validate(program)


@router.delete("/programs/{program_id}", response_model=APIResponse)
def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    program = db.query(Program).filter(
        Program.id == program_id, Program.deleted_at == None
    ).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    program.deleted_at = datetime.utcnow()
    db.commit()
    return APIResponse(success=True, message=f"Program '{program.title}' deleted")


# ─── COURSE MANAGEMENT ────────────────────────────────────────────────────────

@router.post("/courses", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    if data.program_id:
        program = db.query(Program).filter(
            Program.id == data.program_id, Program.deleted_at == None
        ).first()
        if not program:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    course = Course(
        identifier=_next_identifier(db, Course, "TF-CRS"),
        title=data.title,
        description=data.description,
        status=CourseStatus.draft,
        program_id=data.program_id,
        created_by=current_admin.id
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return CourseOut.model_validate(course)


@router.get("/courses", response_model=List[CourseOut])
def get_all_courses(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    courses = db.query(Course).filter(Course.deleted_at == None).all()
    return [CourseOut.model_validate(c) for c in courses]


@router.get("/courses/{course_id}", response_model=CourseOut)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.deleted_at == None
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return CourseOut.model_validate(course)


@router.patch("/courses/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.deleted_at == None
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    if data.title is not None:
        course.title = data.title
    if data.description is not None:
        course.description = data.description
    if data.status is not None:
        course.status = data.status
    if data.program_id is not None:
        course.program_id = data.program_id

    course.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(course)
    return CourseOut.model_validate(course)


@router.delete("/courses/{course_id}", response_model=APIResponse)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.deleted_at == None
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    course.deleted_at = datetime.utcnow()
    db.commit()
    return APIResponse(success=True, message=f"Course '{course.title}' deleted")


# ─── MENTOR MANAGEMENT ────────────────────────────────────────────────────────

@router.post("/mentors", response_model=MentorOut, status_code=status.HTTP_201_CREATED)
def create_mentor(
    data: MentorCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Promote a user to mentor by email"""
    # BUG FIX: original code used data["email"] dict-style on a Pydantic model
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    existing_mentor = db.query(Mentor).filter(Mentor.user_id == user.id).first()
    if existing_mentor:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a mentor"
        )

    mentor = Mentor(
        user_id=user.id,
        bio=data.bio,
        expertise=data.expertise,
        experience_years=data.experience_years,
        is_active=True
    )
    db.add(mentor)
    user.role = "mentor"
    db.commit()
    db.refresh(mentor)
    return MentorOut.model_validate(mentor)


@router.get("/mentors", response_model=List[MentorOut])
def get_all_mentors(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    mentors = db.query(Mentor).filter(Mentor.is_active == True).all()
    return [MentorOut.model_validate(m) for m in mentors]


@router.get("/mentors/assignments", response_model=List[MentorAssignmentOut])
def get_all_assignments(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    assignments = db.query(MentorAssignment).filter(MentorAssignment.is_active == True).all()
    return [MentorAssignmentOut.model_validate(a) for a in assignments]


@router.get("/mentors/{mentor_id}", response_model=MentorOut)
def get_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")
    return MentorOut.model_validate(mentor)


@router.post("/mentors/promote/{user_id}", response_model=MentorOut, status_code=status.HTTP_201_CREATED)
def promote_to_mentor(
    user_id: int,
    bio: Optional[str] = None,
    expertise: Optional[str] = None,
    experience_years: Optional[int] = None,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Promote a user to mentor by user ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    existing = db.query(Mentor).filter(Mentor.user_id == user_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a mentor"
        )

    mentor = Mentor(
        user_id=user_id, bio=bio, expertise=expertise,
        experience_years=experience_years, is_active=True
    )
    db.add(mentor)
    user.role = "mentor"
    db.commit()
    db.refresh(mentor)
    return MentorOut.model_validate(mentor)


@router.patch("/mentors/{mentor_id}/activate", response_model=APIResponse)
def activate_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")
    mentor.is_active = True
    db.commit()
    return APIResponse(success=True, message="Mentor activated")


@router.patch("/mentors/{mentor_id}/deactivate", response_model=APIResponse)
def deactivate_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")
    mentor.is_active = False
    db.commit()
    return APIResponse(success=True, message="Mentor deactivated")


@router.post("/mentors/assign", response_model=MentorAssignmentOut, status_code=status.HTTP_201_CREATED)
def assign_mentor(
    data: MentorAssignmentCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    mentor = db.query(Mentor).filter(Mentor.id == data.mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor not found")

    learner = db.query(User).filter(User.id == data.user_id).first()
    if not learner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Learner not found")

    existing = db.query(MentorAssignment).filter(
        MentorAssignment.mentor_id == data.mentor_id,
        MentorAssignment.user_id == data.user_id,
        MentorAssignment.course_id == data.course_id,
        MentorAssignment.is_active == True
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Mentor already assigned to this learner for this course"
        )

    assignment = MentorAssignment(
        mentor_id=data.mentor_id,
        user_id=data.user_id,
        course_id=data.course_id,
        notes=data.notes,
        is_active=True
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return MentorAssignmentOut.model_validate(assignment)


@router.delete("/mentors/assignments/{assignment_id}", response_model=APIResponse)
def remove_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    assignment = db.query(MentorAssignment).filter(
        MentorAssignment.id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found")

    assignment.is_active = False
    db.commit()
    return APIResponse(success=True, message="Mentor assignment removed")


# ─── REPORTS ──────────────────────────────────────────────────────────────────

@router.get("/reports", response_model=ReportOut)
def generate_report(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Full platform statistics report"""
    total_learners = db.query(User).count()
    total_instructors = db.query(Mentor).filter(Mentor.is_active == True).count()
    total_courses = db.query(Course).filter(Course.deleted_at == None).count()
    total_programs = db.query(Program).filter(Program.deleted_at == None).count()
    active_courses = db.query(Course).filter(
        Course.status == "active", Course.deleted_at == None
    ).count()
    inactive_courses = db.query(Course).filter(
        Course.status == "inactive", Course.deleted_at == None
    ).count()
    draft_courses = db.query(Course).filter(
        Course.status == "draft", Course.deleted_at == None
    ).count()

    return ReportOut(
        total_learners=total_learners,
        total_instructors=total_instructors,
        total_active_users=total_learners,  # BUG FIX: was same query twice
        total_courses=total_courses,
        total_programs=total_programs,
        active_courses=active_courses,
        inactive_courses=inactive_courses,
        draft_courses=draft_courses
    )
