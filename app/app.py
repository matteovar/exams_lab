from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from models import db, Exam, User
from collections import defaultdict
import json
import os
from docx import Document
from docx2pdf import convert
import win32print
import win32api
import sqlite3

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

# Função para gerar o documento Word e converter para PDF
def gerar_documento(exam_id):
    """Gera o documento Word e converte para PDF"""
    conn = sqlite3.connect('instance/exams.db')
    cursor = conn.cursor()

    # Busca os dados do exame no banco de dados
    cursor.execute("SELECT patient_name, category, result FROM exam WHERE id = ?", (exam_id,))
    dados = cursor.fetchone()
    conn.close()

    if not dados:
        return None

    # Carrega o modelo do Word
    doc = Document("db-to-docx/modelo.docx")

    # Define os placeholders e seus valores
    substituicoes = {
        "{NOME}": dados[0],  # Nome do paciente
        "{CATEGORIA}": dados[1],  # Categoria do exame
        "{RESULTADO}": dados[2]  # Resultado do exame
    }

    # Substitui os placeholders no documento
    for paragrafo in doc.paragraphs:
        for chave, valor in substituicoes.items():
            if chave in paragrafo.text:
                paragrafo.text = paragrafo.text.replace(chave, str(valor))

    # Salva o documento Word preenchido
    doc_word = "db-to-docx/relatorio_preenchido.docx"
    doc.save(doc_word)

    # Converte o Word para PDF
    convert(doc_word)
    doc_pdf = "db-to-docx/relatorio_preenchido.pdf"

    return doc_pdf

# Função para enviar o PDF para a impressora
def imprimir_pdf(pdf_path):
    """Envia o PDF para a impressora"""
    printer_name = win32print.GetDefaultPrinter()
    win32api.ShellExecute(0, "print", pdf_path, None, ".", 0)


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

# Rota para buscar os detalhes do paciente
@app.route('/get_patient_details')
def get_patient_details():
    patient_name = request.args.get('patient_name')
    patient = Exam.query.filter_by(patient_name=patient_name).first()

    if patient:
        return jsonify({
            'cpf': patient.cpf,
            'phone': patient.phone,
            'address': patient.address
        })
    else:
        return jsonify({}), 404
    
@app.route('/gerar-imprimir/<int:exam_id>', methods=['POST'])
def gerar_imprimir(exam_id):
    # Gera o documento Word e converte para PDF
    pdf_gerado = gerar_documento(exam_id)
    if pdf_gerado:
        # Envia o PDF para a impressora
        imprimir_pdf(pdf_gerado)
        return jsonify({"status": "success", "message": "Documento gerado e enviado para impressão!"})
    else:
        return jsonify({"status": "error", "message": "Erro ao gerar o documento."})


# Rota para editar um exame
@app.route('/edit/<int:exam_id>', methods=['GET', 'POST'])
def edit_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)  # Busca o exame pelo ID

    if request.method == 'POST':
        # Atualiza os dados do exame com os valores do formulário
        exam.patient_name = request.form['patient_name']
        exam.category = request.form['category']
        exam.subcategory = request.form['subcategory']
        exam.result = request.form['result']

        # Atualiza os detalhes do exame
        details = {}
        for key, value in request.form.items():
            if key.startswith('detail_key_') and value:
                detail_number = key.split('_')[-1]
                detail_value = request.form.get(f'detail_value_{detail_number}', '')
                if detail_value:
                    details[value] = detail_value
        exam.details = details

        db.session.commit()  # Salva as alterações no banco de dados
        return redirect(url_for('results'))

    # Se for uma requisição GET, exibe o formulário de edição
    return render_template('edit_exam.html', exam=exam, exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

# Rota para registrar exame
@app.route('/submit', methods=['POST'])
def submit_exam():
    # Captura os dados do formulário
    patient_name = request.form['patient_name']
    category = request.form['category']
    subcategory = request.form['subcategory']
    result = request.form.get('result', '')  # Captura o resultado

    # Busca o paciente no banco de dados pelo nome
    user = User.query.filter_by(patient_name=patient_name).first()

    if not user:
        flash('Paciente não encontrado. Por favor, cadastre o paciente primeiro.', 'error')
        return redirect(url_for('exame'))

    # Captura os detalhes do exame
    details = {}
    for key, value in request.form.items():
        if key.startswith('detail_key_') and value:  # Verifica se é um campo de detalhe e se tem valor
            detail_number = key.split('_')[-1]  # Extrai o número do campo (ex: "1" de "detail_key_1")
            detail_value = request.form.get(f'detail_value_{detail_number}', '')  # Captura o valor correspondente
            if detail_value:  # Só adiciona se o valor não estiver vazio
                details[value] = detail_value

    # Cria o novo exame associado ao usuário
    new_exam = Exam(
        patient_name=patient_name,  # Associa o exame ao usuário
        category=category,
        subcategory=subcategory,
        result=result,  # Salva o resultado
        details=details  # Salva os detalhes como um dicionário JSON
    )

    db.session.add(new_exam)
    db.session.commit()
    return redirect(url_for('results'))

# Rota para exibir todos os resultados de exames
@app.route('/results')
def results():
    exams = Exam.query.all()
    grouped_exams = defaultdict(lambda: {"category": None, "exams": [], "patient_info": {}})
    
    for exam in exams:
        # Busca as informações do paciente associado ao exame
        user = User.query.filter_by(patient_name=exam.patient_name).first()
        
        if user:
            grouped_exams[exam.patient_name]["patient_info"] = {
                "cpf": user.cpf,
                "phone": user.phone,
                "address": user.address
            }
        
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
        patient_name = request.form['patient_name']
        cpf = request.form['cpf']
        phone = request.form['phone']
        address = request.form['address']

        # Salva os dados do cliente
        new_client = User(
            patient_name=patient_name,
            cpf=cpf,
            phone=phone,
            address=address
        )
        db.session.add(new_client)
        db.session.commit()

        # Processa os exames enviados
        exam_count = 0
        while f'category_{exam_count}' in request.form:
            category = request.form[f'category_{exam_count}']
            subcategory = request.form[f'subcategory_{exam_count}']

            # Salva o exame associado ao cliente
            new_exam = Exam(
                patient_name=patient_name,
                category=category,
                subcategory=subcategory,
                result='',  # Resultado pode ser preenchido posteriormente
                details={}   # Detalhes podem ser preenchidos posteriormente
            )
            db.session.add(new_exam)
            exam_count += 1

        db.session.commit()
        flash('Ficha do cliente e exames salvos com sucesso!', 'success')
        return redirect(url_for('client_record', patient_name=patient_name))

    return render_template('client_record_search.html', exam_types=EXAM_TYPES, exam_subcategories=EXAM_SUBCATEGORIES)

# Rota para remover um exame
@app.route('/delete/<int:exam_id>', methods=['POST'])
def delete_exam(exam_id):
    exam = Exam.query.get_or_404(exam_id)  # Busca o exame pelo ID
    db.session.delete(exam)  # Remove o exame do banco de dados
    db.session.commit()  # Salva as alterações
    return redirect(url_for('results'))

# Rota para exibir a ficha do cliente
@app.route('/client_record/<string:patient_name>')
def client_record(patient_name):
    exams = User.query.filter_by(patient_name=patient_name).all()
    
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
        })
    
    return render_template(
        'client_record.html',
        patient_name=patient_name,
        cpf=client_info["cpf"],
        phone=client_info["phone"],
        address=client_info["address"],
        grouped_exams=grouped_exams
    )

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria as tabelas no banco de dados
    app.run(debug=True)