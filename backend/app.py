import os
from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.agendamentos import agendamento_bp
from routes.medico import medico_bp
from routes.user import usuario_bp
from routes.coleta import coleta_bp
from routes.laudo import laudo_bp
from routes.exames import exames_bp

app = Flask(__name__)

# Configuração do CORS
CORS(
    app
)

# Configurações de segurança e autenticação
load_dotenv()
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hora em segundos

# Registro de blueprints (rotas)
# Registro de blueprints (rotas)
app.register_blueprint(medico_bp, url_prefix="/api/medico")
app.register_blueprint(usuario_bp, url_prefix="/api/usuario")
app.register_blueprint(agendamento_bp, url_prefix="/api/agendamento")
app.register_blueprint(coleta_bp, url_prefix="/api/coleta")  # ← Esta linha deve existir
app.register_blueprint(laudo_bp, url_prefix="/api/laudo")
app.register_blueprint(exames_bp, url_prefix="/api/exames")

# Rota de health check
@app.route("/", methods=["GET"])
def index():
    return {
        "status": "API is running",
        "version": "1.0.0",
        "routes": {
            "medico": "/api/medico",
            "usuario": "/api/usuario",
            "agendamento": "/api/agendamento",
            "coleta": "/api/coleta",
            "laudo": "/api/laudo",
            "exames": "/api/exames"
        }
    }, 200

# Tratamento de erros global
@app.errorhandler(404)
def not_found(error):
    return {"error": "Endpoint não encontrado"}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Erro interno no servidor"}, 500

if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "False") == "True")