# app/models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON

db = SQLAlchemy()

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100), nullable=False)
    result = db.Column(db.String(100), nullable=False)
    details = db.Column(JSON)  # Campo JSON para armazenar os detalhes específicos

    def __repr__(self):
        return f"<Exam {self.patient_name} - {self.category} - {self.subcategory}>"

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), nullable=False, unique=True)
    exams = db.Column(JSON)  # Armazena a lista de exames selecionados

    def __repr__(self):
        return f"<Patient {self.full_name}>"