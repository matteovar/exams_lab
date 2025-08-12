from datetime import datetime
from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import coleta_collection, agendamento_collection, usuario_collection

coleta_bp = Blueprint("coleta", __name__)

@coleta_bp.route("/pendentes", methods=["GET"])
@jwt_required()
def listar_coletas_pendentes():
    try:
        user = usuario_collection.find_one(
            {"cpf": get_jwt_identity().split(":")[0], "tipo": "tecnico"}
        )
        if not user:
            return jsonify({"error": "Acesso não autorizado"}), 403

        pipeline = [
            {"$match": {"status": "agendado", "data_coleta": {"$gte": datetime.utcnow()}}},
            {"$sort": {"data_coleta": 1}},
            {
                "$lookup": {
                    "from": "usuarios",
                    "localField": "cpf_usuario",
                    "foreignField": "cpf",
                    "as": "paciente"
                }
            },
            {"$unwind": "$paciente"},
            {
                "$project": {
                    "_id": 1,
                    "cpf_usuario": 1,
                    "data_coleta": 1,
                    "exames": 1,  # Exames deve conter campo "concluido"
                    "local_coleta": 1,
                    "paciente_nome": "$paciente.nome",
                    "paciente_email": "$paciente.email",
                }
            }
        ]

        coletas = list(agendamento_collection.aggregate(pipeline))
        for coleta in coletas:
            coleta["_id"] = str(coleta["_id"])
            coleta["data_coleta"] = coleta["data_coleta"].isoformat()

        return jsonify(coletas), 200

    except Exception as e:
        print(f"Error in listar_coletas_pendentes: {str(e)}")
        return jsonify({"error": "Erro interno ao buscar coletas pendentes"}), 500


@coleta_bp.route("/concluir-exame/<agendamento_id>", methods=["PATCH"])
@jwt_required()
def concluir_exame(agendamento_id):
    try:
        user = usuario_collection.find_one(
            {"cpf": get_jwt_identity().split(":")[0], "tipo": "tecnico"}
        )
        if not user:
            return jsonify({"error": "Acesso não autorizado"}), 403

        data = request.get_json()
        exame_codigo = data.get("exameCodigo")
        if not exame_codigo:
            return jsonify({"error": "Informe o código do exame"}), 400

        # Atualiza o exame específico para concluido=True
        result = agendamento_collection.update_one(
            {
                "_id": ObjectId(agendamento_id),
                "exames.codigo": exame_codigo
            },
            {
                "$set": {"exames.$.concluido": True}
            }
        )

        if result.matched_count == 0:
            return jsonify({"error": "Agendamento ou exame não encontrado"}), 404

        # Verifica se todos os exames estão concluídos para mudar status do agendamento
        agendamento = agendamento_collection.find_one({"_id": ObjectId(agendamento_id)})
        todos_concluidos = all(exame.get("concluido", False) for exame in agendamento.get("exames", []))

        if todos_concluidos:
            agendamento_collection.update_one(
                {"_id": ObjectId(agendamento_id)},
                {"$set": {"status": "coletado"}}
            )

        return jsonify({"message": "Exame marcado como concluído"}), 200

    except Exception as e:
        print(f"Error in concluir_exame: {str(e)}")
        return jsonify({"error": "Erro interno ao concluir exame"}), 500
