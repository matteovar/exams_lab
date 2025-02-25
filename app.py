from flask import Flask, render_template, request, redirect, url_for
from models import db, Exam, Category, SubCategory
from collections import defaultdict

app = Flask(__name__)

# Configuração do banco de dados (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exams.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco de dados
db.init_app(app)

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

EXAM_SUBCATEGORY_FIELDS = {
    "Leucócitos": ["Número total de leucócitos", "Leucograma diferencial"],
    "Plaquetas": ["Contagem de plaquetas", "Volume plaquetário médio"],
    "Hemograma Completo": ["Hemoglobina", "Hematócrito", "Contagem de glóbulos vermelhos"],
    # Adicione mais subcategorias e campos conforme necessário
}

@app.route('/')
def index():
    return render_template('index.html', exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)


# Rota para receber e processar os dados do exame
@app.route('/submit', methods=['POST'])
def submit_exam():
    # Coleta os dados do formulário
    patient_name = request.form['patient_name']
    category = request.form['category']
    subcategory = request.form['subcategory']
    result = request.form.get('result', '')

    # Coleta os campos dinâmicos
    details = {}
    for key, value in request.form.items():
        if key not in ['patient_name', 'category', 'subcategory', 'result']:
            details[key] = value

    # Verifica se o paciente já existe
    existing_patient = Exam.query.filter_by(patient_name=patient_name).first()

    if existing_patient:
        # Se o paciente já existe, cria um novo exame para ele
        new_exam = Exam(
            patient_name=patient_name,
            category=category,
            subcategory=subcategory,
            result=result,
            details=details
        )
        db.session.add(new_exam)
    else:
        # Se o paciente não existe, cria um novo paciente com o primeiro exame
        new_exam = Exam(
            patient_name=patient_name,
            category=category,
            subcategory=subcategory,
            result=result,
            details=details
        )
        db.session.add(new_exam)

    db.session.commit()  # Salva no banco

    # Após inserir o exame, redireciona para a página de resultados
    return redirect(url_for('results'))

# Rota para exibir todos os resultados de exames
@app.route('/results')
def results():
    # Recupera todos os exames do banco de dados
    exams = Exam.query.all()

    # Agrupa os exames por paciente
    grouped_exams = defaultdict(list)
    for exam in exams:
        grouped_exams[exam.patient_name].append(exam)

    # Passa os exames agrupados para o template 'result.html'
    return render_template('result.html', grouped_exams=grouped_exams)

@app.route('/edit/<int:exam_id>', methods=['GET', 'POST'])
def edit_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)

    if request.method == 'POST':
        # Atualiza os dados do exame
        exam.patient_name = request.form['patient_name']
        exam.category = request.form['category']
        exam.subcategory = request.form['subcategory']
        exam.result = request.form['result']
        
        # Coleta os campos dinâmicos
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

# Rota para obter subcategorias via AJAX
@app.route('/get_subcategories/<int:category_id>')
def get_subcategories(category_id):
    subcategories = SubCategory.query.filter_by(category_id=category_id).all()
    return render_template('subcategories_options.html', subcategories=subcategories)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)