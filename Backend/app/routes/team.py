from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.team import Team, TeamMember
from app.models.user import User
from app.models.admin import Admin
from app.schemas.team import (
    TeamCreate, TeamUpdate, TeamOut, TeamOutSimple,
    TeamMemberOut, AddMembersRequest
)
from app.auth.security import get_current_admin
from app.middlewares.auth import AuthMiddleware
from datetime import datetime

router = APIRouter(prefix="/teams", tags=["Teams"])


# ─── HELPERS ──────────────────────────────────────────────────────────────────

def build_member_out(member: TeamMember) -> TeamMemberOut:
    return TeamMemberOut(
        id=member.id,
        user_id=member.user_id,
        user_name=member.user.name if member.user else "Unknown",
        user_email=member.user.email if member.user else "",
        is_active=member.is_active,
        joined_at=member.joined_at,
    )


def build_team_out(team: Team) -> TeamOut:
    return TeamOut(
        id=team.id,
        identifier=team.identifier,
        name=team.name,
        description=team.description,
        parameter=team.parameter,
        status=team.status,
        created_by=team.created_by,
        created_at=team.created_at,
        members=[build_member_out(m) for m in team.members if m.is_active],
    )


def build_team_out_simple(team: Team) -> TeamOutSimple:
    return TeamOutSimple(
        id=team.id,
        identifier=team.identifier,
        name=team.name,
        description=team.description,
        parameter=team.parameter,
        status=team.status,
        created_by=team.created_by,
        created_at=team.created_at,
        member_count=sum(1 for m in team.members if m.is_active),
    )


def next_team_identifier(db: Session) -> str:
    last = db.query(Team).filter(
        Team.identifier.like("TF-TEAM-%")
    ).order_by(Team.id.desc()).first()
    try:
        last_num = int(last.identifier.split("-")[-1]) if last else 0
    except (ValueError, AttributeError):
        last_num = 0
    return f"TF-TEAM-{str(last_num + 1).zfill(6)}"


# ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

@router.post("/admin", response_model=TeamOut, status_code=status.HTTP_201_CREATED)
def create_team(
    data: TeamCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """Admin creates a new team"""
    existing = db.query(Team).filter(
        Team.name == data.name,
        Team.parameter == data.parameter,
        Team.deleted_at == None,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A team with this name already exists for that parameter"
        )

    team = Team(
        identifier=next_team_identifier(db),
        name=data.name,
        description=data.description,
        parameter=data.parameter,
        status="active",
        created_by=current_admin.id,
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return build_team_out(team)


@router.get("/admin", response_model=List[TeamOutSimple])
def admin_get_all_teams(
    parameter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """Admin lists all teams, optionally filtered by parameter"""
    query = db.query(Team).filter(Team.deleted_at == None)
    if parameter:
        query = query.filter(Team.parameter == parameter)
    return [build_team_out_simple(t) for t in query.order_by(Team.created_at.desc()).all()]


@router.get("/admin/{team_id}", response_model=TeamOut)
def admin_get_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    team = db.query(Team).filter(Team.id == team_id, Team.deleted_at == None).first()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    return build_team_out(team)


@router.patch("/admin/{team_id}", response_model=TeamOut)
def update_team(
    team_id: int,
    data: TeamUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """Admin updates team details (PATCH — all fields optional)"""
    # BUG FIX: was PUT; TeamUpdate has all optional fields so PATCH is correct
    team = db.query(Team).filter(Team.id == team_id, Team.deleted_at == None).first()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if data.name is not None:
        team.name = data.name
    if data.description is not None:
        team.description = data.description
    if data.parameter is not None:
        team.parameter = data.parameter
    if data.status is not None:
        if data.status not in ("active", "inactive"):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="status must be 'active' or 'inactive'"
            )
        team.status = data.status

    team.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(team)
    return build_team_out(team)


@router.delete("/admin/{team_id}", status_code=status.HTTP_200_OK)
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """Admin soft-deletes a team"""
    team = db.query(Team).filter(Team.id == team_id, Team.deleted_at == None).first()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    team.deleted_at = datetime.utcnow()
    db.commit()
    return {"success": True, "message": f"Team '{team.name}' deleted"}


# ─── MEMBER MANAGEMENT (Admin) ────────────────────────────────────────────────

@router.post("/admin/{team_id}/members", response_model=TeamOut, status_code=status.HTTP_201_CREATED)
def add_members_to_team(
    team_id: int,
    data: AddMembersRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """Admin adds one or more users to a team"""
    team = db.query(Team).filter(Team.id == team_id, Team.deleted_at == None).first()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    for user_id in data.user_ids:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            continue  # Skip missing users silently (or raise — design choice)

        existing_member = db.query(TeamMember).filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id,
        ).first()

        if existing_member:
            if not existing_member.is_active:
                existing_member.is_active = True
                existing_member.joined_at = datetime.utcnow()
        else:
            db.add(TeamMember(team_id=team_id, user_id=user_id, is_active=True))

    db.commit()
    db.refresh(team)
    return build_team_out(team)


@router.delete("/admin/{team_id}/members/{user_id}", status_code=status.HTTP_200_OK)
def remove_member_from_team(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """Admin removes a user from a team (soft — sets is_active=False)"""
    member = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id,
        TeamMember.is_active == True,
    ).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this team"
        )
    member.is_active = False
    db.commit()
    return {"success": True, "message": "Member removed from team"}


# ─── USER ROUTES ──────────────────────────────────────────────────────────────

@router.get("/my-team", response_model=List[TeamOut])
def get_my_teams(
    current_user: User = Depends(AuthMiddleware),
    db: Session = Depends(get_db),
):
    """Authenticated user sees their team(s)"""
    memberships = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id,
        TeamMember.is_active == True,
    ).all()

    team_ids = [m.team_id for m in memberships]
    if not team_ids:
        return []

    teams = db.query(Team).filter(
        Team.id.in_(team_ids),
        Team.deleted_at == None,
        Team.status == "active",
    ).all()
    return [build_team_out(t) for t in teams]
