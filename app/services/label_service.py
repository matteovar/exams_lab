# app/services/label_service.py
from app.models import db

def generate_label(patient_name, exam_type):
    return {
        "patient_name": patient_name,
        "exam_type": exam_type
    }