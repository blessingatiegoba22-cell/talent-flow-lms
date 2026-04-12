import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Password123!")
DB_HOST = os.getenv("DB_HOST", "talent_flow_db")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_DATABASE = os.getenv("DB_DATABASE", "talent_flow_db")

SQLALCHEMY_DB_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_DATABASE}"
)

print("DB_USER =", DB_USER)
print("DB_HOST =", DB_HOST)
print("DB_PASSWORD =", DB_PASSWORD)

print("DB URL:", SQLALCHEMY_DB_URL)  

engine = create_engine(SQLALCHEMY_DB_URL, echo=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
