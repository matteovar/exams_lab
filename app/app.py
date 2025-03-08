from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from models import db, Exam
from collections import defaultdict
import json
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exams.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'sua_chave_secreta_aqui'

# Inicializa o banco de dados
db.init_app(app)

# Caminho para os arquivos JSON dentro da subpasta 'info'
current_dir = os.path.dirname(os.path.abspath(__file__))
categories_path = os.path.join(current_dir, 'static', 'infos', 'categorias.json')
subcategories_path = os.path.join(current_dir, 'static', 'infos', 'subcategories.json')

# Carrega as categorias e subcategorias dos arquivos JSON
with open(categories_path, 'r', encoding='utf-8') as file:
    EXAM_TYPES = json.load(file)

with open(subcategories_path, 'r', encoding='utf-8') as file:
    EXAM_SUBCATEGORIES = json.load(file)


# Rota para a raiz (/) - Redireciona para a página inicial
@app.route('/')
def root():
    return redirect(url_for('home'))

# Rota para a página inicial
@app.route('/home')
def home():
    return render_template('index.html')

# Rota para a página de exame
@app.route('/exame')
def exame():
    return render_template('exame.html', exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

# Rota para gerar etiqueta
@app.route('/generate_label', methods=['GET', 'POST'])
def generate_label():
    if request.method == 'POST':
        patient_name = request.form['patient_name']
        exam_type = request.form['exam_type']
        return render_template('label.html', patient_name=patient_name, exam_type=exam_type)
    return render_template('generate_label.html', exam_types=EXAM_TYPES)

# Rota para registrar exame
@app.route('/submit', methods=['POST'])
def submit_exam():
    patient_name = request.form['patient_name']
    category = request.form['category']
    subcategory = request.form['subcategory']
    result = request.form.get('result', '')

    details = {}
    for key, value in request.form.items():
        if key not in ['patient_name', 'category', 'subcategory', 'result']:
            details[key] = value

    new_exam = Exam(
        patient_name=patient_name,
        category=category,
        subcategory=subcategory,
        result=result,
        details=details
    )
    db.session.add(new_exam)
    db.session.commit()
    return redirect(url_for('results'))

# Rota para exibir todos os resultados de exames
@app.route('/results')
def results():
    exams = Exam.query.all()
    grouped_exams = defaultdict(lambda: {"category": None, "exams": []})
    for exam in exams:
        if not grouped_exams[exam.patient_name]["category"]:
            grouped_exams[exam.patient_name]["category"] = exam.category
        grouped_exams[exam.patient_name]["exams"].append({
            "id": exam.id,
            "subcategory": exam.subcategory,
            "result": exam.result,
            "details": exam.details
        })
    return render_template('result.html', grouped_exams=grouped_exams)

# Rota para a página de pesquisa do cliente
@app.route('/client_record_search', methods=['GET', 'POST'])
def client_record_search():
    if request.method == 'POST':
        print(request.form)  # Verifique se os dados estão sendo recebidos corretamente
        patient_name = request.form['patient_name']
        cpf = request.form['cpf']
        phone = request.form['phone']
        address = request.form['address']
        category = request.form['category']
        subcategory = request.form['subcategory']
        
        # Salva os dados do cliente e do exame no banco de dados
        new_exam = Exam(
            patient_name=patient_name,
            cpf=cpf,
            phone=phone,
            address=address,
            category=category,
            subcategory=subcategory,
            result="",  # Resultado vazio por enquanto
            details={}  # Detalhes vazios por enquanto
        )
        db.session.add(new_exam)
        db.session.commit()
        
        flash('Ficha do cliente e exame salvos com sucesso!', 'success')
        return redirect(url_for('client_record', patient_name=patient_name))
    
    return render_template('client_record_search.html', exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

# Rota para exibir a ficha do cliente
@app.route('/client_record/<string:patient_name>')
def client_record(patient_name):
    exams = Exam.query.filter_by(patient_name=patient_name).all()
    
    if not exams:
        flash(f'Nenhum exame encontrado para o paciente: {patient_name}', 'warning')
        return redirect(url_for('client_record_search'))
    
    # Pega as informações do cliente do primeiro exame (já que são as mesmas para todos os exames)
    client_info = {
        "cpf": exams[0].cpf,
        "phone": exams[0].phone,
        "address": exams[0].address
    }
    
    # Agrupa os exames por categoria
    grouped_exams = defaultdict(lambda: {"exams": []})
    for exam in exams:
        grouped_exams[exam.category]["exams"].append({
            "id": exam.id,
            "subcategory": exam.subcategory,
            "result": exam.result,
            "details": exam.details
        })
    
    return render_template(
        'client_record.html',
        patient_name=patient_name,
        cpf=client_info["cpf"],
        phone=client_info["phone"],
        address=client_info["address"],
        grouped_exams=grouped_exams
    )

# Rota para editar um exame
@app.route('/edit/<int:exam_id>', methods=['GET', 'POST'])
def edit_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)

    if request.method == 'POST':
        exam.patient_name = request.form['patient_name']
        exam.category = request.form['category']
        exam.subcategory = request.form['subcategory']
        exam.result = request.form['result']
        
        details = {}
        for key, value in request.form.items():
            if key not in ['patient_name', 'category', 'subcategory', 'result']:
                details[key] = value
        exam.details = details
        
        db.session.commit()
        return redirect(url_for('results'))
    
    return render_template('edit_exam.html', exam=exam, exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

# Rota para excluir um exame
@app.route('/delete/<int:exam_id>', methods=['GET', 'POST'])
def delete_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)
    db.session.delete(exam)
    db.session.commit()
    return redirect(url_for('results'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria as tabelas no banco de dados
    app.run(debug=True)