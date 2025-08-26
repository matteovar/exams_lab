
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
    },
    "Colesterol Total": {
        "campos": [
            {"nome": "Colesterol", "unidade": "mg/dL", "valor_referencia": "< 200"}
        ],
        "template": """Laudo Lipídico:
- Colesterol Total: {Colesterol} mg/dL (VR: < 200)

Conclusão: {conclusao}"""
    },
    "Triglicérides": {
        "campos": [
            {"nome": "Triglicérides", "unidade": "mg/dL", "valor_referencia": "< 150"}
        ],
        "template": """Laudo Lipídico:
- Triglicérides: {Triglicérides} mg/dL (VR: < 150)

Conclusão: {conclusao}"""
    },
    "Exame de Urina Tipo I": {
        "campos": [
            {"nome": "Densidade", "unidade": "", "valor_referencia": "1.005-1.030"},
            {"nome": "pH", "unidade": "", "valor_referencia": "4.5-8.0"},
            {"nome": "Proteínas", "unidade": "mg/dL", "valor_referencia": "Negativo"},
            {"nome": "Glicose", "unidade": "mg/dL", "valor_referencia": "Negativo"}
        ],
        "template": """Laudo Urinálise:
- Densidade: {Densidade} (VR: 1.005-1.030)
- pH: {pH} (VR: 4.5-8.0)
- Proteínas: {Proteínas} mg/dL (VR: Negativo)
- Glicose: {Glicose} mg/dL (VR: Negativo)

Conclusão: {conclusao}"""
    },
    "TSH": {
        "campos": [
            {"nome": "TSH", "unidade": "µUI/mL", "valor_referencia": "0.4-4.0"}
        ],
        "template": """Laudo Hormonal:
- TSH: {TSH} µUI/mL (VR: 0.4-4.0)

Conclusão: {conclusao}"""
    },
    "T4 Livre": {
        "campos": [
            {"nome": "T4 Livre", "unidade": "ng/dL", "valor_referencia": "0.8-2.0"}
        ],
        "template": """Laudo Hormonal:
- T4 Livre: {T4 Livre} ng/dL (VR: 0.8-2.0)

Conclusão: {conclusao}"""
    },
    "PCR (Proteína C Reativa)": {
        "campos": [
            {"nome": "PCR", "unidade": "mg/L", "valor_referencia": "< 5"}
        ],
        "template": """Laudo Imunológico:
- PCR: {PCR} mg/L (VR: < 5)

Conclusão: {conclusao}"""
    },
    "Eletrocardiograma": {
        "campos": [
            {"nome": "Resultado", "unidade": "", "valor_referencia": "Normal/Alterado"}
        ],
        "template": """Laudo Cardiológico:
- Eletrocardiograma: {Resultado}

Conclusão: {conclusao}"""
    },
    "Raio-X de Tórax": {
        "campos": [
            {"nome": "Achados Radiológicos", "unidade": "", "valor_referencia": "Normal/Alterado"}
        ],
        "template": """Laudo Radiológico:
- Raio-X de Tórax: {Achados Radiológicos}

Conclusão: {conclusao}"""
    },
    "Ultrassonografia Abdominal": {
        "campos": [
            {"nome": "Achados Ultrassonográficos", "unidade": "", "valor_referencia": "Normal/Alterado"}
        ],
        "template": """Laudo Ultrassonográfico:
- Ultrassonografia Abdominal: {Achados Ultrassonográficos}

Conclusão: {conclusao}"""
    },
    "Ressonância Magnética": {
        "campos": [
            {"nome": "Achados de Imagem", "unidade": "", "valor_referencia": "Normal/Alterado"}
        ],
        "template": """Laudo de Ressonância Magnética:
- Achados: {Achados de Imagem}

Conclusão: {conclusao}"""
    },
    "Teste Ergométrico": {
        "campos": [
            {"nome": "Resultado", "unidade": "", "valor_referencia": "Normal/Alterado"}
        ],
        "template": """Laudo Ergométrico:
- Teste Ergométrico: {Resultado}

Conclusão: {conclusao}"""
    },
    "Papanicolau": {
        "campos": [
            {"nome": "Resultado Citológico", "unidade": "", "valor_referencia": "Negativo/Alterado"}
        ],
        "template": """Laudo Citopatológico:
- Papanicolau: {Resultado Citológico}

Conclusão: {conclusao}"""
    },
    "Espermatograma": {
        "campos": [
            {"nome": "Volume", "unidade": "mL", "valor_referencia": "1.5-6.0"},
            {"nome": "Concentração", "unidade": "milhões/mL", "valor_referencia": ">15"},
            {"nome": "Motilidade", "unidade": "%", "valor_referencia": ">40"}
        ],
        "template": """Laudo Andrológico:
- Volume: {Volume} mL (VR: 1.5-6.0)
- Concentração: {Concentração} milhões/mL (VR: >15)
- Motilidade: {Motilidade}% (VR: >40)

Conclusão: {conclusao}"""
    },
    "Sorologia para HIV": {
        "campos": [
            {"nome": "Resultado", "unidade": "", "valor_referencia": "Negativo/Positivo"}
        ],
        "template": """Laudo Sorológico:
- Sorologia para HIV: {Resultado}

Conclusão: {conclusao}"""
    },
    "Creatinina": {
        "campos": [
            {"nome": "Creatinina", "unidade": "mg/dL", "valor_referencia": "0.6-1.3"}
        ],
        "template": """Laudo Bioquímico:
- Creatinina: {Creatinina} mg/dL (VR: 0.6-1.3)

Conclusão: {conclusao}"""
    },
    "Exame de Fezes": {
        "campos": [
            {"nome": "Aspecto", "unidade": "", "valor_referencia": "Normal"},
            {"nome": "Presença de Parasitas", "unidade": "", "valor_referencia": "Ausente"}
        ],
        "template": """Laudo Parasitológico:
- Aspecto: {Aspecto}
- Presença de Parasitas: {Presença de Parasitas}

Conclusão: {conclusao}"""
    },
    "Prova de Função Hepática": {
        "campos": [
            {"nome": "TGO (AST)", "unidade": "U/L", "valor_referencia": "10-40"},
            {"nome": "TGP (ALT)", "unidade": "U/L", "valor_referencia": "10-40"},
            {"nome": "Fosfatase Alcalina", "unidade": "U/L", "valor_referencia": "40-129"},
            {"nome": "Bilirrubina Total", "unidade": "mg/dL", "valor_referencia": "0.3-1.2"}
        ],
        "template": """Laudo Hepático:
- TGO (AST): {TGO (AST)} U/L (VR: 10-40)
- TGP (ALT): {TGP (ALT)} U/L (VR: 10-40)
- Fosfatase Alcalina: {Fosfatase Alcalina} U/L (VR: 40-129)
- Bilirrubina Total: {Bilirrubina Total} mg/dL (VR: 0.3-1.2)

Conclusão: {conclusao}"""
    },"Vitamina D": {
        "campos": [
            {"nome": "Vitamina D", "unidade": "ng/mL", "valor_referencia": "30-100"}
        ],
        "template": """Laudo Endocrinológico:
- Vitamina D: {Vitamina D} ng/mL (VR: 30-100)

Conclusão: {conclusao}"""
    },
    "Hemoglobina Glicada (HbA1c)": {
        "campos": [
            {"nome": "HbA1c", "unidade": "%", "valor_referencia": "4.0-5.6"}
        ],
        "template": """Laudo Endocrinológico:
- Hemoglobina Glicada (HbA1c): {HbA1c}% (VR: 4.0-5.6)

Conclusão: {conclusao}"""
    },
    "Ferro Sérico": {
        "campos": [
            {"nome": "Ferro", "unidade": "µg/dL", "valor_referencia": "50-170"}
        ],
        "template": """Laudo Hematológico:
- Ferro Sérico: {Ferro} µg/dL (VR: 50-170)

Conclusão: {conclusao}"""
    },
    "Transferrina": {
        "campos": [
            {"nome": "Transferrina", "unidade": "mg/dL", "valor_referencia": "200-360"}
        ],
        "template": """Laudo Hematológico:
- Transferrina: {Transferrina} mg/dL (VR: 200-360)

Conclusão: {conclusao}"""
    },
    "Exame de TGO/TGP": {
        "campos": [
            {"nome": "TGO (AST)", "unidade": "U/L", "valor_referencia": "10-40"},
            {"nome": "TGP (ALT)", "unidade": "U/L", "valor_referencia": "10-40"}
        ],
        "template": """Laudo Hepático:
- TGO (AST): {TGO (AST)} U/L (VR: 10-40)
- TGP (ALT): {TGP (ALT)} U/L (VR: 10-40)

Conclusão: {conclusao}"""
    },
    "Ureia": {
        "campos": [
            {"nome": "Ureia", "unidade": "mg/dL", "valor_referencia": "10-50"}
        ],
        "template": """Laudo Bioquímico:
- Ureia: {Ureia} mg/dL (VR: 10-50)

Conclusão: {conclusao}"""
    },
    "Eletrólitos (Na, K, Cl)": {
        "campos": [
            {"nome": "Sódio", "unidade": "mEq/L", "valor_referencia": "135-145"},
            {"nome": "Potássio", "unidade": "mEq/L", "valor_referencia": "3.5-5.0"},
            {"nome": "Cloro", "unidade": "mEq/L", "valor_referencia": "98-107"}
        ],
        "template": """Laudo Bioquímico:
- Sódio: {Sódio} mEq/L (VR: 135-145)
- Potássio: {Potássio} mEq/L (VR: 3.5-5.0)
- Cloro: {Cloro} mEq/L (VR: 98-107)

Conclusão: {conclusao}"""
    },
    "Exame de Lipase": {
        "campos": [
            {"nome": "Lipase", "unidade": "U/L", "valor_referencia": "13-60"}
        ],
        "template": """Laudo Bioquímico:
- Lipase: {Lipase} U/L (VR: 13-60)

Conclusão: {conclusao}"""
    },
    "Exame de Amilase": {
        "campos": [
            {"nome": "Amilase", "unidade": "U/L", "valor_referencia": "30-110"}
        ],
        "template": """Laudo Bioquímico:
- Amilase: {Amilase} U/L (VR: 30-110)

Conclusão: {conclusao}"""
    },
    "Exame de PSA": {
        "campos": [
            {"nome": "PSA", "unidade": "ng/mL", "valor_referencia": "0-4"}
        ],
        "template": """Laudo Urológico:
- PSA: {PSA} ng/mL (VR: 0-4)

Conclusão: {conclusao}"""
    },
    "Sorologia Hepatite B": {
        "campos": [
            {"nome": "Resultado HBsAg", "unidade": "", "valor_referencia": "Negativo/Positivo"}
        ],
        "template": """Laudo Sorológico:
- Hepatite B (HBsAg): {Resultado HBsAg}

Conclusão: {conclusao}"""
    },
    "Sorologia Hepatite C": {
        "campos": [
            {"nome": "Resultado Anti-HCV", "unidade": "", "valor_referencia": "Negativo/Positivo"}
        ],
        "template": """Laudo Sorológico:
- Hepatite C (Anti-HCV): {Resultado Anti-HCV}

Conclusão: {conclusao}"""
    },
    "Teste de Coagulação (TAP/TTPA)": {
        "campos": [
            {"nome": "TAP (%)", "unidade": "%", "valor_referencia": "70-100"},
            {"nome": "TTPA (s)", "unidade": "s", "valor_referencia": "25-35"}
        ],
        "template": """Laudo Hematológico:
- TAP: {TAP (%)}% (VR: 70-100)
- TTPA: {TTPA (s)} s (VR: 25-35)

Conclusão: {conclusao}"""
    },
    "Eletroencefalograma (EEG)": {
        "campos": [
            {"nome": "Resultado", "unidade": "", "valor_referencia": "Normal/Alterado"}
        ],
        "template": """Laudo Neurológico:
- EEG: {Resultado}

Conclusão: {conclusao}"""
    },
    "Densitometria Óssea": {
        "campos": [
            {"nome": "Resultado T-score", "unidade": "", "valor_referencia": "Normal: ≥ -1; Osteopenia: -1 a -2.5; Osteoporose: ≤ -2.5"}
        ],
        "template": """Laudo Radiológico:
- Densitometria Óssea (T-score): {Resultado T-score}

Conclusão: {conclusao}"""
    }

}

