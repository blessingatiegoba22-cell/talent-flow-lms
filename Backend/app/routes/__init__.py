from . import user, auth, course

__all__ = ["user", "auth", "course"]
from app.routes.admin import router as admin_router
