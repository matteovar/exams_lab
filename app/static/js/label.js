// static/js/label.js

// Função para gerar o código de barras
function generateBarcode() {
    const patientName = "{{ patient_name }}";
    const examType = "{{ exam_type }}";

    // Gera o código de barras
    JsBarcode("#barcode", `${patientName}-${examType}`, {
        format: "CODE128", // Formato do código de barras
        displayValue: true, // Exibe o valor abaixo do código de barras
        fontSize: 16, // Tamanho da fonte do valor
        lineColor: "#000", // Cor das barras
        width: 2, // Largura das barras
        height: 100, // Altura das barras
    });
}

// Função para imprimir a etiqueta
function printLabel() {
    window.print();
}

// Função para voltar à página anterior
function goBack() {
    window.history.back();
}

// Gera o código de barras ao carregar a página
window.onload = generateBarcode;