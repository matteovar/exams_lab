from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Cria a instância do SQLAlchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exams.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = 'sua_chave_secreta_aqui'

    # Inicializa o banco de dados com a aplicação
    db.init_app(app)

    # Importa e registra os blueprints
    from app.routes.exams import exams_bp
    from app.routes.patients import patients_bp
    from app.routes.labels import labels_bp

    app.register_blueprint(exams_bp)
    app.register_blueprint(patients_bp)
    app.register_blueprint(labels_bp)

    return app