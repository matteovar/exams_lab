# app/routes/exams.py
from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.models import Exam, db
from app.services.exam_service import create_exam

exams_bp = Blueprint('exams', __name__)

# Lista de tipos de exames pré-definidos (categorias)
EXAM_TYPES = ['Hemograma', 'Ultrassonografia', 'Raio-X', 'Tomografia', 'Eletrocardiograma']

# Subcategorias para cada tipo de exame
EXAM_SUBCATEGORIES = {
    'Hemograma': ['Hemograma Completo', 'Plaquetas', 'Leucócitos'],
    'Ultrassonografia': ['Ultrassonografia Abdominal', 'Ultrassonografia Pélvica'],
    'Raio-X': ['Raio-X Torácico', 'Raio-X Ósseo'],
    'Tomografia': ['Tomografia Computadorizada', 'Tomografia por Emissão'],
    'Eletrocardiograma': ['Eletrocardiograma de Repouso', 'Eletrocardiograma de Esforço']
}

@exams_bp.route('/')
def root():
    return redirect(url_for('exams.home'))

@exams_bp.route('/home')
def home():
    return render_template('index.html')

@exams_bp.route('/exame')
def exame():
    return render_template('exame.html', exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

@exams_bp.route('/submit', methods=['POST'])
def submit_exam():
    patient_name = request.form['patient_name']
    category = request.form['category']
    subcategory = request.form['subcategory']
    result = request.form.get('result', '')
    details = {key: value for key, value in request.form.items() if key not in ['patient_name', 'category', 'subcategory', 'result']}

    create_exam(patient_name, category, subcategory, result, details)
    return redirect(url_for('exams.results'))

@exams_bp.route('/results')
def results():
    exams = Exam.query.all()
    grouped_exams = {}
    for exam in exams:
        if exam.patient_name not in grouped_exams:
            grouped_exams[exam.patient_name] = {
                "category": exam.category,
                "exams": []
            }
        grouped_exams[exam.patient_name]["exams"].append({
            "id": exam.id,
            "subcategory": exam.subcategory,
            "result": exam.result,
            "details": exam.details
        })
    return render_template('result.html', grouped_exams=grouped_exams)

@exams_bp.route('/edit/<int:exam_id>', methods=['GET', 'POST'])
def edit_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)
    if request.method == 'POST':
        exam.patient_name = request.form['patient_name']
        exam.category = request.form['category']
        exam.subcategory = request.form['subcategory']
        exam.result = request.form['result']
        details = {key: value for key, value in request.form.items() if key not in ['patient_name', 'category', 'subcategory', 'result']}
        exam.details = details
        db.session.commit()
        return redirect(url_for('exams.results'))
    return render_template('edit_exam.html', exam=exam, exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

@exams_bp.route('/delete/<int:exam_id>', methods=['GET', 'POST'])
def delete_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)
    db.session.delete(exam)
    db.session.commit()
    return redirect(url_for('exams.results'))