from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import exame_collection

exames_bp = Blueprint("exames", __name__)

@exames_bp.route("/", methods=["GET"])
@exames_bp.route("/disponiveis", methods=["GET"])
def listar_exames_disponiveis():
    try:
        # Retorna todos os exames ativos, excluindo o campo _id
        exames = list(exame_collection.find({"ativo": True}, {"_id": 0}))
        return jsonify({
            "success": True,
            "exames": exames
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Erro ao buscar exames: {str(e)}"
        }), 500
    
@exames_bp.route("/padroes", methods=["GET"])
def obter_padroes_laudo():
    try:
        # Na prática, isso viria do banco de dados
        padroes = {
            "Hemograma": {
                "campos": [
                    {"nome": "Hemoglobina", "unidade": "g/dL", "valor_referencia": "12-16"},
                    {"nome": "Hematócrito", "unidade": "%", "valor_referencia": "36-46"},
                    {"nome": "Leucócitos", "unidade": "células/mm³", "valor_referencia": "4000-11000"},
                    {"nome": "Plaquetas", "unidade": "células/mm³", "valor_referencia": "150000-450000"}
                ],
                "template": """Laudo Hematológico:
- Hemoglobina: {Hemoglobina} g/dL (VR: 12-16)
- Hematócrito: {Hematócrito}% (VR: 36-46)
- Leucócitos: {Leucócitos} células/mm³ (VR: 4000-11000)
- Plaquetas: {Plaquetas} células/mm³ (VR: 150000-450000)

Conclusão: {conclusao}"""
            },
            "Glicemia": {
                "campos": [
                    {"nome": "Glicemia", "unidade": "mg/dL", "valor_referencia": "70-99 (jejum)"}
                ],
                "template": """Laudo Glicêmico:
- Glicemia: {Glicemia} mg/dL (VR: 70-99 em jejum)

Conclusão: {conclusao}"""
            }
        }
        
        return jsonify({
            "success": True,
            "padroes": padroes
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@exames_bp.route("/<codigo>", methods=["GET"])
def obter_exame(codigo):
    try:
        exame = exame_collection.find_one(
            {"codigo": codigo, "ativo": True}, 
            {"_id": 0}
        )
        if not exame:
            return jsonify({
                "success": False,
                "error": "Exame não encontrado ou inativo"
            }), 404
        
        return jsonify({
            "success": True,
            "exame": exame
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Erro ao buscar exame: {str(e)}"
        }), 500