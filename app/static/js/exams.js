// static/js/exame.js

// Dados dos campos específicos para cada subcategoria
const subcategoryFields = {
    "Leucócitos": ["Número total de leucócitos", "Leucograma diferencial"],
    "Plaquetas": ["Contagem de plaquetas", "Volume plaquetário médio"],
    "Hemograma Completo": ["Hemoglobina", "Hematócrito", "Contagem de glóbulos vermelhos"],
    // Adicione mais subcategorias e campos conforme necessário
};

// Função para carregar subcategorias dinamicamente
function loadSubcategories() {
    var category = document.getElementById("category").value;
    var subcategorySelect = document.getElementById("subcategory");
    
    // Limpa as opções atuais
    subcategorySelect.innerHTML = '<option value="" disabled selected>Selecione a subcategoria</option>';
    
    // Carrega as subcategorias correspondentes
    if (category) {
        var subcategories = JSON.parse('{{ exam_subcategories|tojson|safe }}');
        subcategories[category].forEach(function(subcat) {
            var option = document.createElement("option");
            option.value = subcat;
            option.text = subcat;
            subcategorySelect.appendChild(option);
        });
    }
}

// Função para mostrar campos específicos da subcategoria
function showFields() {
    var subcategory = document.getElementById("subcategory").value;
    var fieldsContainer = document.getElementById("fields-container");
    
    // Limpa os campos anteriores
    fieldsContainer.innerHTML = "";
    
    // Mostra os campos específicos da subcategoria selecionada
    if (subcategory && subcategoryFields[subcategory]) {
        subcategoryFields[subcategory].forEach(function(field) {
            var label = document.createElement("label");
            label.textContent = field + ":";
            label.setAttribute("for", field.toLowerCase().replace(/ /g, "_"));
            
            var input = document.createElement("input");
            input.type = "text";
            input.id = field.toLowerCase().replace(/ /g, "_");
            input.name = field.toLowerCase().replace(/ /g, "_");
            input.required = true;
            
            fieldsContainer.appendChild(label);
            fieldsContainer.appendChild(input);
            fieldsContainer.appendChild(document.createElement("br"));
        });
    }
}