exames_iniciais = [
    {"nome": "Hemograma", "codigo": "HEMO", "especialidade": "Hematologia", "preparo": "Jejum não obrigatório", "prazo": "1 dia útil", "valor": 25.90, "ativo": True},
    {"nome": "Glicemia", "codigo": "GLIC", "especialidade": "Bioquímica", "preparo": "Jejum de 8 horas", "prazo": "1 dia útil", "valor": 12.50, "ativo": True},
    {"nome": "Colesterol Total", "codigo": "COLT", "especialidade": "Lipidograma", "preparo": "Jejum de 12 horas", "prazo": "1 dia útil", "valor": 30.00, "ativo": True},
    {"nome": "Triglicérides", "codigo": "TRIG", "especialidade": "Lipidograma", "preparo": "Jejum de 12 horas", "prazo": "1 dia útil", "valor": 30.00, "ativo": True},
    {"nome": "Exame de Urina Tipo I", "codigo": "URIN", "especialidade": "Urinalise", "preparo": "Coleta de urina pela manhã", "prazo": "1 dia útil", "valor": 15.00, "ativo": True},
    {"nome": "TSH", "codigo": "TSH", "especialidade": "Endocrinologia", "preparo": "Jejum de 4 horas", "prazo": "2 dias úteis", "valor": 35.00, "ativo": True},
    {"nome": "T4 Livre", "codigo": "T4L", "especialidade": "Endocrinologia", "preparo": "Jejum de 4 horas", "prazo": "2 dias úteis", "valor": 32.00, "ativo": True},
    {"nome": "PCR (Proteína C Reativa)", "codigo": "PCR", "especialidade": "Imunologia", "preparo": "Jejum não obrigatório", "prazo": "2 dias úteis", "valor": 40.00, "ativo": True},
    {"nome": "Eletrocardiograma", "codigo": "ECG", "especialidade": "Cardiologia", "preparo": "Evitar cafeína antes do exame", "prazo": "1 dia útil", "valor": 60.00, "ativo": True},
    {"nome": "Raio-X de Tórax", "codigo": "RXT", "especialidade": "Radiologia", "preparo": "Retirar objetos metálicos", "prazo": "1 dia útil", "valor": 80.00, "ativo": True},
    {"nome": "Ultrassonografia Abdominal", "codigo": "USAB", "especialidade": "Ultrassonografia", "preparo": "Jejum de 8 horas", "prazo": "2 dias úteis", "valor": 120.00, "ativo": True},
    {"nome": "Ressonância Magnética", "codigo": "RM", "especialidade": "Radiologia", "preparo": "Jejum de 4 horas, informar alergias", "prazo": "3 dias úteis", "valor": 350.00, "ativo": True},
    {"nome": "Teste Ergométrico", "codigo": "ERG", "especialidade": "Cardiologia", "preparo": "Roupas leves, evitar refeições pesadas", "prazo": "2 dias úteis", "valor": 90.00, "ativo": True},
    {"nome": "Papanicolau", "codigo": "PAP", "especialidade": "Ginecologia", "preparo": "Evitar relações 48h antes", "prazo": "2 dias úteis", "valor": 50.00, "ativo": True},
    {"nome": "Espermatograma", "codigo": "ESP", "especialidade": "Andrologia", "preparo": "Abstinência sexual de 3 dias", "prazo": "2 dias úteis", "valor": 70.00, "ativo": True},
    {"nome": "Sorologia para HIV", "codigo": "HIV", "especialidade": "Imunologia", "preparo": "Jejum não obrigatório", "prazo": "3 dias úteis", "valor": 55.00, "ativo": True},
    {"nome": "Creatinina", "codigo": "CREA", "especialidade": "Bioquímica", "preparo": "Jejum de 4 horas", "prazo": "1 dia útil", "valor": 18.00, "ativo": True},
    {"nome": "Exame de Fezes", "codigo": "FEZ", "especialidade": "Parasitologia", "preparo": "Coleta em recipiente limpo", "prazo": "2 dias úteis", "valor": 20.00, "ativo": True},
    {"nome": "Prova de Função Hepática", "codigo": "PFH", "especialidade": "Bioquímica", "preparo": "Jejum de 8 horas", "prazo": "2 dias úteis", "valor": 45.00, "ativo": True},
    {"nome": "Vitamina D", "codigo": "VITD", "especialidade": "Endocrinologia", "preparo": "Jejum não obrigatório", "prazo": "3 dias úteis", "valor": 60.00, "ativo": True},
    {"nome": "Hemoglobina Glicada (HbA1c)", "codigo": "HBA1C", "especialidade": "Endocrinologia", "preparo": "Jejum não obrigatório", "prazo": "2 dias úteis", "valor": 40.00, "ativo": True},
    {"nome": "Ferro Sérico", "codigo": "FER", "especialidade": "Hematologia", "preparo": "Jejum de 8 horas", "prazo": "1 dia útil", "valor": 25.00, "ativo": True},
    {"nome": "Transferrina", "codigo": "TRF", "especialidade": "Hematologia", "preparo": "Jejum de 8 horas", "prazo": "2 dias úteis", "valor": 30.00, "ativo": True},
    {"nome": "Exame de TGO/TGP", "codigo": "TGO_TGP", "especialidade": "Bioquímica", "preparo": "Jejum de 8 horas", "prazo": "1 dia útil", "valor": 35.00, "ativo": True},
    {"nome": "Ureia", "codigo": "URE", "especialidade": "Bioquímica", "preparo": "Jejum de 4 horas", "prazo": "1 dia útil", "valor": 15.00, "ativo": True},
    {"nome": "Eletrólitos (Na, K, Cl)", "codigo": "ELE", "especialidade": "Bioquímica", "preparo": "Jejum de 4 horas", "prazo": "1 dia útil", "valor": 25.00, "ativo": True},
    {"nome": "Exame de Lipase", "codigo": "LIP", "especialidade": "Bioquímica", "preparo": "Jejum de 8 horas", "prazo": "2 dias úteis", "valor": 50.00, "ativo": True},
    {"nome": "Exame de Amilase", "codigo": "AMI", "especialidade": "Bioquímica", "preparo": "Jejum de 8 horas", "prazo": "2 dias úteis", "valor": 50.00, "ativo": True},
    {"nome": "Exame de PSA", "codigo": "PSA", "especialidade": "Urologia", "preparo": "Evitar ejaculação 48h antes", "prazo": "2 dias úteis", "valor": 45.00, "ativo": True},
    {"nome": "Sorologia Hepatite B", "codigo": "HBV", "especialidade": "Imunologia", "preparo": "Jejum não obrigatório", "prazo": "3 dias úteis", "valor": 55.00, "ativo": True},
    {"nome": "Sorologia Hepatite C", "codigo": "HCV", "especialidade": "Imunologia", "preparo": "Jejum não obrigatório", "prazo": "3 dias úteis", "valor": 55.00, "ativo": True},
    {"nome": "Teste de Coagulação (TAP/TTPA)", "codigo": "COAG", "especialidade": "Hematologia", "preparo": "Jejum não obrigatório", "prazo": "1 dia útil", "valor": 35.00, "ativo": True},
    {"nome": "Eletroencefalograma (EEG)", "codigo": "EEG", "especialidade": "Neurologia", "preparo": "Evitar cafeína antes do exame", "prazo": "2 dias úteis", "valor": 100.00, "ativo": True},
    {"nome": "Densitometria Óssea", "codigo": "DEXA", "especialidade": "Radiologia", "preparo": "Roupas leves, sem metal", "prazo": "3 dias úteis", "valor": 180.00, "ativo": True},

]   