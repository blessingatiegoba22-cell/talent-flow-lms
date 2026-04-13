from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.enums import RoleEnum, GenderEnum, Reputation

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    gender = Column(Enum(GenderEnum), nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.student, nullable=False)
    verified = Column(Enum(Reputation), default=Reputation.unverified, nullable=False)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    # team_memberships = relationship("TeamMember", back_populates="user", foreign_keys="TeamMember.user_id", lazy="dynamic")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"
