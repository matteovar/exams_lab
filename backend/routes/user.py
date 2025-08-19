import os
from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models import usuario_collection
from datetime import datetime

usuario_bp = Blueprint("usuario", __name__)
bcrypt = Bcrypt()

def limpar_cpf(cpf):
    return cpf.replace(".", "").replace("-", "").strip()

def limpar_rg(rg):
    return rg.replace(".", "").replace("-", "").strip()

@usuario_bp.route("/register-medico", methods=["POST"])
@jwt_required()
def registrar_medico():
    identity = get_jwt_identity()
    cpf_admin, tipo_usuario = identity.split(":")
    if tipo_usuario != "admin":
        return jsonify({"msg": "Apenas administradores podem cadastrar médicos"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Requisição sem corpo JSON válido"}), 400

    nome = data.get("nome", "").strip()
    cpf = limpar_cpf(data.get("cpf", ""))
    rg = limpar_rg(data.get("rg", ""))
    data_nascimento = data.get("data_nascimento", "").strip()
    telefone = data.get("telefone", "").strip()
    email = data.get("email", "").strip()
    crm = data.get("crm", "").strip()
    crm_estado = data.get("crm_estado", "").strip()
    especialidade = data.get("especialidade", "").strip()
    senha = data.get("senha")
    confirma_senha = data.get("confirma_senha")
    tipo = data.get("tipo", "").strip()

    if not nome or not cpf or not rg or not senha or not tipo:
        return jsonify({"msg": "Nome, CPF, RG, senha e tipo são obrigatórios"}), 400

    if senha != confirma_senha:
        return jsonify({"msg": "As senhas não coincidem"}), 400

    if usuario_collection.find_one({"cpf": cpf, "tipo": tipo}):
        return jsonify({"msg": "CPF já registrado com esse tipo de acesso"}), 409

    hashed = bcrypt.generate_password_hash(senha).decode("utf-8")

    usuario_doc = {
        "nome": nome,
        "cpf": cpf,
        "rg": rg,
        "data_nascimento": data_nascimento,
        "telefone": telefone,
        "email": email,
        "crm": crm,
        "crm_estado": crm_estado,
        "especialidade": especialidade,
        "senha": hashed,
        "tipo": tipo
    }


    return jsonify({"msg": "Médico cadastrado com sucesso"}), 201


@usuario_bp.route("/register", methods=["POST"])
def registrar_usuario():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "msg": "Requisição sem corpo JSON válido"}), 400

        # Campos obrigatórios
        required_fields = ["nome", "cpf", "senha", "confirma_senha", "tipo", "data_nascimento"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                "success": False,
                "msg": f"Campos obrigatórios faltando: {', '.join(missing_fields)}"
            }), 400

        # Validações
        cpf = limpar_cpf(data["cpf"])
        if len(cpf) != 11 or not cpf.isdigit():
            return jsonify({"success": False, "msg": "CPF inválido"}), 400

        if data["senha"] != data["confirma_senha"]:
            return jsonify({"success": False, "msg": "As senhas não coincidem"}), 400

        if len(data["senha"]) < 6:
            return jsonify({
                "success": False,
                "msg": "A senha deve ter pelo menos 6 caracteres"
            }), 400

        # Verifica se usuário já existe
        if usuario_collection.find_one({"cpf": cpf, "tipo": data["tipo"]}):
            return jsonify({
                "success": False,
                "msg": "CPF já registrado para este tipo de usuário"
            }), 409

        # Validação de data de nascimento
        try:
            nascimento = datetime.strptime(data["data_nascimento"], "%Y-%m-%d")
            if nascimento > datetime.now():
                return jsonify({
                    "success": False,
                    "msg": "Data de nascimento inválida"
                }), 400
        except ValueError:
            return jsonify({
                "success": False,
                "msg": "Formato de data inválido. Use YYYY-MM-DD"
            }), 400

        # Cria documento do usuário
        hashed = bcrypt.generate_password_hash(data["senha"]).decode("utf-8")
        
        convenio_info = {
            "possui_convenio": data.get("possui_convenio", False),
            "nome_convenio": data.get("nome_convenio", "").strip(),
            "numero_carteirinha": data.get("numero_carteirinha", "").strip(),
            "validade_carteirinha": data.get("validade_carteirinha", ""),
            "plano": data.get("plano", "").strip()
        } if data.get("possui_convenio") else None

        usuario_doc = {
            "nome": data["nome"].strip(),
            "cpf": cpf,
            "email": data.get("email", "").strip().lower(),
            "telefone": data.get("telefone", "").strip(),
            "senha": hashed,
            "data_nascimento": data["data_nascimento"],
            "problemas_saude": data.get("problemas_saude", "").strip(),
            "medicacoes": data.get("medicacoes", "").strip(),
            "endereco": data.get("endereco", "").strip(),
            "convenio": convenio_info,
            "data_cadastro": datetime.utcnow(),
            "ativo": True,
            "tipo": data["tipo"],
        }

        # Insere no banco de dados
        result = usuario_collection.insert_one(usuario_doc)
        
        return jsonify({
            "success": True,
            "msg": "Usuário criado com sucesso",
            "user_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print(f"Erro no registro: {str(e)}")
        return jsonify({
            "success": False,
            "msg": "Erro interno no servidor"
        }), 500
    

@usuario_bp.route("/register-tecnico", methods=["POST"])
@jwt_required()
def registrar_tecnico():
    identity = get_jwt_identity()
    cpf_admin, tipo_usuario = identity.split(":")
    if tipo_usuario != "admin":
        return jsonify({"msg": "Apenas administradores podem cadastrar técnicos"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Requisição sem corpo JSON válido"}), 400

    nome = data.get("nome", "").strip()
    cpf = limpar_cpf(data.get("cpf", ""))
    rg = limpar_rg(data.get("rg", ""))
    data_nascimento = data.get("data_nascimento", "").strip()
    telefone = data.get("telefone", "").strip()
    email = data.get("email", "").strip()
    senha = data.get("senha")
    confirma_senha = data.get("confirma_senha")
    tipo = data.get("tipo", "").strip()

    if not nome or not cpf or not rg or not senha or not tipo:
        return jsonify({"msg": "Nome, CPF, RG, senha e tipo são obrigatórios"}), 400

    if senha != confirma_senha:
        return jsonify({"msg": "As senhas não coincidem"}), 400

    if usuario_collection.find_one({"cpf": cpf, "tipo": tipo}):
        return jsonify({"msg": "CPF já registrado com esse tipo de acesso"}), 409

    hashed = bcrypt.generate_password_hash(senha).decode("utf-8")

    usuario_doc = {
        "nome": nome,
        "cpf": cpf,
        "rg": rg,
        "data_nascimento": data_nascimento,
        "telefone": telefone,
        "email": email,
        "senha": hashed,
        "tipo": tipo
    }

    usuario_collection.insert_one(usuario_doc)

    return jsonify({"msg": "Técnico cadastrado com sucesso"}), 201


@usuario_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    cpf = limpar_cpf(data.get("cpf", ""))
    senha = data.get("senha")
    tipo = data.get("tipo")

    usuario = usuario_collection.find_one({"cpf": cpf, "tipo": tipo})
    # Se não encontrar, tenta buscar como admin
    if not usuario:
        usuario = usuario_collection.find_one({"cpf": cpf, "tipo": "admin"})
    if not usuario or not bcrypt.check_password_hash(usuario["senha"], senha):
        return jsonify({"success": False, "message": "CPF ou senha inválidos"}), 401

    access_token = create_access_token(identity=f"{cpf}:{usuario['tipo']}")
    # Redireciona conforme o tipo real do usuário
    if usuario["tipo"] == "admin":
        redirect = "/cadastro-medico"
    elif usuario["tipo"] == "medico":
        redirect = "/dashboard-medico"
    elif usuario["tipo"] == "tecnico":
        redirect = "/painel-coleta"
    else:
        redirect = "/dashboard-usuario"


    return jsonify({
        "success": True,
        "token": access_token,
        "redirect": redirect,
        "tipo": usuario["tipo"],
        "nome": usuario.get("nome", "")
    }), 200
