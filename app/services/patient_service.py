# app/services/patient_service.py
from app.models import Patient, db

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