from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import db, Exam, Category, SubCategory, User
from collections import defaultdict

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exams.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'sua_chave_secreta_aqui'  # Chave secreta para sessões

# Inicializa o banco de dados
db.init_app(app)

# Configuração do Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

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
@login_required
def index():
    return render_template('index.html', exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            flash('Login bem-sucedido!')
            return redirect(url_for('index'))
        else:
            flash('Usuário ou senha inválidos')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
@login_required
def register():
    if not current_user.is_admin:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        is_admin = 'is_admin' in request.form
        
        user = User(username=username, is_admin=is_admin)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('Usuário registrado com sucesso!')
        return redirect(url_for('index'))
    
    return render_template('register.html')

@app.route('/submit', methods=['POST'])
@login_required
def submit_exam():
    patient_name = request.form['patient_name']
    category = request.form['category']
    subcategory = request.form['subcategory']
    result = request.form.get('result', '')

    details = {}
    for key, value in request.form.items():
        if key not in ['patient_name', 'category', 'subcategory', 'result']:
            details[key] = value

    existing_patient = Exam.query.filter_by(patient_name=patient_name).first()

    if existing_patient:
        new_exam = Exam(
            patient_name=patient_name,
            category=category,
            subcategory=subcategory,
            result=result,
            details=details
        )
        db.session.add(new_exam)
    else:
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

@app.route('/results')
@login_required
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

@app.route('/edit/<int:exam_id>', methods=['GET', 'POST'])
@login_required
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

@app.route('/delete/<int:exam_id>', methods=['GET', 'POST'])
@login_required
def delete_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)
    db.session.delete(exam)
    db.session.commit()
    return redirect(url_for('results'))

@app.route('/get_subcategories/<int:category_id>')
def get_subcategories(category_id):
    subcategories = SubCategory.query.filter_by(category_id=category_id).all()
    return render_template('subcategories_options.html', subcategories=subcategories)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)