from models import db
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    # one category → many projects
    projects = db.relationship('Project', backref='category',)


