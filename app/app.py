from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from models import db, User, Exam, Category, SubCategory
from collections import defaultdict

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exams.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'sua_chave_secreta_aqui'

# Inicializa o banco de dados
db.init_app(app)

# Configuração do Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Função para criar o admin automaticamente
def create_admin():
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', is_admin=True)
        admin.set_password('admin123')  # Senha padrão para o admin
        db.session.add(admin)
        db.session.commit()
        print("Admin criado com sucesso!")

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

# Rota para a raiz (/) - Agora renderiza o que era home.html
@app.route('/')
def root():
    if current_user.is_authenticated:
        return redirect(url_for('home'))  # Redireciona para a página inicial (home)
    else:
        return redirect(url_for('login'))

# Rota para a página inicial (home) - Agora renderiza o que era home.html
@app.route('/home')
@login_required
def home():
    return render_template('index.html')  # Renderiza o que era home.html

# Rota para a página de exame (exame.html) - Agora renderiza o que era index.html
@app.route('/exame')
@login_required
def exame():
    return render_template('exame.html', exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)  # Passa exam_subcategories

# Rota para login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        
        if user:  # Verifica se o usuário existe
            if user.check_password(password):  # Verifica a senha
                login_user(user)
                flash('Login bem-sucedido!', 'success')
                return redirect(url_for('home'))
            else:
                flash('Senha incorreta.', 'error')
        else:
            flash('Conta inexistente.', 'error')  # Mensagem para conta inexistente
    return render_template('login.html')

# Rota para registro
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        is_admin = 'is_admin' in request.form
        
        user = User(username=username, is_admin=is_admin)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('Usuário registrado com sucesso!', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

# Rota para logout
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Você foi desconectado.', 'success')
    return redirect(url_for('login'))

# Rota para gerar etiqueta
@app.route('/generate_label', methods=['GET', 'POST'])
@login_required
def generate_label():
    if request.method == 'POST':
        patient_name = request.form['patient_name']
        exam_type = request.form['exam_type']
        # Passa os dados para o template label.html
        return render_template('label.html', patient_name=patient_name, exam_type=exam_type)
    return render_template('generate_label.html', exam_types=EXAM_TYPES)

# Rota para registrar exame
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

# Rota para exibir todos os resultados de exames
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

# Rota para editar um exame
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

# Rota para excluir um exame
@app.route('/delete/<int:exam_id>', methods=['GET', 'POST'])
@login_required
def delete_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)
    db.session.delete(exam)
    db.session.commit()
    return redirect(url_for('results'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria as tabelas no banco de dados
        create_admin()   # Cria o admin automaticamente
    app.run(debug=True)