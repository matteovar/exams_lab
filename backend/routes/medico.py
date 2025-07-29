import datetime
from collections import defaultdict
from bson import ObjectId


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

# Adicione esta rota no medico.py
@medico_bp.route("/fichas", methods=["POST"])
@jwt_required()
def salvar_ficha():
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")
    
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem salvar fichas"}), 403

    data = request.get_json()
    
    try:
        # Salvar a ficha
        ficha_data = {
            "pacienteId": data["pacienteId"],
            "pacienteNome": data["pacienteNome"],
            "exameNome": data["exameNome"],
            "resultado": data["resultado"],
            "observacoes": data["observacoes"],
            "dataPreenchimento": data["dataPreenchimento"],
            "medicoResponsavel": cpf_medico
        }
        
        # Inserir na coleção de fichas
        ficha_id = ficha_collection.insert_one(ficha_data).inserted_id
        
        # Atualizar status do agendamento para "concluído"
        agendamento_collection.update_one(
            {
                "cpf_usuario": data["pacienteId"],
                "tipo_exame": data["exameNome"],
                "status": "agendado"
            },
            {
                "$set": {
                    "status": "concluído",
                    "ficha_id": str(ficha_id)
                }
            }
        )
        
        return jsonify({"msg": "Ficha salva com sucesso", "ficha_id": str(ficha_id)}), 201
        
    except Exception as e:
        return jsonify({"msg": f"Erro ao salvar ficha: {str(e)}"}), 500

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