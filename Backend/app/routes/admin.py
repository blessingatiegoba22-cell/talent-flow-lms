from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.admin import Admin, AdminRole, Course, Program
from app.models.user import User
from app.models.mentor import Mentor, MentorAssignment
from app.schemas.admin import CourseStatus, MentorAssignmentCreate, MentorAssignmentOut, MentorCreate, MentorOut, ProgramStatus, LoginRequest, LoginResponse, AdminOut, StaffCreate, UserUpdate, UserOut, CourseCreate, CourseUpdate, CourseOut, ProgramCreate, ProgramUpdate, ProgramOut, ReportOut, APIResponse
from app.auth.security import verify_password, create_access_token, get_current_admin, hash_password
from app.middlewares.auth import AuthMiddleware
from datetime import datetime
import bcrypt

router = APIRouter(prefix="/admin", tags=["Admin"])


# AUTH

@router.post("/login", response_model=LoginResponse)
def admin_login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Admin login - returns JWT token"""
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()

    if not admin or not bcrypt.checkpw(credentials.password.encode("utf-8"),admin.password.encode("utf-8")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
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
def get_admin_profile(
    current_admin: Admin = Depends(get_current_admin) 
):
    """Get currently logged in admin profile"""
    return AdminOut.model_validate(current_admin)


# # USER MANAGEMENT
# NOTE: Admin no longer creates learners
# Learners self-register via POST /auth/register

# @router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
# def create_user(
#     data: UserCreate,
#     db: Session = Depends(get_db),
#     current_admin: Admin = Depends(get_current_admin)
# ):
#     """Admin creates a new instructor or learner"""
#     existing = db.query(Admin).filter(Admin.email == data.email).first()
#     if existing:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )

#     role_prefix = {
#         "instructor": "TF-INST",
#         "learner": "TF-LRN",
#         "admin": "TF-ADMIN"
#     }

#     prefix = role_prefix.get(data.role, "TF-USR")
#     identifier = f"{prefix}-{str(uuid.uuid4())[:8].upper()}"

#     user = Admin(
#         id=str(uuid.uuid4()),
#         identifier=identifier,
#         full_name=data.full_name,
#         email=data.email,
#         hashed_password=hash_password(data.password),
#         role=data.role,
#         is_active=True
#     )

#     db.add(user)
#     db.commit()
#     db.refresh(user)
#     return UserOut.model_validate(user)

@router.post("/staff", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Admin creates a new staff account.
    - role: instructor → TF-INST-XXXXXX
    - role: admin      → TF-ADMIN-XXXXXX
    """
    # Check email doesn't already exist
    existing = db.query(Admin).filter(Admin.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Generate identifier based on role and get next ID
    role_prefix = {
        "instructor": "TF-INST",
        "admin": "TF-ADMIN"
    }
    prefix = role_prefix.get(data.role, "TF-STAFF")
    
    # Get next staff ID for identifier
    last_staff = db.query(Admin).filter(Admin.identifier.like(f"{prefix}-%")).order_by(Admin.id.desc()).first()
    if last_staff and last_staff.identifier:
        try:
            last_num = int(last_staff.identifier.split("-")[-1])
            next_num = last_num + 1
        except ValueError:
            # Handle existing UUID-style identifiers, start fresh
            next_num = 1
    else:
        next_num = 1
    
    identifier = f"{prefix}-{str(next_num).zfill(6)}"

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


@router.post("/mentors", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_mentor(
    data: MentorCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Promote a user to mentor role - Admin only"""
    try:
        from app.models.user import User as UserModel
        from app.models.mentor import Mentor
        
        # Get user by email (not ID)
        if "email" not in data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required"
            )
        
        user = db.query(UserModel).filter(UserModel.email == data["email"]).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if user is already a mentor
        existing_mentor = db.query(Mentor).filter(Mentor.user_id == user.id).first()
        if existing_mentor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a mentor"
            )
        
        # Create mentor profile
        mentor = Mentor(
            user_id=user.id,
            bio=data.get("bio", ""),
            expertise=data.get("expertise", ""),
            experience_years=data.get("experience_years", 0),
            rating=data.get("rating", 5)
        )
        
        db.add(mentor)
        
        # Update user role to mentor
        user.role = "mentor"
        
        db.commit()
        db.refresh(mentor)
        
        return {
            "message": "User promoted to mentor successfully",
            "mentor_id": mentor.id,
            "user_id": user.id,
            "user_name": user.name,
            "user_email": user.email,
            "new_role": "mentor"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mentor"
        )


@router.get("/users", response_model=List[UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets all users"""
    users = db.query(User).all()
    
    return [UserOut.model_validate(u) for u in users]


@router.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets a single user by ID"""
    user = db.query(Admin).filter(
        Admin.id == user_id,
        Admin.deleted_at == None
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserOut.model_validate(user)


@router.put("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin updates a user"""
    user = db.query(Admin).filter(
        Admin.id == user_id,
        Admin.deleted_at == None
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if data.name is not None:
        user.name = data.name
    if data.email is not None:
        user.email = data.email
    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active

    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.delete("/users/{user_id}", response_model=APIResponse)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin soft deletes a user"""
    user = db.query(Admin).filter(
        Admin.id == user_id,
        Admin.deleted_at == None
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.verified = "unverified"     # deactivate
    db.commit()

    return APIResponse(
        success=True,
        message=f"User {user.name} deleted successfully"
    )


# REGULAR USER MANAGEMENT
# For managing regular users (students, mentors, etc.)

@router.get("/regular-users", response_model=List[dict])
def get_all_regular_users(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets all regular users (students, mentors, etc.)"""
    users = db.query(User).all()
    
    user_list = []
    for user in users:
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "gender": user.gender,
            "role": user.role,
            "verified": user.verified,
            "location": user.location,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        user_list.append(user_data)
    
    return user_list


@router.delete("/regular-users/{user_id}", response_model=APIResponse)
def delete_regular_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin deletes a regular user (hard delete)"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Store user name for response message
    user_name = user.name
    
    # Hard delete the user
    db.delete(user)
    db.commit()

    return APIResponse(
        success=True,
        message=f"User {user_name} deleted successfully"
    )


# MANAGEMENT


@router.post("/programs", response_model=ProgramOut, status_code=status.HTTP_201_CREATED)
def create_program(
    data: ProgramCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin creates a learning program"""
    # Get next program identifier
    last_program = db.query(Program).filter(Program.identifier.like("TF-PROG-%")).order_by(Program.id.desc()).first()
    if last_program and last_program.identifier:
        try:
            last_num = int(last_program.identifier.split("-")[-1])
            next_num = last_num + 1
        except ValueError:
            # Handle existing UUID-style identifiers, start fresh
            next_num = 1
    else:
        next_num = 1
    
    identifier = f"TF-PROG-{str(next_num).zfill(6)}"

    program = Program(
        identifier=identifier,
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
    """Admin gets all learning programs"""
    programs = db.query(Program).filter(
        Program.deleted_at == None
    ).all()
    return [ProgramOut.model_validate(p) for p in programs]


@router.get("/programs/{program_id}", response_model=ProgramOut)
def get_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets a single program"""
    program = db.query(Program).filter(
        Program.id == program_id,
        Program.deleted_at == None
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    return ProgramOut.model_validate(program)


@router.put("/programs/{program_id}", response_model=ProgramOut)
def update_program(
    program_id: int,
    data: ProgramUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin updates a learning program"""
    program = db.query(Program).filter(
        Program.id == program_id,
        Program.deleted_at == None
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )

    if data.title is not None:
        program.title = data.title
    if data.description is not None:
        program.description = data.description
    if data.status is not None:
        program.status = data.status

    db.commit()
    db.refresh(program)
    return ProgramOut.model_validate(program)


@router.delete("/programs/{program_id}", response_model=APIResponse)
def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin soft deletes a program"""
    program = db.query(Program).filter(
        Program.id == program_id,
        Program.deleted_at == None
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )

    program.deleted_at = datetime.utcnow()
    db.commit()

    return APIResponse(
        success=True,
        message=f"Program {program.title} deleted successfully"
    )


# ─────────────────────────────────────────
# COURSE MANAGEMENT
# ─────────────────────────────────────────

@router.post("/courses", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin creates a course and optionally assigns it to a program"""

    # Validate program exists if provided
    if data.program_id:
        program = db.query(Program).filter(
            Program.id == data.program_id,
            Program.deleted_at == None
        ).first()
        if not program:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Program not found"
            )

    # Get next course identifier
    last_course = db.query(Course).filter(Course.identifier.like("TF-CRS-%")).order_by(Course.id.desc()).first()
    if last_course and last_course.identifier:
        try:
            last_num = int(last_course.identifier.split("-")[-1])
            next_num = last_num + 1
        except ValueError:
            # Handle existing UUID-style identifiers, start fresh
            next_num = 1
    else:
        next_num = 1
    
    identifier = f"TF-CRS-{str(next_num).zfill(6)}"

    course = Course(
        identifier=identifier,
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
    """Admin gets all courses"""
    courses = db.query(Course).filter(
        Course.deleted_at == None
    ).all()
    return [CourseOut.model_validate(c) for c in courses]


@router.get("/courses/{course_id}", response_model=CourseOut)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets a single course"""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.deleted_at == None
    ).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return CourseOut.model_validate(course)


@router.put("/courses/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin updates a course"""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.deleted_at == None
    ).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    if data.title is not None:
        course.title = data.title
    if data.description is not None:
        course.description = data.description
    if data.status is not None:
        course.status = data.status
    if data.program_id is not None:
        course.program_id = data.program_id

    db.commit()
    db.refresh(course)
    return CourseOut.model_validate(course)


@router.delete("/courses/{course_id}", response_model=APIResponse)
def delete_course(
    course_id: int ,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin soft deletes a course"""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.deleted_at == None
    ).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    course.deleted_at = datetime.utcnow()
    db.commit()

    return APIResponse(
        success=True,
        message=f"Course {course.title} deleted successfully"
    )

# MENTOR MANAGEMENT

@router.get("/mentors", response_model=List[MentorOut])
def get_all_mentors(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets all mentors"""
    mentors = db.query(Mentor).filter(
        Mentor.is_active == True
    ).all()
    return [MentorOut.model_validate(m) for m in mentors]

@router.get("/mentors/assignments", response_model=List[MentorAssignmentOut])
def get_all_assignments(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets all mentor assignments"""
    assignments = db.query(MentorAssignment).filter(
        MentorAssignment.is_active == True
    ).all()
    return [MentorAssignmentOut.model_validate(a) for a in assignments]


@router.get("/mentors/{mentor_id}", response_model=MentorOut)
def get_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin gets a single mentor"""
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()

    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor not found"
        )
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
    """Admin promotes a user to mentor"""
    from app.models.user import User

    # Check user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if already a mentor
    existing = db.query(Mentor).filter(Mentor.user_id == user_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a mentor"
        )

    mentor = Mentor(
        user_id=user_id,
        bio=bio,
        expertise=expertise,
        experience_years=experience_years,
        is_active=True
    )

    db.add(mentor)
    db.commit()
    db.refresh(mentor)
    return MentorOut.model_validate(mentor)


@router.put("/mentors/{mentor_id}/activate", response_model=APIResponse)
def activate_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin activates a mentor"""
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()

    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor not found"
        )

    mentor.is_active = True
    db.commit()

    return APIResponse(success=True, message="Mentor activated successfully")


@router.put("/mentors/{mentor_id}/deactivate", response_model=APIResponse)
def deactivate_mentor(
    mentor_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin deactivates a mentor"""
    mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()

    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor not found"
        )

    mentor.is_active = False
    db.commit()

    return APIResponse(success=True, message="Mentor deactivated successfully")


@router.post("/mentors/assign", response_model=MentorAssignmentOut, status_code=status.HTTP_201_CREATED)
def assign_mentor(
    data: MentorAssignmentCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin assigns a mentor to a learner for a course"""

    # Check mentor exists
    mentor = db.query(Mentor).filter(Mentor.id == data.mentor_id).first()
    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mentor not found"
        )

    # Check assignment doesn't already exist
    existing = db.query(MentorAssignment).filter(
        MentorAssignment.mentor_id == data.mentor_id,
        MentorAssignment.user_id == data.user_id,
        MentorAssignment.course_id == data.course_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
    """Admin removes a mentor assignment"""
    assignment = db.query(MentorAssignment).filter(
        MentorAssignment.id == assignment_id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    assignment.is_active = False
    db.commit()

    return APIResponse(
        success=True,
        message="Mentor assignment removed successfully"
    )

# REPORTS

@router.get("/reports", response_model=ReportOut)
def generate_report(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin generates a full platform report"""
    from app.models.user import User
    from app.models.mentor import Mentor

    total_learners = db.query(User).count()

    total_instructors = db.query(Mentor).filter(    
        Mentor.is_active == True
    ).count()

    total_active_users = db.query(User).count()

    total_courses = db.query(Course).filter(
        Course.deleted_at == None
    ).count()

    total_programs = db.query(Program).filter(
        Program.deleted_at == None
    ).count()

    active_courses = db.query(Course).filter(
        Course.status == "active",
        Course.deleted_at == None
    ).count()

    inactive_courses = db.query(Course).filter(
        Course.status == "inactive",
        Course.deleted_at == None
    ).count()

    draft_courses = db.query(Course).filter(
        Course.status == "draft",
        Course.deleted_at == None
    ).count()

    return ReportOut(
        total_learners=total_learners,
        total_instructors=total_instructors,
        total_active_users=total_active_users,
        total_courses=total_courses,
        total_programs=total_programs,
        active_courses=active_courses,
        inactive_courses=inactive_courses,
        draft_courses=draft_courses
    )