import json
from bson import ObjectId
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, Response, send_file
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename
from urllib.parse import unquote  
import io
from reportlab.pdfgen import canvas
from models import (
    medico_collection,
    usuario_collection,
    ficha_collection,
    agendamento_collection,
    fs,  # GridFS inicializado no models.py
)

medico_bp = Blueprint("medico", __name__)

# ------------------- FICHA ÚNICA -------------------
@medico_bp.route("/fichas", methods=["POST"])
@jwt_required()
def salvar_ficha():
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")
    
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem salvar fichas"}), 403

    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "Nenhum dado fornecido"}), 400
            
        exames = data.get("exames", [])
        if not exames:
            return jsonify({"msg": "Nenhum exame fornecido"}), 400

        ficha_data = {
            "agendamento_id": ObjectId(data["agendamentoId"]),
            "paciente_id": data["pacienteId"],
            "paciente_nome": data["pacienteNome"],
            "medicoResponsavel": cpf_medico,
            "data_preenchimento": datetime.utcnow(),
            "status": "concluido",
            "exames": [
                {
                    "nome": exame["nome"],
                    "resultados": exame.get("resultados", {}),
                    "observacoes": exame.get("observacoes", ""),
                    "conclusao": exame.get("conclusao", ""),
                    "laudo_completo": exame.get("laudoCompleto", "")
                }
                for exame in exames
            ],
            "laudo_pdf_id": None
        }

        ficha_id = ficha_collection.insert_one(ficha_data).inserted_id

        agendamento_collection.update_one(
            {"_id": ObjectId(data["agendamentoId"])},
            {"$set": {"status": "concluido", "ficha_id": str(ficha_id)}}
        )

        return jsonify({
            "msg": "Ficha salva com sucesso",
            "ficha_id": str(ficha_id)
        }), 201

    except Exception as e:
        return jsonify({"msg": f"Erro ao salvar ficha: {str(e)}"}), 500


# ------------------- LISTAGEM E GET -------------------
@medico_bp.route("/fichas", methods=["GET"])
@jwt_required()
def listar_fichas():
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")

    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

    fichas = list(ficha_collection.find({"medicoResponsavel": cpf_medico}))
    for ficha in fichas:
        ficha["_id"] = str(ficha["_id"])
        ficha["agendamento_id"] = str(ficha["agendamento_id"])
        if "data_preenchimento" in ficha:
            ficha["data_preenchimento"] = ficha["data_preenchimento"].isoformat()
    return jsonify(fichas), 200


@medico_bp.route("/fichas/<ficha_id>", methods=["GET"])
@jwt_required()
def get_ficha(ficha_id):
    identity = get_jwt_identity()
    cpf_medico, tipo = identity.split(":")
    if tipo != "medico":
        return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

    ficha = ficha_collection.find_one({"_id": ObjectId(ficha_id), "medicoResponsavel": cpf_medico})
    if not ficha:
        return jsonify({"msg": "Ficha não encontrada"}), 404

    ficha["_id"] = str(ficha["_id"])
    ficha["agendamento_id"] = str(ficha["agendamento_id"])
    if "data_preenchimento" in ficha:
        ficha["data_preenchimento"] = ficha["data_preenchimento"].isoformat()

    return jsonify(ficha), 200


# ------------------- PDF -------------------
@medico_bp.route("/fichas/<ficha_id>/pdf", methods=["GET"])
@jwt_required()
def get_laudo_pdf(ficha_id):
    ficha = ficha_collection.find_one({"_id": ObjectId(ficha_id)})
    if not ficha:
        return jsonify({"msg": "Ficha não encontrada"}), 404

    if not ficha.get("laudo_pdf_id"):
        return jsonify({"msg": "Nenhum PDF anexado a esta ficha"}), 404

    try:
        pdf_file = fs.get(ObjectId(ficha["laudo_pdf_id"]))
        return Response(
            pdf_file.read(),
            mimetype="application/pdf",
            headers={"Content-Disposition": f"inline; filename={pdf_file.filename}"}
        )
    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar PDF: {str(e)}"}), 500
    

    
@medico_bp.route("/pacientes", methods=["GET"])
@jwt_required()
def listar_pacientes():
    try:
        identity = get_jwt_identity()
        cpf_medico, tipo = identity.split(":")
        
        if tipo != "medico":
            return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

        # Buscar todos os pacientes que têm agendamentos com este médico
        # ou outra lógica conforme sua necessidade
        pipeline = [
            {
                "$lookup": {
                    "from": "agendamentos",
                    "localField": "cpf",
                    "foreignField": "cpf_usuario",
                    "as": "agendamentos"
                }
            },
            {
                "$match": {
                    "agendamentos": {"$ne": []},  # Apenas pacientes com agendamentos
                    "tipo": "usuario"
                }
            },
            {
                "$project": {
                    "nome": 1,
                    "cpf": 1,
                    "email": 1,
                    "telefone": 1,
                    "data_nascimento": 1,
                    "total_agendamentos": {"$size": "$agendamentos"}
                }
            },
            {"$sort": {"nome": 1}}
        ]

        pacientes = list(usuario_collection.aggregate(pipeline))
        
        # Converter ObjectId para string
        for paciente in pacientes:
            paciente["_id"] = str(paciente.get("_id", ""))
            
        return jsonify(pacientes), 200

    except Exception as e:
        return jsonify({"msg": f"Erro ao buscar pacientes: {str(e)}"}), 500
    

