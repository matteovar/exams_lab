from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subcategories = db.relationship('SubCategory', backref='category', lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"

class SubCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

    def __repr__(self):
        return f"<SubCategory {self.name}>"

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)  # Nome completo
    cpf = db.Column(db.String(14), unique=True, nullable=False)  # CPF
    phone = db.Column(db.String(15), nullable=False)  # Telefone
    address = db.Column(db.String(200), nullable=False)  # Endereço
    age = db.Column(db.Integer, nullable=False)  # Idade
    gender = db.Column(db.String(10), nullable=False)  # Sexo

    def __repr__(self):
        return f"<Patient {self.full_name}>"

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100), nullable=False)
    result = db.Column(db.String(100), nullable=False)
    details = db.Column(JSON)  # Campo JSON para armazenar os detalhes específicos
    barcode_id = db.Column(db.String(14), unique=True, nullable=False)  # ID do código de barras

    def __repr__(self):
        return f"<Exam {self.patient_name} - {self.category} - {self.subcategory}>"