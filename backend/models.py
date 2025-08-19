import os
from dotenv import load_dotenv
from pymongo import MongoClient

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

# Adicionar isso ao models.py, na parte de exames_iniciais
padroes_laudo = {
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

exames_iniciais = [
    {
        "nome": "Hemograma",
        "codigo": "HEMO",
        "especialidade": "Hematologia",
        "preparo": "Jejum não obrigatório",
        "prazo": "1 dia útil",
        "valor": 25.90,
        "ativo": True
    },
    {
        "nome": "Glicemia",
        "codigo": "GLIC",
        "especialidade": "Bioquímica",
        "preparo": "Jejum de 8 horas",
        "prazo": "1 dia útil",
        "valor": 12.50,
        "ativo": True
    },
    {
        "nome": "Colesterol Total",
        "codigo": "COLT",
        "especialidade": "Lipidograma",
        "preparo": "Jejum de 12 horas",
        "prazo": "1 dia útil",
        "valor": 30.00,
        "ativo": True
    },
    {
        "nome": "Triglicérides",
        "codigo": "TRIG",
        "especialidade": "Lipidograma",
        "preparo": "Jejum de 12 horas",
        "prazo": "1 dia útil",
        "valor": 30.00,
        "ativo": True
    },
    {
        "nome": "TSH",
        "codigo": "TSH",
        "especialidade": "Endocrinologia",
        "preparo": "Jejum não obrigatório",
        "prazo": "2 dias úteis",
        "valor": 45.00,
        "ativo": True
    },
    {
        "nome": "T4 Livre",
        "codigo": "T4L",
        "especialidade": "Endocrinologia",
        "preparo": "Jejum não obrigatório",
        "prazo": "2 dias úteis",
        "valor": 45.00,
        "ativo": True
    },
    {
        "nome": "Ureia",
        "codigo": "UREA",
        "especialidade": "Bioquímica",
        "preparo": "Jejum de 8 horas",
        "prazo": "1 dia útil",
        "valor": 20.00,
        "ativo": True
    },
    {
        "nome": "Creatinina",
        "codigo": "CREA",
        "especialidade": "Bioquímica",
        "preparo": "Jejum de 8 horas",
        "prazo": "1 dia útil",
        "valor": 20.00,
        "ativo": True
    },
    {
        "nome": "Exame de Urina Tipo I",
        "codigo": "URIN",
        "especialidade": "Urinalise",
        "preparo": "Coleta de urina pela manhã",
        "prazo": "1 dia útil",
        "valor": 15.00,
        "ativo": True
    },
    {
        "nome": "Eletrocardiograma (ECG)",
        "codigo": "ECG",
        "especialidade": "Cardiologia",
        "preparo": "Sem preparo especial",
        "prazo": "No dia",
        "valor": 50.00,
        "ativo": True
    },
    {
        "nome": "Raio-X de Tórax",
        "codigo": "RXTO",
        "especialidade": "Radiologia",
        "preparo": "Sem preparo especial",
        "prazo": "No dia",
        "valor": 70.00,
        "ativo": True
    },
    {
        "nome": "PCR (Proteína C Reativa)",
        "codigo": "PCR",
        "especialidade": "Imunologia",
        "preparo": "Jejum não obrigatório",
        "prazo": "1 dia útil",
        "valor": 40.00,
        "ativo": True
    },
    {
        "nome": "HIV (Teste Rápido)",
        "codigo": "HIV",
        "especialidade": "Imunologia",
        "preparo": "Jejum não obrigatório",
        "prazo": "1 dia útil",
        "valor": 35.00,
        "ativo": True
    },
    {
        "nome": "VDRL",
        "codigo": "VDRL",
        "especialidade": "Imunologia",
        "preparo": "Jejum não obrigatório",
        "prazo": "1 dia útil",
        "valor": 25.00,
        "ativo": True
    }
]


# Inserir exames iniciais apenas se a coleção estiver vazia
if exame_collection.count_documents({}) == 0:
    try:
        exame_collection.insert_many(exames_iniciais)
        print("Exames iniciais cadastrados com sucesso!")
    except Exception as e:
        print(f"Erro ao cadastrar exames iniciais: {str(e)}")