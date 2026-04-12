from enum import Enum as PyEnum

class AdminRole(str, PyEnum):
    learner = "learner"
    admin = "admin"
    super_admin = "super_admin"
