from flask import Flask, render_template, request, redirect, url_for
from models import db, Exam

app = Flask(__name__)

# Configuração do banco de dados (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exams.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco de dados
db.init_app(app)

# Cria as tabelas no banco de dados antes da primeira requisição


# Lista de tipos de exames pré-definidos
EXAM_TYPES = ['Hemograma', 'Ultrassonografia', 'Raio-X', 'Tomografia', 'Eletrocardiograma']

# Rota para a página principal (formulário de entrada)
@app.route('/')
def index():
    return render_template('index.html', exam_types=EXAM_TYPES)

# Rota para receber e processar os dados do exame
@app.route('/submit', methods=['POST'])
def submit_exam():
    # Coleta os dados do formulário
    patient_name = request.form['patient_name']
    exam_type = request.form['exam_type']
    result = request.form['result']
    
    # Cria um novo objeto Exam e armazena no banco de dados
    new_exam = Exam(patient_name=patient_name, exam_type=exam_type, result=result)
    db.session.add(new_exam)
    db.session.commit()  # Salva no banco
    
    # Após inserir o exame, redireciona para a página de resultados
    return redirect(url_for('results'))

# Rota para exibir todos os resultados de exames
@app.route('/results')
def results():
    # Recupera todos os exames do banco de dados
    exams = Exam.query.all()

    # Passa os exames para o template 'result.html'
    return render_template('result.html', exams=exams)

# Rota para editar um exame
@app.route('/edit/<int:exam_id>', methods=['GET', 'POST'])
def edit_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)

    if request.method == 'POST':
        # Atualiza os dados do exame
        exam.patient_name = request.form['patient_name']
        exam.exam_type = request.form['exam_type']
        exam.result = request.form['result']
        
        db.session.commit()
        return redirect(url_for('results'))
    
    return render_template('edit_exam.html', exam=exam, exam_types=EXAM_TYPES)

# Rota para excluir um exame
@app.route('/delete/<int:exam_id>', methods=['GET', 'POST'])
def delete_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)
    db.session.delete(exam)
    db.session.commit()
    
    return redirect(url_for('results'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
