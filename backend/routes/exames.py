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