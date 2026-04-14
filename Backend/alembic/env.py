import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

config = context.config
fileConfig(config.config_file_name)

from app.models.base import Base
# Import all models so Alembic can detect them for autogenerate
from app.models import user, admin, mentor, course, task, team  # noqa: F401

target_metadata = Base.metadata


def get_database_url() -> str:
    """
    Build the database URL. Supports:
    - DATABASE_URL env var (Render PostgreSQL provides this)
    - Individual DB_* env vars (local dev / Docker)
    """
    url = os.getenv("DATABASE_URL")
    if url:
        # Render gives "postgres://..." — SQLAlchemy needs "postgresql://..."
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    user     = os.getenv("DB_USER",     "postgres")
    password = os.getenv("DB_PASSWORD", "postgres")
    host     = os.getenv("DB_HOST",     "localhost")
    port     = os.getenv("DB_PORT",     "5432")
    dbname   = os.getenv("DB_DATABASE", "talent_flow_db")
    return f"postgresql://{user}:{password}@{host}:{port}/{dbname}"


config.set_main_option("sqlalchemy.url", get_database_url())


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
