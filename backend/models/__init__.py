from flask_sqlalchemy import SQLAlchemy

# Inicializa a extensão do banco de dados
db = SQLAlchemy()

# Importa todos os modelos para que sejam registrados com o SQLAlchemy
from .user import User  # noqa

__all__ = ["db", "User"]
