"""
Team Assignment Service - Automatically assigns users to teams and mentors to teams
"""
from sqlalchemy.orm import Session
from app.models.team import Team, TeamMember
from app.models.user import User as UserModel
from app.models.mentor import Mentor
from datetime import datetime
import random


class TeamAssignmentService:
    """Service for automatic team and mentor assignment"""
    
    @staticmethod
    def assign_user_to_team_on_registration(user_id: int, db: Session):
        """Automatically assign a new user to a team when they register"""
        try:
            # Get the user
            user = db.query(UserModel).filter(UserModel.id == user_id).first()
            if not user:
                return False
            
            # Get available teams
            available_teams = db.query(Team).filter(
                Team.status == "active"
            ).all()
            
            if not available_teams:
                return False
            
            # Find the team with the least members
            team_with_least_members = None
            min_member_count = float('inf')
            
            for team in available_teams:
                member_count = db.query(TeamMember).filter(
                    TeamMember.team_id == team.id,
                    TeamMember.is_active == True
                ).count()
                
                if member_count < team.max_members and member_count < min_member_count:
                    min_member_count = member_count
                    team_with_least_members = team
            
            if not team_with_least_members:
                return False
            
            # Assign user to the team
            team_member = TeamMember(
                team_id=team_with_least_members.id,
                user_id=user_id,
                role="member",
                joined_at=datetime.utcnow()
            )
            
            db.add(team_member)
            db.commit()
            
            return True
            
        except Exception as e:
            db.rollback()
            print(f"Error assigning user to team: {e}")
            return False
    
    @staticmethod
    def assign_mentor_to_team(mentor_id: int, team_id: int, db: Session):
        """Assign a mentor to a specific team"""
        try:
            # Check if mentor exists
            mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
            if not mentor:
                return False
            
            # Check if team exists
            team = db.query(Team).filter(Team.id == team_id).first()
            if not team:
                return False
            
            # Check if mentor is already assigned to this team
            existing_assignment = db.query(TeamMember).filter(
                TeamMember.team_id == team_id,
                TeamMember.user_id == mentor.user_id,
                TeamMember.is_active == True
            ).first()
            
            if existing_assignment:
                # Update role to lead if not already
                if existing_assignment.role != "lead":
                    existing_assignment.role = "lead"
                    db.commit()
                return True
            
            # Assign mentor to team as lead
            team_member = TeamMember(
                team_id=team_id,
                user_id=mentor.user_id,
                role="lead",
                joined_at=datetime.utcnow()
            )
            
            db.add(team_member)
            db.commit()
            
            return True
            
        except Exception as e:
            db.rollback()
            print(f"Error assigning mentor to team: {e}")
            return False
    
    @staticmethod
    def create_default_teams_if_none_exist(db: Session):
        """Create default teams if none exist"""
        try:
            # Check if teams already exist
            existing_teams = db.query(Team).count()
            if existing_teams > 0:
                return True
            
            # Create default teams
            default_teams = [
                {
                    "name": "Alpha Team",
                    "description": "JavaScript and Web Development team",
                    "max_members": 10,
                    "status": "active"
                },
                {
                    "name": "Beta Team", 
                    "description": "Python and Backend Development team",
                    "max_members": 10,
                    "status": "active"
                },
                {
                    "name": "Gamma Team",
                    "description": "Data Science and AI team",
                    "max_members": 10,
                    "status": "active"
                }
            ]
            
            for team_data in default_teams:
                team = Team(
                    name=team_data["name"],
                    description=team_data["description"],
                    max_members=team_data["max_members"],
                    status=team_data["status"],
                    created_by=1  # Admin ID
                )
                db.add(team)
            
            db.commit()
            return True
            
        except Exception as e:
            db.rollback()
            print(f"Error creating default teams: {e}")
            return False
    
    @staticmethod
    def assign_mentors_to_teams(db: Session):
        """Assign available mentors to teams"""
        try:
            # Get all mentors
            mentors = db.query(Mentor).all()
            
            # Get all teams
            teams = db.query(Team).filter(Team.status == "active").all()
            
            if not mentors or not teams:
                return False
            
            # Assign mentors to teams in round-robin fashion
            for i, mentor in enumerate(mentors):
                team_index = i % len(teams)
                team = teams[team_index]
                
                # Check if mentor is already assigned to this team
                existing_assignment = db.query(TeamMember).filter(
                    TeamMember.team_id == team.id,
                    TeamMember.user_id == mentor.user_id,
                    TeamMember.is_active == True
                ).first()
                
                if not existing_assignment:
                    TeamAssignmentService.assign_mentor_to_team(mentor.id, team.id, db)
            
            return True
            
        except Exception as e:
            print(f"Error assigning mentors to teams: {e}")
            return False
    
    @staticmethod
    def get_user_team_info(user_id: int, db: Session):
        """Get team information for a user"""
        try:
            team_member = db.query(TeamMember).filter(
                TeamMember.user_id == user_id,
                TeamMember.is_active == True
            ).first()
            
            if not team_member:
                return None
            
            team = db.query(Team).filter(Team.id == team_member.team_id).first()
            
            if not team:
                return None
            
            # Get team members
            team_members = db.query(TeamMember).filter(
                TeamMember.team_id == team.id,
                TeamMember.is_active == True
            ).all()
            
            # Get team members' user info
            members_info = []
            for member in team_members:
                user = db.query(UserModel).filter(UserModel.id == member.user_id).first()
                if user:
                    members_info.append({
                        "user_id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": user.role,
                        "team_role": member.role,
                        "joined_at": member.joined_at
                    })
            
            return {
                "team_id": team.id,
                "team_name": team.name,
                "team_description": team.description,
                "user_role": team_member.role,
                "team_members": members_info,
                "member_count": len(members_info)
            }
            
        except Exception as e:
            print(f"Error getting user team info: {e}")
            return None
