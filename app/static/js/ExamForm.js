class ExamForm {
    constructor() {
        this.categorySelect = document.getElementById("category");
        this.subcategorySelect = document.getElementById("subcategory");
        this.fieldsContainer = document.getElementById("fields-container");
        this.examSubcategories = JSON.parse('{{ exam_subcategories|tojson|safe }}');
        this.subcategoryFields = {
            "Leucócitos": ["Número total de leucócitos", "Leucograma diferencial"],
            "Plaquetas": ["Contagem de plaquetas", "Volume plaquetário médio"],
            "Hemograma Completo": ["Hemoglobina", "Hematócrito", "Contagem de glóbulos vermelhos"],
        };

        this.init();
    }

    init() {
        this.categorySelect.addEventListener('change', () => this.loadSubcategories());
        this.subcategorySelect.addEventListener('change', () => this.showFields());
    }

    loadSubcategories() {
        const category = this.categorySelect.value;
        this.subcategorySelect.innerHTML = '<option value="" disabled selected>Selecione a subcategoria</option>';
        if (category) {
            this.examSubcategories[category].forEach(subcat => {
                const option = document.createElement("option");
                option.value = subcat;
                option.text = subcat;
                this.subcategorySelect.appendChild(option);
            });
        }
    }

    showFields() {
        const subcategory = this.subcategorySelect.value;
        this.fieldsContainer.innerHTML = "";
        if (subcategory && this.subcategoryFields[subcategory]) {
            this.subcategoryFields[subcategory].forEach(field => {
                const label = document.createElement("label");
                label.textContent = field + ":";
                label.setAttribute("for", field.toLowerCase().replace(/ /g, "_"));
                
                const input = document.createElement("input");
                input.type = "text";
                input.id = field.toLowerCase().replace(/ /g, "_");
                input.name = field.toLowerCase().replace(/ /g, "_");
                input.required = true;
                
                this.fieldsContainer.appendChild(label);
                this.fieldsContainer.appendChild(input);
                this.fieldsContainer.appendChild(document.createElement("br"));
            });
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    new ExamForm();
});