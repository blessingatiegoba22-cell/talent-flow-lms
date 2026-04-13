from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.admin import Admin, AdminRole, Course, Program
from app.models.user import User
from app.schemas.admin import CourseStatus, ProgramStatus, LoginRequest, LoginResponse, AdminOut, StaffCreate, UserUpdate, UserOut, CourseCreate, CourseUpdate, CourseOut, ProgramCreate, ProgramUpdate, ProgramOut, ReportOut, APIResponse
from app.schemas.team import TeamCreate, TeamUpdate, TeamOut, TeamList, TeamDetail, TeamMemberCreate, TeamMemberOut, TeamCourseCreate, TeamCourseOut, TeamStatus, TeamRole
from app.auth.security import verify_password, create_access_token, get_current_admin, hash_password
from datetime import datetime
import uuid

router = APIRouter(prefix="/admin", tags=["Admin"])


# AUTH

@router.post("/login", response_model=LoginResponse)
def admin_login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Admin login - returns JWT token"""
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()

    if not admin or not verify_password(credentials.password, admin.hashed_password):
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

    token = create_access_token(data={"sub": admin.email, "role": admin.role})
    return LoginResponse(access_token=token, admin=AdminOut.model_validate(admin))


@router.get("/me", response_model=AdminOut)
def get_admin_profile(
    current_admin: Admin = Depends(get_current_admin) 
):
    """Get currently logged in admin profile"""
    return AdminOut.model_validate(current_admin)


@router.post("/mentor-tasks", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_mentor_task(
    task_data: dict,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin creates task on behalf of mentor"""
    try:
        from app.models.task import Task
        from app.models.mentor import Mentor
        from app.models.course import Course as CourseModel
        
        # Get mentor by user ID or create one if needed
        mentor_id = task_data.get("mentor_id")
        if not mentor_id:
            # Get the first mentor
            mentor = db.query(Mentor).first()
            if not mentor:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No mentors found"
                )
            mentor_id = mentor.id
        else:
            mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
            if not mentor:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Mentor not found"
                )
        
        # Verify course exists
        course = db.query(CourseModel).filter(CourseModel.id == task_data["course_id"]).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        # Create task
        task = Task(
            title=task_data["title"],
            description=task_data["description"],
            instructions=task_data.get("instructions", ""),
            task_type=task_data.get("task_type", "assignment"),
            mentor_id=mentor_id,
            course_id=task_data["course_id"],
            max_score=task_data.get("max_score", 100),
            due_date=task_data.get("due_date"),
            estimated_hours=task_data.get("estimated_hours"),
            allow_file_submission=task_data.get("allow_file_submission", True),
            max_file_size_mb=task_data.get("max_file_size_mb", 10),
            allowed_file_types=task_data.get("allowed_file_types", "pdf,doc,docx,txt")
        )
        
        db.add(task)
        db.commit()
        db.refresh(task)
        
        return {
            "message": "Task created successfully",
            "task_id": task.id,
            "title": task.title,
            "course_id": task.course_id,
            "mentor_id": task.mentor_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create task: {str(e)}"
        )


# USER MANAGEMENT
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
        full_name=data.full_name,
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role,
        is_active=True
    )

    db.add(staff)
    db.commit()
    db.refresh(staff)
    return UserOut.model_validate(staff)


