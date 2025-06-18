import os

from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.agendamentos import agendamento_bp
from routes.medico import medico_bp
from routes.user import usuario_bp

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:5173"],
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


bcrypt = Bcrypt(app)
load_dotenv()

jwt = JWTManager(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY")

app.register_blueprint(medico_bp, url_prefix="/api/medico")
app.register_blueprint(agendamento_bp, url_prefix="/api/agendamento")
app.register_blueprint(usuario_bp, url_prefix="/api/usuario")


@app.route("/", methods=["GET"])
def index():
    return "API is running", 200


if __name__ == "__main__":
    app.run(debug=True)
