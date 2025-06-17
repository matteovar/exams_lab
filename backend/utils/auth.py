from datetime import datetime, timedelta
from functools import wraps

import jwt
from config import Config
from database import mongo
from flask import jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split()[1]

        if not token:
            return jsonify({"success": False, "message": "Token não fornecido"}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = mongo.db.users.find_one({"cpf": data["sub"]})

            if not current_user:
                return (
                    jsonify({"success": False, "message": "Usuário não encontrado"}),
                    401,
                )

        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token expirado"}), 401
        except (jwt.InvalidTokenError, Exception):
            return jsonify({"success": False, "message": "Token inválido"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def authenticate_user(cpf, password):
    user = mongo.db.users.find_one({"cpf": cpf})

    if user and check_password_hash(user["password_hash"], password):
        token = generate_jwt_token(user)
        return {
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user.get("email", ""),
                "user_type": user["user_type"],
                "crm": user.get("crm", "") if user["user_type"] == "medico" else None,
            },
            "token": token,
            "success": True,
        }
    return None


def generate_jwt_token(user):
    expiration = datetime.utcnow() + timedelta(hours=12)

    payload = {
        "sub": user["cpf"],
        "iat": datetime.utcnow(),
        "exp": expiration,
        "user_type": user["user_type"],
        "name": user["name"],
    }

    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")


def get_current_user():
    token = None
    if "Authorization" in request.headers:
        auth_header = request.headers["Authorization"]
        if auth_header.startswith("Bearer "):
            token = auth_header.split()[1]

    if not token:
        return None

    try:
        data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        return mongo.db.users.find_one({"cpf": data["sub"]})
    except:
        return None
