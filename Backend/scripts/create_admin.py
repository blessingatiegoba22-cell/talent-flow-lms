import sys, os, uuid
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal, engine
from app.models.base import Base
from app.models.admin import Admin, AdminRole
# from core.security import hash_password
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def generate_identifier():
    return "TF-ADMIN-" + str(uuid.uuid4())[:8].upper()


def create_admin():
    # Create table if it doesn't exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if admin already exists
    existing = db.query(Admin).filter(
        Admin.email == os.getenv("FIRST_ADMIN_EMAIL")
    ).first()

    if existing:
        print(f"⚠️  Admin already exists: {existing.email}")
        db.close()
        return

    admin = Admin(
        # id=str(uuid.uuid4()),
        name="TalentFlow Admin",
        email=os.getenv("FIRST_ADMIN_EMAIL"),
        password=hash_password(os.getenv("FIRST_ADMIN_PASSWORD")),
        role=AdminRole.admin,
        identifier=generate_identifier(),
        is_active=True
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    print("✅ Admin created successfully!")
    print(f"   ID:         {admin.id}")
    print(f"   Email:      {admin.email}")
    print(f"   Role:       {admin.role}")
    print(f"   Identifier: {admin.identifier}")
    db.close()


if __name__ == "__main__":
    create_admin()