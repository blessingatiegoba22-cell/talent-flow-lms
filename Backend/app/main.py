from fastapi import FastAPI, status, HTTPException
from fastapi.staticfiles import StaticFiles
from database import engine
from models.base import Base
import logging
import time
import os
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.exc import OperationalError
from routes import user, auth, course


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PayIt App",
    version="0.0.1",
    description="market place..."
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

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(course.router)

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Hello world"
    }
