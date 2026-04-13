from enum import Enum as PyEnum

class AdminRole(str, PyEnum):
    learner = "learner"
    instructor = "instructor"
    admin = "admin"
    super_admin = "super_admin"
