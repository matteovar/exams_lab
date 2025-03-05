# app/routes/labels.py
from flask import Blueprint, render_template, request
from app.services.label_service import generate_label
from app.routes.exams import EXAM_TYPES  # Importe EXAM_TYPES

labels_bp = Blueprint('labels', __name__)

@labels_bp.route('/generate_label', methods=['GET', 'POST'])
def generate_label_route():
    if request.method == 'POST':
        patient_name = request.form['patient_name']
        exam_type = request.form['exam_type']
        label_data = generate_label(patient_name, exam_type)
        return render_template('label.html', **label_data)
    return render_template('generate_label.html', exam_types=EXAM_TYPES)