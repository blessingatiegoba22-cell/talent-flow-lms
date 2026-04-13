# Import models in correct order to avoid circular dependencies
from app.models.base import Base
from app.models.user import User
from app.models.admin import Admin, Course, Program
from app.models.mentor import Mentor, MentorAssignment

# Import team models separately to avoid circular dependencies
try:
    from app.models.team import Team, TeamMember, TeamCourse
except ImportError:
    # Team models not available yet
    pass

# Import task models
try:
    from app.models.task import Task, TaskSubmission
except ImportError:
    # Task models not available yet
    pass

__all__ = [
    'Base',
    'User',
    'Admin', 'Course', 'Program',
    'Mentor', 'MentorAssignment',
]
