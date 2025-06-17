from bson.objectid import ObjectId
from database import mongo
from flask import Blueprint, jsonify, request
from utils.auth import authenticate_user, generate_jwt_token
from werkzeug.security import check_password_hash, generate_password_hash

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or "cpf" not in data or "password" not in data:
        return (
            jsonify({"success": False, "message": "CPF e senha são obrigatórios"}),
            400,
        )

    user = mongo.db.users.find_one({"cpf": data["cpf"]})

    if not user or not check_password_hash(user["password_hash"], data["password"]):
        return jsonify({"success": False, "message": "CPF ou senha inválidos"}), 401

    # Gerar token JWT
    token = generate_jwt_token(user)

    return jsonify(
        {
            "success": True,
            "token": token,
            "user_type": user["user_type"],
            "redirect": f"/dashboard-{user['user_type']}",
            "name": user["name"],
        }
    )
