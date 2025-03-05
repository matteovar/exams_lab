from app import create_app, db

# Cria a aplicação
app = create_app()

# Executa a aplicação
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Cria as tabelas no banco de dados
    app.run(debug=True)