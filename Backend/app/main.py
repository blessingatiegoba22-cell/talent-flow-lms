from fastapi import FastAPI
from app.routes.admin import router as admin_router
from app.database import engine
from app.models.base import Base
from app.models.admin import Admin, Course, Program

# Creates all tables on startup if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TalentFlow LMS",
    version="1.0.0",
    description="TalentFlow Learning Management System API"
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Admin routes
app.include_router(admin_router)

# add your routers here:
# app.include_router(user_router)
# app.include_router(mentor_router)


@app.get("/")
def root():
    return {"message": "TalentFlow API is running 🚀"}