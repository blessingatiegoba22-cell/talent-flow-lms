from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, SessionLocal
from app.models.base import Base
import logging
import time
import os
from app.routes import user, auth, course
from app.routes.admin import router as admin_router
from app.routes.mentor import router as mentor_router
from app.routes.mentor_auth import router as mentor_auth_router
from app.routes.team import router as team_router
from app.models import team  
from scripts.create_sample_courses import seed_courses

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT.lower() == "production"

app = FastAPI(
    title="TalentFlow LMS",
    version="1.0.0",
    description="TalentFlow Learning Management System API",
    # Disable interactive docs in production for security
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)


def db_and_table_init():
    retries = 10
    for i in range(retries):
        try:
            logger.info("Initializing database tables...")
            Base.metadata.create_all(bind=engine)
            logger.info("Database initialization successful.")
            return
        except Exception as e:
            logger.warning(f"DB not ready, retrying ({i+1}/{retries})... Error: {e}")
            time.sleep(3)
    logger.error("Could not connect to database after maximum retries. Exiting.")
    raise RuntimeError("Database connection failed on startup.")


def run_seed():
    """Run course seeding after tables exist."""
    db = SessionLocal()
    try:
        seed_courses(db)
    except Exception as e:
        logger.warning(f"Course seeding failed (non-fatal): {e}")
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    db_and_table_init()
    run_seed()


# CORS — restrict to known frontend origin(s) in production
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(course.router)
app.include_router(admin_router)
app.include_router(mentor_router)
app.include_router(mentor_auth_router)
app.include_router(team_router)


@app.get("/")
def root():
    return {"message": "TalentFlow API is running 🚀", "environment": ENVIRONMENT}


@app.get("/health")
def health_check():
    return {"status": "healthy"}