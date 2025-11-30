from datetime import datetime, timedelta
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

        # Buscar coletas do dia atual
        hoje_inicio = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        hoje_fim = hoje_inicio + timedelta(days=1)

        pipeline = [
            {"$match": {
                "status": "agendado", 
                "data_coleta": {
                    "$gte": hoje_inicio,
                    "$lt": hoje_fim
                }
            }},
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
                    "exames": 1,
                    "local_coleta": 1,
                    "paciente_nome": "$paciente.nome",
                    "paciente_telefone": "$paciente.telefone",
                    "paciente_email": "$paciente.email",
                    "status": 1
                }
            }
        ]

        coletas = list(agendamento_collection.aggregate(pipeline))
        
        for coleta in coletas:
            coleta["_id"] = str(coleta["_id"])
            coleta["data_coleta"] = coleta["data_coleta"].isoformat()
            
            # Adicionar informações de horário formatado
            data_coleta = datetime.fromisoformat(coleta["data_coleta"].replace('Z', ''))
            coleta["horario_formatado"] = data_coleta.strftime("%H:%M")
            coleta["data_formatada"] = data_coleta.strftime("%d/%m/%Y")
            
            # Contar exames concluídos
            exames_concluidos = sum(1 for exame in coleta.get("exames", []) if exame.get("concluido", False))
            coleta["exames_concluidos"] = exames_concluidos
            coleta["total_exames"] = len(coleta.get("exames", []))
            coleta["todos_concluidos"] = exames_concluidos == coleta["total_exames"]

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

@coleta_bp.route("/hoje", methods=["GET"])
@jwt_required()
def listar_coletas_hoje():
    try:
        user = usuario_collection.find_one(
            {"cpf": get_jwt_identity().split(":")[0], "tipo": "tecnico"}
        )
        if not user:
            return jsonify({"error": "Acesso não autorizado"}), 403

        # Buscar coletas do dia atual
        hoje_inicio = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        hoje_fim = hoje_inicio + timedelta(days=1)

        pipeline = [
            {"$match": {
                "data_coleta": {
                    "$gte": hoje_inicio,
                    "$lt": hoje_fim
                },
                "status": {"$in": ["agendado", "coletado"]}
            }},
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
                    "exames": 1,
                    "local_coleta": 1,
                    "status": 1,
                    "paciente_nome": "$paciente.nome",
                    "paciente_telefone": "$paciente.telefone",
                    "paciente_email": "$paciente.email",
                }
            }
        ]

        coletas = list(agendamento_collection.aggregate(pipeline))
        
        for coleta in coletas:
            coleta["_id"] = str(coleta["_id"])
            coleta["data_coleta"] = coleta["data_coleta"].isoformat()
            
            # Adicionar informações de horário formatado
            data_coleta = datetime.fromisoformat(coleta["data_coleta"].replace('Z', ''))
            coleta["horario_formatado"] = data_coleta.strftime("%H:%M")
            coleta["data_formatada"] = data_coleta.strftime("%d/%m/%Y")
            
            # Contar exames concluídos
            exames_concluidos = sum(1 for exame in coleta.get("exames", []) if exame.get("concluido", False))
            coleta["exames_concluidos"] = exames_concluidos
            coleta["total_exames"] = len(coleta.get("exames", []))
            coleta["todos_concluidos"] = exames_concluidos == coleta["total_exames"]
            
            # Calcular progresso
            coleta["progresso"] = (exames_concluidos / coleta["total_exames"] * 100) if coleta["total_exames"] > 0 else 0

        return jsonify(coletas), 200

    except Exception as e:
        print(f"Error in listar_coletas_hoje: {str(e)}")
        return jsonify({"error": "Erro interno ao buscar coletas de hoje"}), 500
    
@coleta_bp.route("/painel-coleta", methods=["POST"])
def receber_painel_coleta():
    try:
        data = request.get_json()

        print("\n📥 Webhook recebido do agendamento:")
        print(data)

        return jsonify({"message": "Webhook recebido com sucesso"}), 200

    except Exception as e:
        print(f"Erro no webhook painel-coleta: {str(e)}")
        return jsonify({"error": str(e)}), 500
