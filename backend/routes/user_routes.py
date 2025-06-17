from datetime import datetime

from bson.objectid import ObjectId
from database import mongo
from flask import Blueprint, jsonify, request
from utils.auth import token_required

usuario_bp = Blueprint("usuario", __name__)


@usuario_bp.route("/agendar-exame", methods=["POST"])
@token_required
def agendar_exame(current_user):
    data = request.get_json()

    if not data or "tipo_exame" not in data or "data_exame" not in data:
        return jsonify({"success": False, "message": "Dados incompletos"}), 400

    novo_exame = {
        "usuario_id": current_user["_id"],
        "tipo_exame": data["tipo_exame"],
        "data_exame": data["data_exame"],
        "status": "pendente",
        "criado_em": datetime.utcnow(),
    }

    result = mongo.db.exames.insert_one(novo_exame)

    return jsonify(
        {
            "success": True,
            "message": "Exame agendado com sucesso",
            "agendamento": {
                "id": str(result.inserted_id),
                "tipo_exame": data["tipo_exame"],
                "data_exame": data["data_exame"],
                "status": "pendente",
            },
        }
    )


@usuario_bp.route("/resultados", methods=["GET"])
@token_required
def get_resultados(current_user):
    resultados = list(
        mongo.db.exames.find(
            {"usuario_id": current_user["_id"], "status": "concluido"},
            {"_id": 0, "usuario_id": 0},
        )
    )

    return jsonify(resultados)
