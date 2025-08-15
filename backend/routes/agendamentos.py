from datetime import datetime
from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import (agendamento_collection, exame_collection, 
                   coleta_collection, laudo_collection, usuario_collection)

agendamento_bp = Blueprint("agendamento", __name__)

@agendamento_bp.route("/exames-disponiveis", methods=["GET"])
def listar_exames_disponiveis():
    exames = list(exame_collection.find({"ativo": True}, {"_id": 0}))
    return jsonify(exames), 200

@agendamento_bp.route("/agendar", methods=["POST"])
@jwt_required()
def criar_agendamento():
    data = request.get_json()
    cpf_usuario = get_jwt_identity().split(":")[0]
    
    # Validar dados
    if not all(k in data for k in ["exames", "data_coleta"]):
        return jsonify({"msg": "Dados incompletos"}), 400
    
    if not isinstance(data["exames"], list) or len(data["exames"]) == 0:
        return jsonify({"msg": "Selecione pelo menos um exame"}), 400
    
    # Verificar se exames existem e estão ativos
    exames_validos = []
    for exame_id in data["exames"]:
        exame = exame_collection.find_one({"codigo": exame_id, "ativo": True})
        if not exame:
            return jsonify({"msg": f"Exame {exame_id} não encontrado ou inativo"}), 400
        exames_validos.append({
            "codigo": exame["codigo"],
            "nome": exame["nome"],
            "especialidade": exame["especialidade"],
            "preparo": exame["preparo"]
        })
    
    # Criar agendamento
    agendamento = {
        "cpf_usuario": cpf_usuario,
        "exames": exames_validos,
        "data_coleta": datetime.fromisoformat(data["data_coleta"]),
        "status": "agendado",
        "local_coleta": data.get("local_coleta", "Sede Principal"),
        "observacoes": data.get("observacoes", ""),
        "data_criacao": datetime.utcnow(),
        "etapas": {
            "coleta": {"realizada": False, "responsavel": None, "data": None},
            "analise": {"realizada": False, "responsavel": None, "data": None},
            "laudo": {"realizada": False, "responsavel": None, "data": None}
        }
    }
    
    try:
        result = agendamento_collection.insert_one(agendamento)
        return jsonify({
            "msg": "Agendamento criado com sucesso",
            "agendamento_id": str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"msg": f"Erro ao criar agendamento: {str(e)}"}), 500
    
@agendamento_bp.route("/laudos-pendentes", methods=["GET"])
@jwt_required()
def listar_laudos_pendentes():
    # Verificar se usuário é médico
    user = usuario_collection.find_one(
        {"cpf": get_jwt_identity().split(":")[0], "tipo": "medico"}
    )
    if not user:
        return jsonify({"msg": "Acesso não autorizado"}), 403
    
    agendamentos = list(agendamento_collection.find(
        {"status": "coletado"},
        {"_id": 1, "cpf_usuario": 1, "data_coleta": 1, "exames": 1}
    ).sort("data_coleta", 1))
    
    for ag in agendamentos:
        ag["_id"] = str(ag["_id"])
        ag["data_coleta"] = ag["data_coleta"].isoformat()
        
        # Adicionar info do paciente
        paciente = usuario_collection.find_one(
            {"cpf": ag["cpf_usuario"]},
            {"nome": 1}
        )
        ag["paciente_nome"] = paciente.get("nome", "Não informado")
    
    return jsonify(agendamentos), 200

@agendamento_bp.route("/meus-agendamentos", methods=["GET"])
@jwt_required()
def listar_agendamentos_usuario():
    cpf_usuario = get_jwt_identity().split(":")[0]
    
    agendamentos = list(agendamento_collection.find(
        {"cpf_usuario": cpf_usuario},
        {"_id": 1, "data_coleta": 1, "status": 1, "exames": 1}
    ).sort("data_coleta", -1))
    
    for ag in agendamentos:
        ag["_id"] = str(ag["_id"])
        ag["data_coleta"] = ag["data_coleta"].isoformat()
    
    return jsonify(agendamentos), 200

@agendamento_bp.route("/coletas-pendentes", methods=["GET"])
@jwt_required()
def listar_coletas_pendentes():
    # Verificar se usuário é técnico de coleta
    user = usuario_collection.find_one(
        {"cpf": get_jwt_identity().split(":")[0], "tipo": "tecnico"}
    )
    if not user:
        return jsonify({"msg": "Acesso não autorizado"}), 403
    
    coletas = list(agendamento_collection.find(
        {"status": "agendado", "data_coleta": {"$lte": datetime.now()}},
        {"_id": 1, "cpf_usuario": 1, "data_coleta": 1, "exames": 1, "local_coleta": 1}
    ).sort("data_coleta", 1))
    
    for coleta in coletas:
        coleta["_id"] = str(coleta["_id"])
        coleta["data_coleta"] = coleta["data_coleta"].isoformat()
        # Adicionar info do paciente
        paciente = usuario_collection.find_one(
            {"cpf": coleta["cpf_usuario"]},
            {"nome": 1, "data_nascimento": 1}
        )
        coleta["paciente"] = {
            "nome": paciente.get("nome", "Não informado"),
            "data_nascimento": paciente.get("data_nascimento", "Não informado")
        }
    
    return jsonify(coletas), 200

@agendamento_bp.route("/registrar-coleta/<agendamento_id>", methods=["POST"])
@jwt_required()
def registrar_coleta(agendamento_id):
    # Verificar se usuário é técnico
    user = usuario_collection.find_one(
        {"cpf": get_jwt_identity().split(":")[0], "tipo": "tecnico"}
    )
    if not user:
        return jsonify({"msg": "Acesso não autorizado"}), 403
    
    data = request.get_json()
    if not data.get("amostras"):
        return jsonify({"msg": "Informe as amostras coletadas"}), 400
    
    # Registrar coleta
    coleta_data = {
        "agendamento_id": ObjectId(agendamento_id),
        "tecnico_responsavel": user["cpf"],
        "data_coleta": datetime.utcnow(),
        "amostras": data["amostras"],
        "observacoes": data.get("observacoes", "")
    }
    
    try:
        # Atualizar status do agendamento
        agendamento_collection.update_one(
            {"_id": ObjectId(agendamento_id)},
            {
                "$set": {
                    "status": "coletado",
                    "etapas.coleta": {
                        "realizada": True,
                        "responsavel": user["cpf"],
                        "data": datetime.utcnow()
                    }
                }
            }
        )
        
        # Registrar detalhes da coleta
        coleta_collection.insert_one(coleta_data)
        
        return jsonify({"msg": "Coleta registrada com sucesso"}), 200
    except Exception as e:
        return jsonify({"msg": f"Erro ao registrar coleta: {str(e)}"}), 500

# ... (adicionar endpoints para análise e laudo)