from datetime import datetime, timedelta
from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import (
    agendamento_collection, exame_collection, 
    coleta_collection, laudo_collection, usuario_collection
)
import requests
import os
import traceback

agendamento_bp = Blueprint("agendamento", __name__)

def to_serializable(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_serializable(i) for i in obj]
    return obj


# ===========================================================
# Funções auxiliares: Envio para Painel e HL7
# ===========================================================

def enviar_agendamento_painel_coleta(agendamento_id, paciente_info, exames_pedidos, data_coleta):
    """Envia os dados do agendamento para o painel de coleta."""
    try:
        url_painel = os.environ.get("PAINEL_COLETA_ENDPOINT", "http://localhost:5000/api/coleta/painel-coleta")


        # 🔥 SERIALIZAÇÃO OBRIGATÓRIA
        payload = {
            "agendamento_id": str(agendamento_id),
            "paciente": to_serializable(paciente_info),
            "exames": to_serializable(exames_pedidos),
            "data_coleta": data_coleta.strftime("%Y-%m-%d %H:%M:%S")
        }

        print("\n==== PAYLOAD ENVIADO ====")
        print(payload)
        print("==========================\n")

        response = requests.post(url_painel, json=payload, timeout=10)

        if response.status_code == 200:
            print(f"✅ Agendamento {agendamento_id} enviado com sucesso para o painel-coleta.")
        else:
            print(f"⚠️ Erro ao enviar agendamento {agendamento_id}: HTTP {response.status_code} - {response.text}")

    except Exception as e:
        print(f"❌ Erro ao enviar agendamento {agendamento_id}: {e}")
        traceback.print_exc()


def enviar_pedido_hl7_http(agendamento_id, paciente_info, exames_pedidos, data_coleta):
    """Constrói e envia uma mensagem HL7 ORM^O01 via HTTP POST."""
    try:
        url_lis = os.environ.get(
            "LIS_HL7_ENDPOINT",
            "https://webhook.site/18ab0ede-223c-4613-8bb0-66ec4ffc7000"
        )

        data_hora_msg = datetime.now().strftime('%Y%m%d%H%M%S')

        msh = f"MSH|^~\\&|LabAccess|Clinica|LIS|Laboratorio|{data_hora_msg}||ORM^O01|{agendamento_id}|P|2.3"
        pid = f"PID|||{paciente_info.get('cpf','')}||{paciente_info.get('nome','Nome Nao Informado')}||{paciente_info.get('data_nascimento','')}"
        orc = f"ORC|NW|{agendamento_id}"

        obr_segments = []
        for exame in exames_pedidos:
            obr = f"OBR|||{exame.get('codigo')}^{exame.get('nome')}||{data_coleta.strftime('%Y%m%d%H%M%S')}"
            obr_segments.append(obr)

        hl7_message_str = "\r".join([msh, pid, orc] + obr_segments) + "\r"

        response = requests.post(
            url_lis,
            data=hl7_message_str.encode("utf-8"),
            headers={"Content-Type": "application/hl7-v2"},
            timeout=10
        )

        if response.status_code == 200:
            print(f"✅ HL7 (ID {agendamento_id}) enviado com sucesso para LIS.")
        else:
            print(f"⚠️ Erro HTTP {response.status_code} ao enviar HL7 (ID {agendamento_id}): {response.text}")

    except Exception as e:
        print(f"❌ ERRO FATAL ao tentar enviar HL7 (ID: {agendamento_id}): {e}")
        traceback.print_exc()


# ===========================================================
# Rotas originais (mantidas)
# ===========================================================

@agendamento_bp.route("/agendamentos-do-dia", methods=["GET"])
@jwt_required()
def agendamentos_do_dia():
    try:
        user = usuario_collection.find_one(
            {"cpf": get_jwt_identity().split(":")[0], "tipo": "medico"}
        )
        if not user:
            return jsonify({"msg": "Acesso não autorizado"}), 403
        
        data_str = request.args.get("data")
        if not data_str:
            data_obj = datetime.now()
        else:
            data_obj = datetime.strptime(data_str, "%Y-%m-%d")
        
        inicio = datetime(data_obj.year, data_obj.month, data_obj.day, 0, 0, 0)
        fim = inicio + timedelta(days=1)
        
        agendamentos = list(agendamento_collection.find({
            "data_coleta": {"$gte": inicio, "$lt": fim}
        }))
        
        for ag in agendamentos:
            ag["_id"] = str(ag["_id"])
            ag["data_coleta"] = ag["data_coleta"].isoformat()
            paciente = usuario_collection.find_one({"cpf": ag["cpf_usuario"]}, {"nome": 1})
            ag["paciente_nome"] = paciente.get("nome", "Não informado")
        
        return jsonify(agendamentos), 200
        
    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar agendamentos: {str(e)}"}), 500


@agendamento_bp.route("/exames-disponiveis", methods=["GET"])
def listar_exames_disponiveis():
    exames = list(exame_collection.find({"ativo": True}, {"_id": 0}))
    return jsonify(exames), 200


