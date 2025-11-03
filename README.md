# Projeto de Analise Laboratorial (TCC)

#### Este projeto tem como objetivo desenvolver um software para análise e gestão de exames laboratoriais, integrando um backend em Flask (Python) e um frontend moderno em React.

# Linguagens Usadas:
#### Frontend
* React (JavaScript + Vite)

* CSS / Tailwind (ou outro framework caso aplicável)

#### Backend

* Python

* Flask

* MongoDB


# ⚠️ Importante:
#### Para executar o projeto corretamente, mantenha dois terminais abertos:

#### Um rodando o backend (Flask)

#### Outro rodando o frontend (React)

# Como inicalizar o projeto

### 1. Clone o Repositorio.
```
git clone https://github.com/matteovar/exams_lab.git
cd exams_lab
```
### 2. Configurar o ambiente do backend ⚙️ (Flask)
1. Crie e ative um ambiente virtual:
    ```
    python -m venv **nome da sua venv**
    ```
    * Windows:
        ```
        venv\Scripts\activate
        ```
    * Linux/Mac:
        ```
        source venv/bin/activate
        ```

2. Acesse a pasta

    ```
    cd backend
    ```

3. Instale todas as bibliotecas que estao no requirements.txt

    ````
    pip install -r backend/requirements.txt
    ````

4. Execute o servidor Flask:
    ```
    
    python app.py
    ```

### 3. Configurar o ambiente do frontend 🖥️ (React)

1. Acesse a pasta do frontend:
    ```
    cd frontend
    ```
2. Instale as dependências:

    ```
    npm install
    ```

3. Inicie o servidor de desenvolvimento:

    ```
    npm run dev
    ```

# Requisitos
* Python 3.10+

* Node.js 18+

* npm ou yarn