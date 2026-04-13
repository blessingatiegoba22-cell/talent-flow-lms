import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

# Render provides a single DATABASE_URL env var for PostgreSQL.
# We support it directly, and fall back to individual vars for local dev.
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render gives a "postgres://" URL — SQLAlchemy needs "postgresql://"
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DB_URL = DATABASE_URL
else:
    DB_USER     = os.getenv("DB_USER",     "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
    DB_HOST     = os.getenv("DB_HOST",     "localhost")
    DB_PORT     = os.getenv("DB_PORT",     "5432")
    DB_DATABASE = os.getenv("DB_DATABASE", "talent_flow_db")
    SQLALCHEMY_DB_URL = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}"
    )

logger.info(f"Database connecting to host: {SQLALCHEMY_DB_URL.split('@')[-1] if '@' in SQLALCHEMY_DB_URL else 'unknown'}")

engine = create_engine(
    SQLALCHEMY_DB_URL,
    echo=False,
    pool_pre_ping=True,        # auto-reconnect on dropped connections
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
