from app import db  # Importe a instância db do app/__init__.py
from app.models import Patient

def create_patient(full_name, street, phone, email, cpf, exams):
    new_patient = Patient(
        full_name=full_name,
        street=street,
        phone=phone,
        email=email,
        cpf=cpf,
        exams=exams
    )
    db.session.add(new_patient)
    db.session.commit()
    return new_patient