import os

from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.medico import medico_bp
from routes.user import usuario_bp

app = Flask(__name__)
CORS(app)

bcrypt = Bcrypt(app)
load_dotenv()

jwt = JWTManager(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY")

app.register_blueprint(medico_bp, url_prefix="/api/medico")
app.register_blueprint(usuario_bp, url_prefix="/api/usuario")

if __name__ == "__main__":
    app.run(debug=True)
