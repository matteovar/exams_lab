import os
from dotenv import load_dotenv
from routes.exames_config import exames_iniciais
from pymongo import MongoClient
import gridfs

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)

db = client["LabAccess"]

# Coleções principais
medico_collection = db["medicos"]
ficha_collection = db["fichas"]
usuario_collection = db["usuarios"]
agendamento_collection = db["agendamentos"]
exame_collection = db["exames"]
coleta_collection = db["coletas"]
laudo_collection = db["laudos"]
padroes_collection = db["padroes"]

fs = gridfs.GridFS(db)


# Inserir exames iniciais apenas se a coleção estiver vazia
if exame_collection.count_documents({}) == 0:
    try:
        exame_collection.insert_many(exames_iniciais)
        print("Exames iniciais cadastrados com sucesso!")
    except Exception as e:
        print(f"Erro ao cadastrar exames iniciais: {str(e)}")

