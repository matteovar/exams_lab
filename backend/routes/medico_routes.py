from datetime import datetime

from bson.objectid import ObjectId
from database import mongo
from flask import Blueprint, jsonify, request
from utils.auth import token_required

medico_bp = Blueprint("medico", __name__)


@medico_bp.route("/agenda", methods=["GET"])
@token_required
def get_agenda(current_user):
    data_param = request.args.get("data")

    query = {"medico_id": current_user["_id"]}
    if data_param:
        query["data"] = data_param

    agendamentos = list(mongo.db.agendamentos.find(query, {"_id": 0}))
    return jsonify(agendamentos)


@medico_bp.route("/agenda", methods=["POST"])
@token_required
def add_agendamento(current_user):
    data = request.json

    novo_agendamento = {
        "medico_id": current_user["_id"],
        "paciente": data.get("paciente"),
        "data": data.get("data"),
        "horario": data.get("horario"),
        "problema_de_saude": data.get("problema_de_saude"),
        "exames": data.get("exames", []),
        "criado_em": datetime.utcnow(),
    }

    result = mongo.db.agendamentos.insert_one(novo_agendamento)

    return jsonify(
        {
            "success": True,
            "message": "Agendamento adicionado com sucesso",
            "id": str(result.inserted_id),
        }
    )


@medico_bp.route("/pacientes", methods=["GET"])
@token_required
def listar_pacientes(current_user):
    pacientes = mongo.db.agendamentos.distinct(
        "paciente", {"medico_id": current_user["_id"]}
    )
    return jsonify(pacientes)


@medico_bp.route("/pacientes/<nome>", methods=["GET"])
@token_required
def get_paciente(current_user, nome):
    paciente_info = mongo.db.pacientes.find_one(
        {"nome": nome, "medico_id": current_user["_id"]}, {"_id": 0, "medico_id": 0}
    )

    if not paciente_info:
        return jsonify({"error": "Paciente não encontrado"}), 404

    fichas = list(
        mongo.db.fichas.find(
            {"paciente_id": paciente_info["id"]}, {"_id": 0, "paciente_id": 0}
        )
    )

    return jsonify({"paciente": paciente_info, "fichas": fichas})
