from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TalentFlow LMS",
    version="1.0.0",
    description="TalentFlow Learning Management System API"
)


def db_and_table_init():
    retries = 30
    for i in range(retries):
        try:
            logger.info("Initializing database...")
            Base.metadata.create_all(bind=engine)
            logger.info("Database initialization successful.")
            break
        except Exception as e:
            logger.warning(f"PostgreSQL NOT READY, RETRYING ({i+1}/{retries})...")
            logger.error(f"Error: {e}")
            time.sleep(3)


@app.on_event("startup")
def on_startup():
    db_and_table_init()


# CORS — restrict origins in production
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,   # Never use ["*"] with credentials=True
    allow_credentials=True,           # Required for cookies to be sent cross-origin
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
    return {"message": "TalentFlow API is running 🚀"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
