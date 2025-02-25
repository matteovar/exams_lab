from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_name = db.Column(db.String(100), nullable=False)
    exam_type = db.Column(db.String(100), nullable=False)
    result = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Exam {self.patient_name} - {self.exam_type}>"
