from enum import Enum

class GenderEnum(str, Enum):
    male = "male"
    female = "female"

class RoleEnum(str, Enum):
    student = "student"
    admin = "admin"
    mentor = "mentor"

class Reputation(str, Enum):
    verified = "verified"
    unverified = "unverified"
