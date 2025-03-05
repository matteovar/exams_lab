# app/routes/__init__.py
from .exams import exams_bp
from .patients import patients_bp
from .labels import labels_bp

__all__ = ['exams_bp', 'patients_bp', 'labels_bp']