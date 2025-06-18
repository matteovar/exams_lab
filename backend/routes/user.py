import os

from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models import usuario_collection

usuario_bp = Blueprint("usuario", __name__)
bcrypt = Bcrypt()


@usuario_bp.route("/register", methods=["POST"])
def registrar_usuario():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Requisição sem corpo JSON válido"}), 400

    nome = data.get("nome")
    cpf = data.get("cpf").replace(".", "").replace("-", "").strip()
    senha = data.get("senha")
    tipo = data.get("tipo")

    if not nome or not cpf or not senha or not tipo:
        return jsonify({"msg": "Nome, CPF, senha e tipo são obrigatórios"}), 400

    if usuario_collection.find_one({"cpf": cpf, "tipo": tipo}):
        return jsonify({"msg": "CPF já registrado com esse tipo de acesso"}), 409

    hashed = bcrypt.generate_password_hash(senha).decode("utf-8")

    usuario_collection.insert_one(
        {"nome": nome, "cpf": cpf, "senha": hashed, "tipo": tipo}
    )

    return jsonify({"msg": "Usuário criado com sucesso"}), 201


@usuario_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    cpf = data.get("cpf").replace(".", "").replace("-", "").strip()
    senha = data.get("senha")
    tipo = data.get("tipo")

    usuario = usuario_collection.find_one({"cpf": cpf, "tipo": tipo})
    if not usuario or not bcrypt.check_password_hash(usuario["senha"], senha):
        return jsonify({"success": False, "message": "CPF ou senha inválidos"}), 401

    # ✅ Aqui ajustamos o identity para uma string
    access_token = create_access_token(identity=f"{cpf}:{tipo}")

    redirect = "/dashboard-medico" if tipo == "medico" else "/dashboard-usuario"

    return jsonify({"success": True, "token": access_token, "redirect": redirect}), 200
