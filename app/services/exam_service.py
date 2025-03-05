# app/services/exam_service.py
from app.models import Exam, db

def create_exam(patient_name, category, subcategory, result, details):
    new_exam = Exam(
        patient_name=patient_name,
        category=category,
        subcategory=subcategory,
        result=result,
        details=details
    )
    db.session.add(new_exam)
    db.session.commit()
    return new_exam