from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import medico_collection

medico_bp = Blueprint("medico", __name__)


@medico_bp.route("/pacientes", methods=["GET"])
@jwt_required()
def get_pacientes():
    current_user = get_jwt_identity()
    pacientes = medico_collection.find({"usuario": current_user})
    nomes = [paciente["nome"] for paciente in pacientes]
    return jsonify(nomes), 200


@medico_bp.route("/pacientes", methods=["POST"])
@jwt_required()
def add_paciente():
    current_user = get_jwt_identity()
    data = request.get_json()

    # Use "nome" e "idade" para alinhar com o frontend
    if not data or "nome" not in data or "idade" not in data:
        return jsonify({"error": "Dados incompletos"}), 400

    paciente = {
        "usuario": current_user,
        "nome": data["nome"],
        "idade": data["idade"],
        "data_de_registro": data.get("data_de_registro", None),
    }

    result = medico_collection.insert_one(paciente)
    return jsonify({"id": str(result.inserted_id)}), 201
