import datetime
from collections import defaultdict
from bson import ObjectId
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import medico_collection, usuario_collection, ficha_collection, agendamento_collection

medico_bp = Blueprint("medico", __name__)

@medico_bp.route("/fichas/<ficha_id>", methods=["GET"])
@jwt_required()
def get_ficha(ficha_id):
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

    try:
        ficha = ficha_collection.find_one({"_id": ObjectId(ficha_id), "medicoResponsavel": cpf_medico})
        if not ficha:
            return jsonify({"msg": "Ficha não encontrada"}), 404
        ficha["_id"] = str(ficha["_id"])
        return jsonify(ficha), 200
    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar ficha: {str(e)}"}), 500
    
@medico_bp.route("/pacientes", methods=["GET"])
@jwt_required()
def get_pacientes():
    identity = get_jwt_identity()
    cpf, tipo = identity.split(":")

    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

    pacientes = usuario_collection.find({"tipo": "usuario"}, {"nome": 1, "_id": 0})
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

@medico_bp.route("/pacientes/<nome>", methods=["GET"])
@jwt_required()
def get_paciente_por_nome(nome):
    identity = get_jwt_identity()
    cpf, tipo = identity.split(":")
    
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

    paciente = usuario_collection.find_one({"nome": nome, "tipo": "usuario"})
    if not paciente:
        return jsonify({"msg": "Paciente não encontrado"}), 404

    fichas = list(ficha_collection.find({"pacienteNome": nome}))
    for ficha in fichas:
        ficha["_id"] = str(ficha["_id"])
        if "data_preenchimento" in ficha and isinstance(ficha["data_preenchimento"], datetime):
            ficha["data_preenchimento"] = ficha["data_preenchimento"].isoformat()

    # Remover campos sensíveis
    paciente_data = {
        "nome": paciente.get("nome"),
        "cpf": paciente.get("cpf"),
        "data_nascimento": paciente.get("data_nascimento"),
        "telefone": paciente.get("telefone"),
        "email": paciente.get("email"),
        "problemas_saude": paciente.get("problemas_saude"),
        "medicacoes": paciente.get("medicacoes"),
        "endereco": paciente.get("endereco"),
        "nome_convenio": paciente.get("convenio", {}).get("nome_convenio"),
        "numero_carteirinha": paciente.get("convenio", {}).get("numero_carteirinha"),
        "validade_carteirinha": paciente.get("convenio", {}).get("validade_carteirinha"),
        "plano": paciente.get("convenio", {}).get("plano")
    }

    return jsonify({
        "paciente": paciente_data,
        "fichas": fichas
    }), 200


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

@medico_bp.route("/fichas", methods=["POST"])
@jwt_required()
def salvar_ficha():
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")
    
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem salvar fichas"}), 403

    data = request.get_json()
    
    try:
        # Validação dos dados
        required_fields = ["agendamentoId", "pacienteId", "pacienteNome", "exames"]
        if not all(field in data for field in required_fields):
            return jsonify({"msg": "Dados incompletos"}), 400
        
        if not isinstance(data["exames"], list) or len(data["exames"]) == 0:
            return jsonify({"msg": "Nenhum exame fornecido"}), 400

        fichas_ids = []
        
        # Salvar cada ficha de exame
        for exame in data["exames"]:
            if not exame.get("resultados") or not isinstance(exame["resultados"], dict):
                return jsonify({"msg": "Resultados inválidos para o exame"}), 400
                
            if not exame.get("conclusao"):
                return jsonify({"msg": "Conclusão é obrigatória para todos os exames"}), 400

            ficha_data = {
                "agendamento_id": ObjectId(data["agendamentoId"]),
                "paciente_id": data["pacienteId"],
                "paciente_nome": data["pacienteNome"],
                "exame_nome": exame["nome"],
                "resultados": exame["resultados"],
                "observacoes": exame.get("observacoes", ""),
                "conclusao": exame["conclusao"],
                "laudo_completo": exame.get("laudoCompleto", ""),
                "medicoResponsavel": cpf_medico,
                "data_preenchimento": datetime.utcnow(),
                "status": "concluido"
            }
            
            ficha_id = ficha_collection.insert_one(ficha_data).inserted_id
            fichas_ids.append(str(ficha_id))
        
        # Atualizar status do agendamento para "concluído"
        agendamento_collection.update_one(
            {"_id": ObjectId(data["agendamentoId"])},
            {
                "$set": {
                    "status": "concluido",
                    "fichas_ids": fichas_ids,
                    "etapas.laudo": {
                        "realizada": True,
                        "responsavel": cpf_medico,
                        "data": datetime.utcnow()
                    }
                }
            }
        )
        
        return jsonify({
            "msg": "Laudos salvos com sucesso",
            "total_exames": len(data["exames"]),
            "fichas_ids": fichas_ids
        }), 201
        
    except Exception as e:
        return jsonify({"msg": f"Erro ao salvar laudos: {str(e)}"}), 500

# Adicionar esta rota para listar fichas
@medico_bp.route("/fichas", methods=["GET"])
@jwt_required()
def listar_fichas():
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")
    
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403
    
    fichas = list(ficha_collection.find({"medicoResponsavel": cpf_medico}))
    
    # Converter ObjectId para string
    for ficha in fichas:
        ficha["_id"] = str(ficha["_id"])
    
    return jsonify(fichas), 200

# Adicionar esta rota para editar ficha
@medico_bp.route("/fichas/<ficha_id>", methods=["PUT"])
@jwt_required()
def editar_ficha(ficha_id):
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")
    
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem editar fichas"}), 403
    
    data = request.get_json()
    
    try:
        result = ficha_collection.update_one(
            {"_id": ObjectId(ficha_id), "medicoResponsavel": cpf_medico},
            {
                "$set": {
                    "resultado": data["resultado"],
                    "observacoes": data["observacoes"]
                }
            }
        )
        
        if result.modified_count == 0:
            return jsonify({"msg": "Ficha não encontrada ou não pertence ao médico"}), 404
            
        return jsonify({"msg": "Ficha atualizada com sucesso"}), 200
        
    except Exception as e:
        return jsonify({"msg": f"Erro ao editar ficha: {str(e)}"}), 500
    
@medico_bp.route("/resultados-paciente", methods=["GET"])
@jwt_required()
def resultados_paciente():
    identity = get_jwt_identity()
    cpf_paciente, tipo = identity.split(":")
    
    if tipo != "usuario":
        return jsonify({"msg": "Apenas pacientes podem acessar esta rota"}), 403
    
    fichas = list(ficha_collection.find({"paciente_id": cpf_paciente}))
    
    # Converter todos os ObjectId para string e tratar campos datetime
    for ficha in fichas:
        ficha["_id"] = str(ficha["_id"])
        if "agendamento_id" in ficha:
            ficha["agendamento_id"] = str(ficha["agendamento_id"])
        if "data_preenchimento" in ficha:
            ficha["data_preenchimento"] = ficha["data_preenchimento"].isoformat()
    
    return jsonify(fichas), 200