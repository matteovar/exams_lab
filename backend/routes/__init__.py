from flask import Blueprint

api_bp = Blueprint("api", __name__, url_prefix="/api")

from .auth_routes import auth_bp  # noqa
from .medico_routes import medico_bp  # noqa
from .user_routes import usuario_bp  # noqa

__all__ = ["api_bp", "auth_bp", "medico_bp", "usuario_bp"]
