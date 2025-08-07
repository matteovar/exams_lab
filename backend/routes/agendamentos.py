import datetime
from bson import ObjectId

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import agendamento_collection, ficha_collection, usuario_collection

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

    required_fields = ["data_exame", "tipo_exame", "especialidade"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Dados incompletos para agendamento"}), 400

    # BUSCA UM MÉDICO PELA ESPECIALIDADE
    import random
    medicos = list(usuario_collection.find({
        "tipo": "medico",
        "especialidade": data["especialidade"]
    }))
    if not medicos:
        return jsonify({"msg": "Nenhum médico disponível para este exame"}), 400
    medico = random.choice(medicos)

    agendamento = {
        "cpf_usuario": cpf_usuario,
        "tipo_exame": data["tipo_exame"],
        "especialidade": data["especialidade"],
        "data_exame": data["data_exame"],
        "status": "agendado",
        "cpf_medico": medico["cpf"],
        "medico_responsavel": medico["nome"],
        "observacoes": data.get("observacoes", ""),
        "data_criacao": datetime.datetime.utcnow(),
        "ficha_id": None
    }

    result = agendamento_collection.insert_one(agendamento)
    return jsonify({
        "msg": "Agendamento criado com sucesso",
        "agendamento_id": str(result.inserted_id)
    }), 201

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

    agendamentos = list(agendamento_collection.find(filtro).sort("data_exame", 1))

    for a in agendamentos:
        a["_id"] = str(a["_id"])
        # Adiciona informações da ficha se existir
        if a.get("ficha_id"):
            ficha = ficha_collection.find_one({"_id": ObjectId(a["ficha_id"])})
            if ficha:
                ficha["_id"] = str(ficha["_id"])
                a["ficha"] = ficha

    return jsonify(agendamentos), 200


@agendamento_bp.route("/agendamento/<agendamento_id>", methods=["PUT"])
@jwt_required()
def atualizar_agendamento(agendamento_id):
    current_user = get_jwt_identity()

    try:
        cpf, tipo = current_user.split(":")
    except Exception:
        return jsonify({"msg": "Token inválido"}), 401

    data = request.get_json()

    # Verifica se o agendamento existe e pertence ao usuário
    agendamento = agendamento_collection.find_one({"_id": ObjectId(agendamento_id)})
    if not agendamento:
        return jsonify({"msg": "Agendamento não encontrado"}), 404

    # Verifica se o usuário tem permissão para editar
    if tipo == "medico" and agendamento["cpf_medico"] != cpf:
        return jsonify({"msg": "Não autorizado"}), 403
    elif tipo == "usuario" and agendamento["cpf_usuario"] != cpf:
        return jsonify({"msg": "Não autorizado"}), 403

    campos_permitidos = {
        "data_exame": data.get("data_exame"),
        "tipo_exame": data.get("tipo_exame"),
        "observacoes": data.get("observacoes"),
        "status": data.get("status")
    }

    # Remove campos que não foram fornecidos ou são None
    campos_atualizar = {k: v for k, v in campos_permitidos.items() if v is not None}

    if not campos_atualizar:
        return jsonify({"msg": "Nenhum dado válido para atualização"}), 400

    # Atualiza o agendamento
    result = agendamento_collection.update_one(
        {"_id": ObjectId(agendamento_id)},
        {"$set": campos_atualizar}
    )

    if result.modified_count == 0:
        return jsonify({"msg": "Nenhuma alteração realizada"}), 200

    return jsonify({"msg": "Agendamento atualizado com sucesso"}), 200


@agendamento_bp.route("/agendamento/<agendamento_id>", methods=["DELETE"])
@jwt_required()
def cancelar_agendamento(agendamento_id):
    current_user = get_jwt_identity()

    try:
        cpf, tipo = current_user.split(":")
    except Exception:
        return jsonify({"msg": "Token inválido"}), 401

    # Verifica se o agendamento existe e pertence ao usuário
    agendamento = agendamento_collection.find_one({"_id": ObjectId(agendamento_id)})
    if not agendamento:
        return jsonify({"msg": "Agendamento não encontrado"}), 404

    # Verifica se o usuário tem permissão para cancelar
    if tipo == "medico" and agendamento["cpf_medico"] != cpf:
        return jsonify({"msg": "Não autorizado"}), 403
    elif tipo == "usuario" and agendamento["cpf_usuario"] != cpf:
        return jsonify({"msg": "Não autorizado"}), 403

    # Verifica se já existe ficha associada
    if agendamento.get("ficha_id"):
        return jsonify({"msg": "Não é possível cancelar um exame já realizado"}), 400

    # Atualiza o status para cancelado
    result = agendamento_collection.update_one(
        {"_id": ObjectId(agendamento_id)},
        {"$set": {"status": "cancelado"}}
    )

    if result.modified_count == 0:
        return jsonify({"msg": "Nenhuma alteração realizada"}), 200

    return jsonify({"msg": "Agendamento cancelado com sucesso"}), 200