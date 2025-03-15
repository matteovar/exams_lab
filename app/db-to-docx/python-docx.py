from flask import Flask, jsonify, url_for
import sqlite3
import os
import win32print
import win32api
from docx import Document
from docx2pdf import convert

app = Flask(__name__)

def gerar_documento():
    """Gera o documento Word e converte para PDF"""
    conn = sqlite3.connect('app/instance/exams.db')
    cursor = conn.cursor()

    cursor.execute("SELECT patient_name, category FROM exam WHERE id = 1")
    dados = cursor.fetchone()
    conn.close()

    if not dados:
        return None

    doc = Document("db-to-docx/modelo.docx")
    substituicoes = {
        "{NOME}": dados[0],
        "{CIDADE}": dados[1],
        "{DATA}": dados[2]
    }

    for paragrafo in doc.paragraphs:
        for chave, valor in substituicoes.items():
            if chave in paragrafo.text:
                paragrafo.text = paragrafo.text.replace(chave, str(valor))

    doc_word = "db-to-docx/relatorio_preenchido.docx"
    doc.save(doc_word)

    convert(doc_word)
    doc_pdf = "db-to-docx/relatorio_preenchido.pdf"

    return doc_pdf

def imprimir_pdf(pdf_path):
    """Envia o PDF para a impressora"""
    printer_name = win32print.GetDefaultPrinter()
    win32api.ShellExecute(0, "print", pdf_path, None, ".", 0)

@app.route('/gerar-imprimir', methods=['POST'])
def gerar_imprimir():
    pdf_gerado = gerar_documento()
    if pdf_gerado:
        imprimir_pdf(pdf_gerado)
        return jsonify({"status": "success", "message": "Documento gerado e enviado para impressão!"})
    else:
        return jsonify({"status": "error", "message": "Erro ao gerar o documento."})

if __name__ == "__main__":
    app.run(debug=True)
