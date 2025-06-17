from datetime import datetime

from . import db  # Você precisará configurar o banco de dados


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'medico' ou 'usuario'
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Médico-specific fields
    crm = db.Column(db.String(20), nullable=True)
    specialty = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "user_type": self.user_type,
            "crm": self.crm if self.user_type == "medico" else None,
        }
