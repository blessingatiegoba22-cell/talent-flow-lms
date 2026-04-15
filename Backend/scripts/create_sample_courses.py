"""
seed_courses.py — Seed sample courses into the database on startup.

Called from app/main.py after table creation. Uses the first admin or
mentor user as the instructor. If no such user exists, courses are not
seeded (they will be seeded on next startup once a privileged user
has been created via the admin script).
"""

import sys
import os  

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import logging  

from sqlalchemy.orm import Session  

from app.models.admin import Admin, AdminRole   
from app.models.course import Course            
from app.models.mentor import Mentor
from app.models.team import TeamMember
from app.models.user import User

logger = logging.getLogger(__name__)  

SAMPLE_COURSES = [
    {
        "title": "Introduction to Python Programming",
        "description": (
            "Learn the fundamentals of Python from scratch. Covers variables, "
            "control flow, functions, modules, and basic OOP — everything you "
            "need to start writing real scripts and applications."
        ),
        "category": "Programming",
        "level": "beginner",
        "duration_hours": 40,
        "price": "Free",
        "is_published": True,
    },
    {
        "title": "Advanced Web Development with React & Node.js",
        "description": (
            "Master the modern full-stack JavaScript ecosystem. Build scalable "
            "SPAs with React, RESTful APIs with Express/Node, and deploy "
            "production-ready applications."
        ),
        "category": "Web Development",
        "level": "advanced",
        "duration_hours": 60,
        "price": "Free",
        "is_published": True,
    },
    {
        "title": "Database Design Fundamentals",
        "description": (
            "Understand relational database design, normalisation, indexing, "
            "and query optimisation. Hands-on practice with PostgreSQL."
        ),
        "category": "Database",
        "level": "intermediate",
        "duration_hours": 30,
        "price": "Free",
        "is_published": True,
    },
    {
        "title": "FastAPI: Building Production APIs",
        "description": (
            "Create high-performance REST APIs with FastAPI, SQLAlchemy, "
            "Pydantic, Alembic, and PostgreSQL. Covers auth, testing, and "
            "Docker deployment."
        ),
        "category": "Backend Development",
        "level": "intermediate",
        "duration_hours": 25,
        "price": "Free",  
        "is_published": True,
    },
    {
        "title": "Data Science with Python",
        "description": (
            "A hands-on introduction to data analysis using Pandas, NumPy, "
            "Matplotlib, and Scikit-learn. Suitable for beginners with basic "
            "Python knowledge."
        ),
        "category": "Data Science",
        "level": "beginner",
        "duration_hours": 50,
        "price": "Free",
        "is_published": True,
    },
]


def seed_courses(db: Session) -> None:
    """
    Idempotently insert sample courses. Skips courses whose titles
    already exist so re-running on subsequent startups is safe.
    """
    # Find a suitable instructor (admin first, then mentor, then any user)
    instructor = (
        db.query(User).filter(User.role == "admin").first()
        or db.query(User).filter(User.role == "mentor").first()
        or db.query(User).first()
    )

    if not instructor:
        logger.info(
            "No users found — skipping course seeding. "
            "Re-run after first user is created."
        )
        return

    seeded = 0
    for data in SAMPLE_COURSES:
        exists = db.query(Course).filter(Course.title == data["title"]).first()
        if exists:
            continue

        course = Course(
            title=data["title"],
            description=data["description"],
            category=data["category"],
            level=data["level"],
            duration_hours=data["duration_hours"],
            price=data["price"],
            instructor_id=instructor.id,
            is_published=data["is_published"],
        )
        db.add(course)
        seeded += 1

    if not seeded:
        logger.info("All sample courses already exist — nothing to seed.")
        return


    # instead of leaving the session in a dirty/broken state.
    try:
        db.commit()
        logger.info("Seeded %d sample course(s) into the database.", seeded)
    except Exception:
        db.rollback()
        logger.exception("Failed to seed courses — transaction rolled back.")
        raise


# keeping imports side-effect-free for callers (e.g. app/main.py).
if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    from app.database import SessionLocal  # adjust to your actual session factory

    logging.basicConfig(level=logging.INFO)

    db_session = SessionLocal()
    try:
        seed_courses(db_session)
    finally:
        db_session.close()