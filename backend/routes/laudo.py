from datetime import datetime
from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import laudo_collection, agendamento_collection, usuario_collection

laudo_bp = Blueprint("laudo", __name__)

@laudo_bp.route("/pendentes", methods=["GET"])
@jwt_required()
def listar_laudos_pendentes():
    try:
        # Verificar se usuário é médico
        user = usuario_collection.find_one(
            {"cpf": get_jwt_identity().split(":")[0], "tipo": "medico"}
        )
        if not user:
            return jsonify({"error": "Acesso não autorizado"}), 403

        agendamentos = list(agendamento_collection.find(
            {"status": "coletado"},
            {"_id": 1, "cpf_usuario": 1, "exames": 1}
        ))

        for ag in agendamentos:
            ag["_id"] = str(ag["_id"])
            
        return jsonify(agendamentos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@laudo_bp.route("/emitir/<agendamento_id>", methods=["POST"])
@jwt_required()
def emitir_laudo(agendamento_id):
    try:
        # Verificar se usuário é médico
        user = usuario_collection.find_one(
            {"cpf": get_jwt_identity().split(":")[0], "tipo": "medico"}
        )
        if not user:
            return jsonify({"error": "Acesso não autorizado"}), 403

        data = request.get_json()
        if not data.get("resultados"):
            return jsonify({"error": "Informe os resultados"}), 400

        # Criar laudo
        laudo_data = {
            "agendamento_id": ObjectId(agendamento_id),
            "medico_responsavel": user["cpf"],
            "data_emissao": datetime.utcnow(),
            "resultados": data["resultados"],
            "observacoes": data.get("observacoes", ""),
            "conclusao": data.get("conclusao", "")
        }

        # Atualizar status do agendamento
        agendamento_collection.update_one(
            {"_id": ObjectId(agendamento_id)},
            {"$set": {"status": "laudado"}}
        )

        laudo_collection.insert_one(laudo_data)
        return jsonify({"message": "Laudo emitido com sucesso"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500