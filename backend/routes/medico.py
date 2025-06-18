import datetime
from collections import defaultdict

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import medico_collection, usuario_collection

medico_bp = Blueprint("medico", __name__)


@medico_bp.route("/pacientes", methods=["GET"])
@jwt_required()
def get_pacientes():
    identity = get_jwt_identity()
    cpf, tipo = identity.split(":")

    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

    pacientes = medico_collection.find({"cpf_medico": cpf})
    nomes = [paciente["nome"] for paciente in pacientes]
    return jsonify(nomes), 200


@medico_bp.route("/pacientes", methods=["POST"])
@jwt_required()
def add_paciente():
    identity = get_jwt_identity()
    cpf, tipo = identity.split(":")

    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem cadastrar pacientes"}), 403

    data = request.get_json()

    if not data or "nome" not in data or "idade" not in data:
        return jsonify({"error": "Dados incompletos"}), 400

    paciente = {
        "cpf_medico": cpf,
        "nome": data["nome"],
        "idade": data["idade"],
        "data_de_registro": data.get("data_de_registro", None),
    }

    result = medico_collection.insert_one(paciente)
    return jsonify({"id": str(result.inserted_id)}), 201


@medico_bp.route("/lista", methods=["GET"])
@jwt_required()
def lista_medicos():
    try:
        medicos = list(
            usuario_collection.find(
                {"tipo": "medico"}, {"_id": 0, "nome": 1, "cpf": 1, "especialidade": 1}
            )
        )

        # Convert to frontend-friendly format
        medicos_formatados = []
        for medico in medicos:
            medicos_formatados.append(
                {
                    "cpf": medico["cpf"],
                    "nome": medico["nome"],
                    "especialidade": medico.get("especialidade", ""),
                }
            )

        return jsonify(medicos_formatados), 200
    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar médicos: {str(e)}"}), 500
