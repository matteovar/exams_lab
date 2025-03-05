// static/js/patient_form.js

// Função para carregar sugestões de exames
function loadExamSuggestions() {
    const input = document.getElementById('exam_input');
    const suggestions = document.getElementById('exam_suggestions');

    fetch('/api/exams')
        .then(response => response.json())
        .then(data => {
            input.addEventListener('input', function() {
                const query = input.value.toLowerCase();
                suggestions.innerHTML = '';

                if (query) {
                    data.filter(exam => exam.toLowerCase().includes(query)).forEach(exam => {
                        const option = document.createElement('div');
                        option.textContent = exam;
                        option.classList.add('suggestion-item');
                        option.onclick = function() {
                            input.value = exam;
                            suggestions.innerHTML = '';
                        };
                        suggestions.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.error('Erro ao carregar os exames:', error));
}

// Função para adicionar um exame à lista de selecionados
function addExam(exam) {
    const selectedExams = document.getElementById('selected_exams');
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'exams';
    input.value = exam;
    selectedExams.appendChild(input);

    const tag = document.createElement('div');
    tag.textContent = exam;
    tag.classList.add('selected-exam');
    tag.onclick = function() {
        selectedExams.removeChild(input);
        selectedExams.removeChild(tag);
    };
    selectedExams.appendChild(tag);
}

// Carrega as sugestões ao carregar a página
window.onload = function() {
    loadExamSuggestions();
};

// Função para voltar à página anterior
function goBack() {
    window.history.back();
}