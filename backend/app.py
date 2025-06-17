import os

from config import Config
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from routes.auth_routes import auth_bp
from routes.medico_routes import medico_bp
from routes.user_routes import usuario_bp

# Inicializa a extensão do MongoDB
mongo = PyMongo()


def create_app():
    app = Flask(__name__)

    # Carrega as configurações
    app.config.from_object(Config)

    # Configura CORS
    CORS(app, origins=app.config["CORS_ORIGINS"])

    # Configura o MongoDB
    app.config["MONGO_URI"] = Config.MONGO_URI
    mongo.init_app(app)

    # Verifica e cria índices se necessário
    with app.app_context():
        try:
            # Índices para coleção de usuários
            mongo.db.users.create_index("cpf", unique=True, sparse=True)
            mongo.db.users.create_index("email", unique=True, sparse=True)

            # Índices para coleção de agendamentos
            mongo.db.agendamentos.create_index(
                [("medico_id", 1), ("data", 1), ("horario", 1)]
            )

            # Índices para coleção de exames
            mongo.db.exames.create_index([("usuario_id", 1), ("data_exame", 1)])

            print("Índices do MongoDB verificados/criados com sucesso!")
        except Exception as e:
            print(f"Erro ao criar índices: {str(e)}")

    # Registra os blueprints
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(medico_bp, url_prefix="/api/medico")
    app.register_blueprint(usuario_bp, url_prefix="/api/usuario")

    return app


if __name__ == "__main__":
    # Carrega variáveis de ambiente
    from dotenv import load_dotenv

    load_dotenv()

    app = create_app()

    # Obtém a porta do ambiente ou usa a padrão 5000
    port = int(os.getenv("PORT", 5000))

    app.run(host="0.0.0.0", port=port, debug=app.config["DEBUG"])
