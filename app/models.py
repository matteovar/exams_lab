from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON

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

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100), nullable=False)
    health_issues = db.Column(db.String(500))  # Novo campo
    allergies = db.Column(db.String(500))      # Novo campo
    family_health_issues = db.Column(db.String(500))  # Novo campo
    medications = db.Column(db.String(500))    # Novo campo
    previous_surgeries = db.Column(db.String(500))  # Novo campo

    def __repr__(self):
        return f"<User {self.patient_name}>"

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name= db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100), nullable=False)
    result = db.Column(db.String(100), nullable=False)
    details = db.Column(JSON)  

    def __repr__(self):
        return f"<Exam {self.category} - {self.subcategory}>"