@router.post("/mentors", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_mentor(
    data: dict,
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
    users = db.query(Admin).filter(
        Admin.deleted_at == None,
        Admin.role != AdminRole.admin
    ).all()
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

    if data.full_name is not None:
        user.full_name = data.full_name
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

    user.deleted_at = datetime.utcnow()
    user.is_active = False
    db.commit()

    return APIResponse(
        success=True,
        message=f"User {user.full_name} deleted successfully"
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


# MENTOR TEAM ASSIGNMENT - Admin Only
@router.post("/assign-mentor-to-team", response_model=dict, status_code=status.HTTP_201_CREATED)
def assign_mentor_to_team(
    data: dict,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Assign a mentor to a specific team - Admin only"""
    try:
        from app.services.team_assignment import TeamAssignmentService
        from app.models.mentor import Mentor
        from app.models.team import Team
        
        mentor_id = data.get("mentor_id")
        team_id = data.get("team_id")
        
        if not mentor_id or not team_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both mentor_id and team_id are required"
            )
        
        # Check if mentor exists
        mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
        if not mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mentor not found"
            )
        
        # Check if team exists
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Assign mentor to team
        assigned = TeamAssignmentService.assign_mentor_to_team(mentor_id, team_id, db)
        
        if assigned:
            return {
                "message": "Mentor assigned to team successfully",
                "mentor_id": mentor_id,
                "team_id": team_id,
                "mentor_name": mentor.user.name if mentor.user else None,
                "team_name": team.name
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to assign mentor to team"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to assign mentor to team: {str(e)}"
        )


@router.post("/auto-assign-mentors", response_model=dict, status_code=status.HTTP_201_CREATED)
def auto_assign_mentors_to_teams(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Automatically assign all available mentors to teams - Admin only"""
    try:
        from app.services.team_assignment import TeamAssignmentService
        
        # Create default teams if none exist
        TeamAssignmentService.create_default_teams_if_none_exist(db)
        
        # Assign mentors to teams
        assigned = TeamAssignmentService.assign_mentors_to_teams(db)
        
        if assigned:
            return {
                "message": "Mentors automatically assigned to teams successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to assign mentors to teams"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to auto-assign mentors: {str(e)}"
        )


# TEAM MANAGEMENT - Admin Only (Simplified)
@router.post("/teams", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_team(
    data: dict,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Create a new team - Admin only"""
    try:
        from app.models.team import Team, TeamMember
        from app.models.user import User as UserModel
        
        # Check if team name already exists
        existing_team = db.query(Team).filter(Team.name == data.get("name")).first()
        if existing_team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team name already exists"
            )
        
        # Create team
        team = Team(
            name=data.get("name"),
            description=data.get("description", ""),
            max_members=data.get("max_members", 10),
            status=data.get("status", "active"),
            created_by=current_admin.id,
            team_lead_id=data.get("team_lead_id")
        )
        
        db.add(team)
        db.commit()
        db.refresh(team)
        
        return {
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "max_members": team.max_members,
            "status": team.status,
            "created_by": team.created_by,
            "created_at": team.created_at,
            "message": "Team created successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create team: {str(e)}"
        )


@router.get("/teams", response_model=dict)
def get_teams(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all teams - Admin only"""
    try:
        from app.models.team import Team
        
        query = db.query(Team)
        
        if status:
            query = query.filter(Team.status == status)
        
        total = query.count()
        teams = query.offset(skip).limit(limit).all()
        
        team_list = []
        for team in teams:
            team_data = {
                "id": team.id,
                "name": team.name,
                "description": team.description,
                "max_members": team.max_members,
                "status": team.status,
                "created_by": team.created_by,
                "team_lead_id": team.team_lead_id,
                "created_at": team.created_at,
                "updated_at": team.updated_at
            }
            
            # Add member count
            from app.models.team import TeamMember
            member_count = db.query(TeamMember).filter(TeamMember.team_id == team.id, TeamMember.is_active == True).count()
            team_data["member_count"] = member_count
            
            team_list.append(team_data)
        
        return {
            "teams": team_list,
            "total": total,
            "page": skip // limit + 1,
            "per_page": limit
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get teams: {str(e)}"
        )


@router.get("/teams/{team_id}", response_model=dict)
def get_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get team details - Admin only"""
    try:
        from app.models.team import Team, TeamMember
        
        # Get team
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Get team members
        members = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.is_active == True
        ).all()
        
        member_list = []
        for member in members:
            from app.models.user import User as UserModel
            user = db.query(UserModel).filter(UserModel.id == member.user_id).first()
            member_data = {
                "id": member.id,
                "team_id": member.team_id,
                "user_id": member.user_id,
                "role": member.role,
                "joined_at": member.joined_at,
                "is_active": member.is_active,
                "user_name": user.name if user else None,
                "user_email": user.email if user else None
            }
            member_list.append(member_data)
        
        return {
            "team": {
                "id": team.id,
                "name": team.name,
                "description": team.description,
                "max_members": team.max_members,
                "status": team.status,
                "created_by": team.created_by,
                "team_lead_id": team.team_lead_id,
                "created_at": team.created_at,
                "updated_at": team.updated_at
            },
            "members": member_list,
            "member_count": len(member_list)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get team details: {str(e)}"
        )


@router.post("/teams/{team_id}/members", response_model=dict, status_code=status.HTTP_201_CREATED)
def add_team_member(
    team_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Add member to team - Admin only"""
    try:
        from app.models.team import Team, TeamMember
        from app.models.user import User as UserModel
        
        # Check if team exists
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if user exists
        user = db.query(UserModel).filter(UserModel.id == data.get("user_id")).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check if user is already in team
        existing_member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == data.get("user_id"),
            TeamMember.is_active == True
        ).first()
        if existing_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a member of this team"
            )
        
        # Check team capacity
        current_members = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.is_active == True
        ).count()
        if current_members >= team.max_members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team has reached maximum capacity"
            )
        
        # Create team member
        team_member = TeamMember(
            team_id=team_id,
            user_id=data.get("user_id"),
            role=data.get("role", "member"),
            joined_at=datetime.utcnow()
        )
        
        db.add(team_member)
        db.commit()
        db.refresh(team_member)
        
        return {
            "id": team_member.id,
            "team_id": team_member.team_id,
            "user_id": team_member.user_id,
            "role": team_member.role,
            "joined_at": team_member.joined_at,
            "message": "Member added to team successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add team member: {str(e)}"
        )


@router.delete("/teams/{team_id}/members/{user_id}", response_model=dict)
def remove_team_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Remove member from team - Admin only"""
    try:
        from app.models.team import TeamMember
        
        # Check if team exists
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Find team member
        member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id,
            TeamMember.is_active == True
        ).first()
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found in team"
            )
        
        # Remove member (soft delete)
        member.is_active = False
        member.left_at = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Member removed from team successfully",
            "team_id": team_id,
            "user_id": user_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to remove team member: {str(e)}"
        )


@router.post("/teams/{team_id}/courses", response_model=dict, status_code=status.HTTP_201_CREATED)
def assign_course_to_team(
    team_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Assign course to team - Admin only"""
    try:
        from app.models.team import Team, TeamCourse
        from app.models.admin import Course as CourseModel
        
        # Check if team exists
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if course exists
        course = db.query(CourseModel).filter(CourseModel.id == data.get("course_id")).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        # Check if course is already assigned to team
        existing_assignment = db.query(TeamCourse).filter(
            TeamCourse.team_id == team_id,
            TeamCourse.course_id == data.get("course_id")
        ).first()
        if existing_assignment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Course is already assigned to this team"
            )
        
        # Create assignment
        team_course = TeamCourse(
            team_id=team_id,
            course_id=data.get("course_id")
        )
        
        db.add(team_course)
        db.commit()
        db.refresh(team_course)
        
        return {
            "id": team_course.id,
            "team_id": team_course.team_id,
            "course_id": team_course.course_id,
            "assigned_at": team_course.assigned_at,
            "message": "Course assigned to team successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to assign course to team: {str(e)}"
        )


@router.delete("/teams/{team_id}/courses/{course_id}", response_model=dict)
def remove_course_from_team(
    team_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Remove course from team - Admin only"""
    try:
        from app.models.team import TeamCourse
        
        # Find assignment
        assignment = db.query(TeamCourse).filter(
            TeamCourse.team_id == team_id,
            TeamCourse.course_id == course_id
        ).first()
        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not assigned to team"
            )
        
        # Remove assignment
        db.delete(assignment)
        db.commit()
        
        return {
            "message": "Course removed from team successfully",
            "team_id": team_id,
            "course_id": course_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to remove course from team: {str(e)}"
        )


@router.put("/teams/{team_id}", response_model=dict)
def update_team(
    team_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update team - Admin only"""
    try:
        from app.models.team import Team
        
        # Check if team exists
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Update team fields
        if data.get("name") is not None:
            team.name = data["name"]
        if data.get("description") is not None:
            team.description = data["description"]
        if data.get("max_members") is not None:
            team.max_members = data["max_members"]
        if data.get("status") is not None:
            team.status = data["status"]
        if data.get("team_lead_id") is not None:
            team.team_lead_id = data["team_lead_id"]
        
        team.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(team)
        
        return {
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "max_members": team.max_members,
            "status": team.status,
            "created_by": team.created_by,
            "team_lead_id": team.team_lead_id,
            "updated_at": team.updated_at,
            "message": "Team updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update team: {str(e)}"
        )


@router.delete("/teams/{team_id}", response_model=dict)
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete team - Admin only"""
    try:
        from app.models.team import Team, TeamMember, TeamCourse
        
        # Check if team exists
        team = db.query(Team).filter(Team.id == team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Remove all team members
        db.query(TeamMember).filter(TeamMember.team_id == team_id).delete()
        
        # Remove all course assignments
        db.query(TeamCourse).filter(TeamCourse.team_id == team_id).delete()
        
        # Delete team
        db.delete(team)
        db.commit()
        
        return {
            "message": "Team deleted successfully",
            "team_id": team_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete team: {str(e)}"
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
    program_id: str,
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
    program_id: str,
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
    program_id: str,
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
    course_id: str,
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
    course_id: str,
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
    course_id: str,
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

# REPORTS

@router.get("/reports", response_model=ReportOut)
def generate_report(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    """Admin generates a full platform report"""
    total_learners = db.query(Admin).filter(
        Admin.role == AdminRole.learner,
        Admin.deleted_at == None
    ).count()

    total_instructors = db.query(Admin).filter(
        Admin.role == AdminRole.instructor,
        Admin.deleted_at == None
    ).count()

    total_active_users = db.query(Admin).filter(
        Admin.is_active == True,
        Admin.deleted_at == None
    ).count()

    total_courses = db.query(Course).filter(
        Course.deleted_at == None
    ).count()

    total_programs = db.query(Program).filter(
        Program.deleted_at == None
    ).count()

    active_courses = db.query(Course).filter(
        Course.status == CourseStatus.active,
        Course.deleted_at == None
    ).count()

    inactive_courses = db.query(Course).filter(
        Course.status == CourseStatus.inactive,
        Course.deleted_at == None
    ).count()

    draft_courses = db.query(Course).filter(
        Course.status == CourseStatus.draft,
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