@medico_bp.route("/pacientes/<nome>", methods=["GET"])
@jwt_required()
def get_paciente_por_nome(nome):
    try:
        identity = get_jwt_identity()
        cpf_medico, tipo = identity.split(":")
        
        if tipo != "medico":
            return jsonify({"msg": "Apenas médicos podem acessar esta rota"}), 403

        from urllib.parse import unquote
        nome_decodificado = unquote(nome)
        
        # Buscar o paciente pelo nome
        paciente = usuario_collection.find_one(
            {"nome": nome_decodificado, "tipo": "usuario"},
            {"_id": 0, "senha": 0}  # Excluir campos sensíveis
        )
        
        if not paciente:
            return jsonify({"msg": "Paciente não encontrado"}), 404

        # Buscar agendamentos do paciente
        agendamentos = list(agendamento_collection.find(
            {"cpf_usuario": paciente["cpf"]},
            {"_id": 0, "cpf_usuario": 0}
        ))
        
        # Buscar fichas do paciente
        fichas = list(ficha_collection.find(
            {"paciente_id": paciente["cpf"]},
            {"_id": 0, "paciente_id": 0, "medicoResponsavel": 0}
        ))
        
        # Função para converter objetos para serialização JSON
        def convert_for_json(obj):
            if isinstance(obj, ObjectId):
                return str(obj)
            elif isinstance(obj, datetime):
                return obj.isoformat()
            elif isinstance(obj, list):
                return [convert_for_json(item) for item in obj]
            elif isinstance(obj, dict):
                return {key: convert_for_json(value) for key, value in obj.items()}
            return obj
        
        # Converter todos os objetos para formato serializável
        paciente = convert_for_json(paciente)
        agendamentos = convert_for_json(agendamentos)
        fichas = convert_for_json(fichas)

        response_data = {
            "paciente": paciente,
            "agendamentos": agendamentos,
            "fichas": fichas
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Erro detalhado: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"msg": f"Erro ao buscar paciente: {str(e)}"}), 500
# ------------------- RESULTADOS PACIENTE -------------------
@medico_bp.route("/resultados-paciente", methods=["GET"])
@jwt_required()
def resultados_paciente():
    identity = get_jwt_identity()
    cpf_paciente, tipo = identity.split(":")
    
    if tipo != "usuario":
        return jsonify({"msg": "Apenas pacientes podem acessar esta rota"}), 403
    
    fichas = list(ficha_collection.find({"paciente_id": cpf_paciente}))
    for ficha in fichas:
        ficha["_id"] = str(ficha["_id"])
        if "agendamento_id" in ficha:
            ficha["agendamento_id"] = str(ficha["agendamento_id"])
        if "data_preenchimento" in ficha:
            ficha["data_preenchimento"] = ficha["data_preenchimento"].isoformat()
    
    return jsonify(fichas), 200


@medico_bp.route("/pdf-dia", methods=["GET"])
def pdf_dia():
    token = request.args.get("access_token")
    if not token:
        return jsonify({"msg": "Token não informado"}), 401
    
    try:
        from flask_jwt_extended import decode_token
        decoded_token = decode_token(token)
        identity = decoded_token['sub']
        if not identity.endswith(":usuario"):
            return jsonify({"msg": "Apenas pacientes podem acessar esta rota"}), 403
    except Exception as e:
        return jsonify({"msg": f"Token inválido: {str(e)}"}), 401

    data_str = request.args.get("data")
    if not data_str:
        return jsonify({"msg": "Data não informada"}), 400

    try:
        inicio = datetime.strptime(data_str, "%d/%m/%Y")
        fim = inicio + timedelta(days=1)
        
        fichas = list(ficha_collection.find({
            "data_preenchimento": {
                "$gte": inicio,
                "$lt": fim
            }
        }))

        if not fichas:
            return jsonify({"msg": "Nenhum exame encontrado para o dia"}), 404

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.setFont("Helvetica", 12)
        y = 800
        p.drawString(50, y, f"Exames do dia {data_str}")
        y -= 30

        for ficha in fichas:
            p.drawString(50, y, f"Paciente: {ficha.get('paciente_nome', '')}")
            y -= 20
            for exame in ficha.get("exames", []):
                p.drawString(70, y, f"Exame: {exame.get('nome', '')}")
                y -= 20
                for k, v in exame.get("resultados", {}).items():
                    p.drawString(90, y, f"{k}: {v}")
                    y -= 15
                p.drawString(90, y, f"Laudo: {exame.get('laudo_completo', '')}")
                y -= 25
            y -= 10
            if y < 100:
                p.showPage()
                y = 800

        p.save()
        buffer.seek(0)
        return send_file(buffer, mimetype="application/pdf", as_attachment=False, download_name=f"exames_{data_str}.pdf")
    except Exception as e:
        return jsonify({"msg": f"Erro ao gerar PDF: {str(e)}"}), 500
