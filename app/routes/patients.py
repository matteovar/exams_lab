# app/routes/patients.py
from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.models import Patient, db
from app.services.patient_service import create_patient
from app.routes.exams import EXAM_TYPES  # Importe EXAM_TYPES

patients_bp = Blueprint('patients', __name__)

@patients_bp.route('/patient_form', methods=['GET', 'POST'])
def patient_form():
    if request.method == 'POST':
        full_name = request.form['full_name']
        street = request.form['street']
        phone = request.form['phone']
        email = request.form['email']
        cpf = request.form['cpf']
        exams = request.form.getlist('exams')

        create_patient(full_name, street, phone, email, cpf, exams)
        return redirect(url_for('patients.home'))

    return render_template('patient_form.html', exam_types=EXAM_TYPES)