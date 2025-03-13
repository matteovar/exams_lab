// Função para adicionar mais campos de categoria e subcategoria
function addCategoryField() {
    const container = document.getElementById('category-container');

    const newCategoryGroup = document.createElement('div');
    newCategoryGroup.className = 'category-group';

    const newCategoryField = document.createElement('div');
    newCategoryField.className = 'form-group';
    newCategoryField.innerHTML = `
        <label for="category">Categoria do Exame:</label>
        <select name="category[]" onchange="loadSubcategories(this)" required>
            <option value="" disabled selected>Selecione a categoria</option>
            ${Object.keys(examSubcategories).map(category => `<option value="${category}">${category}</option>`).join('')}
        </select>
    `;

    const newSubcategoryField = document.createElement('div');
    newSubcategoryField.className = 'form-group';
    newSubcategoryField.innerHTML = `
        <label for="subcategory">Subcategoria do Exame:</label>
        <select name="subcategory[]" required>
            <option value="" disabled selected>Selecione a subcategoria</option>
        </select>
    `;

    newCategoryGroup.appendChild(newCategoryField);
    newCategoryGroup.appendChild(newSubcategoryField);
    container.appendChild(newCategoryGroup);
}

// Função para carregar subcategorias ao selecionar uma categoria
function loadSubcategories(categorySelect) {
    const selectedCategory = categorySelect.value;
    const subcategorySelect = categorySelect.parentElement.nextElementSibling.querySelector('select');

    subcategorySelect.innerHTML = '<option value="" disabled selected>Selecione a subcategoria</option>';

    if (examSubcategories[selectedCategory]) {
        examSubcategories[selectedCategory].forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    }
}

// Função para alternar o menu lateral
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Função para voltar à página anterior
function goBack() {
    window.history.back();
}