@agendamento_bp.route("/agendar", methods=["POST"])
@jwt_required()
def criar_agendamento():
    data = request.get_json()
    cpf_usuario = get_jwt_identity().split(":")[0]
    
    if not all(k in data for k in ["exames", "data_coleta"]):
        return jsonify({"msg": "Dados incompletos"}), 400
    
    if not isinstance(data["exames"], list) or len(data["exames"]) == 0:
        return jsonify({"msg": "Selecione pelo menos um exame"}), 400
    
    data_coleta = datetime.fromisoformat(data["data_coleta"])
    hora_coleta = data_coleta.strftime("%H:%M")
    
    agendamentos_conflitantes = list(agendamento_collection.find({
        "data_coleta": {
            "$gte": datetime(data_coleta.year, data_coleta.month, data_coleta.day, 0, 0, 0),
            "$lt": datetime(data_coleta.year, data_coleta.month, data_coleta.day, 23, 59, 59)
        }
    }))
    
    horarios_ocupados = [ag["data_coleta"].strftime("%H:%M") for ag in agendamentos_conflitantes]
    
    if hora_coleta in horarios_ocupados:
        return jsonify({"msg": "Este horário não está mais disponível. Por favor, escolha outro."}), 400
    
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
    
    agendamento = {
        "cpf_usuario": cpf_usuario,
        "exames": exames_validos,
        "data_coleta": data_coleta,
        "status": "agendado",
        "local_coleta": data.get("local_coleta", "Sede Principal"),
        "data_criacao": datetime.utcnow(),
        "etapas": {
            "coleta": {"realizada": False, "responsavel": None, "data": None},
            "analise": {"realizada": False, "responsavel": None, "data": None},
            "laudo": {"realizada": False, "responsavel": None, "data": None}
        }
    }

    try:
        result = agendamento_collection.insert_one(agendamento)
        novo_agendamento_id = result.inserted_id

        paciente = usuario_collection.find_one({"cpf": cpf_usuario}) or {}
        # 🔥 SERIALIZAÇÃO AQUI (ESSENCIAL)
        paciente = to_serializable(paciente)
        exames_validos = to_serializable(exames_validos)
        # ✅ Envia automaticamente o agendamento para o painel e para o LIS (HL7)
        try:
            enviar_agendamento_painel_coleta(novo_agendamento_id, paciente, exames_validos, data_coleta)
        except Exception as e1:
            print(f"⚠️ Falha ao enviar para painel-coleta: {e1}")
        try:
            enviar_pedido_hl7_http(novo_agendamento_id, paciente, exames_validos, data_coleta)
        except Exception as e2:
            print(f"⚠️ Falha ao enviar HL7: {e2}")

        return jsonify({
            "msg": "Agendamento criado com sucesso",
            "agendamento_id": str(novo_agendamento_id)
        }), 201
    except Exception as e:
        return jsonify({"msg": f"Erro ao criar agendamento: {str(e)}"}), 500


@agendamento_bp.route("/laudos-pendentes", methods=["GET"])
@jwt_required()
def listar_laudos_pendentes():
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
        paciente = usuario_collection.find_one({"cpf": ag["cpf_usuario"]}, {"nome": 1})
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
    user = usuario_collection.find_one(
        {"cpf": get_jwt_identity().split(":")[0], "tipo": "tecnico"}
    )
    if not user:
        return jsonify({"msg": "Acesso não autorizado"}), 403
    
    data = request.get_json()
    if not data.get("amostras"):
        return jsonify({"msg": "Informe as amostras coletadas"}), 400
    
    coleta_data = {
        "agendamento_id": ObjectId(agendamento_id),
        "tecnico_responsavel": user["cpf"],
        "data_coleta": datetime.utcnow(),
        "amostras": data["amostras"],
    }
    
    try:
        agendamento_collection.update_one(
            {"_id": ObjectId(agendamento_id)},
            {"$set": {
                "status": "coletado",
                "etapas.coleta": {
                    "realizada": True,
                    "responsavel": user["cpf"],
                    "data": datetime.utcnow()
                }
            }}
        )
        coleta_collection.insert_one(coleta_data)
        return jsonify({"msg": "Coleta registrada com sucesso"}), 200
    except Exception as e:
        return jsonify({"msg": f"Erro ao registrar coleta: {str(e)}"}), 500


@agendamento_bp.route("/verificar-horarios", methods=["POST"])
def verificar_horarios_disponiveis():
    try:
        data = request.get_json()
        data_agendamento = data.get("data")
        exames = data.get("exames", [])
        
        if not data_agendamento:
            return jsonify({"error": "Data não informada"}), 400
        
        data_obj = datetime.fromisoformat(data_agendamento.split('T')[0])
        
        agendamentos_dia = list(agendamento_collection.find({
            "data_coleta": {
                "$gte": datetime(data_obj.year, data_obj.month, data_obj.day, 0, 0, 0),
                "$lt": datetime(data_obj.year, data_obj.month, data_obj.day, 23, 59, 59)
            }
        }))
        
        todos_horarios = [
            "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
            "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
            "18:00", "18:30", "19:00"
        ]
        
        horarios_ocupados = [ag["data_coleta"].strftime("%H:%M") for ag in agendamentos_dia]
        horarios_disponiveis = [hora for hora in todos_horarios if hora not in horarios_ocupados]
        
        return jsonify({"disponiveis": horarios_disponiveis, "ocupados": horarios_ocupados}), 200
    except Exception as e:
        return jsonify({"error": f"Erro ao verificar horários: {str(e)}"}), 500
