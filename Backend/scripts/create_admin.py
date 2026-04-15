import sys
import os
import uuid  

# Required so the script can be run directly from the scripts/ directory.
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

import bcrypt

from app.database import SessionLocal, engine
from app.models.base import Base

# --- Import ALL models so SQLAlchemy registers every table in Base.metadata
from app.models.admin import Admin, AdminRole
from app.models.user import User
from app.models.mentor import Mentor
from app.models.course import Course        
from app.models.team import TeamMember
# Add any other models here as your schema grows


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def generate_identifier() -> str:
    return "TF-ADMIN-" + str(uuid.uuid4())[:8].upper()


def create_admin() -> None:
    # Validate required env vars up front so we fail fast with a clear message
    email = os.getenv("FIRST_ADMIN_EMAIL")
    password = os.getenv("FIRST_ADMIN_PASSWORD")

    if not email or not password:
        raise EnvironmentError(
            "FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD must be set in the environment."
        )

    # Create all tables (idempotent — skips tables that already exist)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(Admin).filter(Admin.email == email).first()
        if existing:
            print(f"⚠️  Admin already exists: {existing.email}")
            return

        admin = Admin(
            name="TalentFlow Admin",
            email=email,
            password=hash_password(password),
            role=AdminRole.admin,
            identifier=generate_identifier(),
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("✅ Admin created successfully!")
        print(f"   ID:         {admin.id}")
        print(f"   Email:      {admin.email}")
        print(f"   Role:       {admin.role}")
        print(f"   Identifier: {admin.identifier}")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()  # FIX: always closes, even if an exception is raised


if __name__ == "__main__":
    create_admin()