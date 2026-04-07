from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models.base import Base
import logging
import time
from app.routes import user, auth, course
from app.routes.admin import router as admin_router
from app.routes.mentor import router as mentor_router
from app.routes.mentor_auth import router as mentor_auth_router

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
            logger.warning(f"MySQL NOT READY, RETRYING ({i+1}/{retries})...")
            logger.error(f"Error: {e}")
            time.sleep(3)

@app.on_event("startup")
def on_startup():
    db_and_table_init()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(course.router)
app.include_router(admin_router)
app.include_router(mentor_router)
app.include_router(mentor_auth_router)

@app.get("/")
def root():
    return {"message": "TalentFlow API is running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
