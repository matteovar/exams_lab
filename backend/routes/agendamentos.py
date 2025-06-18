import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import agendamento_collection

agendamento_bp = Blueprint("agendamento", __name__)


@agendamento_bp.route("/agendamento", methods=["POST", "OPTIONS"])
@jwt_required(optional=True)
def criar_agendamento():
    if request.method == "OPTIONS":
        return "", 200

    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({"msg": "Token obrigatório"}), 401

    try:
        cpf_usuario, tipo = current_user.split(":")
    except Exception:
        return jsonify({"msg": "Token inválido"}), 401

    data = request.get_json()

    required_fields = ["data_exame", "tipo_exame", "cpf_medico"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Dados incompletos para agendamento"}), 400

    agendamento = {
        "cpf_usuario": cpf_usuario,
        "cpf_medico": data["cpf_medico"],  # CPF do médico agora salvo
        "tipo_exame": data["tipo_exame"],
        "data_exame": data["data_exame"],  # formato ISO ex: "2025-06-19T14:00"
        "status": "agendado",
        "medico_responsavel": data.get("medico_responsavel"),  # opcional, nome
        "observacoes": data.get("observacoes", ""),
        "data_criacao": datetime.datetime.utcnow(),
    }

    agendamento_collection.insert_one(agendamento)
    return jsonify({"msg": "Agendamento criado com sucesso"}), 201


@agendamento_bp.route("/agendamento", methods=["GET"])
@jwt_required()
def listar_agendamentos():
    current_user = get_jwt_identity()

    try:
        cpf, tipo = current_user.split(":")
    except Exception:
        return jsonify({"msg": "Token inválido"}), 401

    filtro = {}
    if tipo == "medico":
        filtro["cpf_medico"] = cpf
    else:
        filtro["cpf_usuario"] = cpf

    data_param = request.args.get("data")
    if data_param:
        filtro["data_exame"] = {"$regex": f"^{data_param}"}

    agendamentos = list(agendamento_collection.find(filtro))

    for a in agendamentos:
        a["_id"] = str(a["_id"])

    return jsonify(agendamentos), 200
