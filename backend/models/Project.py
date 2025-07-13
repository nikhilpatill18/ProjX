from models import db
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    complexity = db.Column(db.String(50))     # e.g., Easy, Medium, Hard
    duration_hours = db.Column(db.Integer)    # e.g., 10 hours
    subject=db.Column(db.String(50),nullable=True)
    repo_name = db.Column(db.String(100))     # e.g., "my-project"
    repo_url = db.Column(db.String(200))

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

    # relationships
    bookmarks = db.relationship('Bookmark', backref='project', lazy=True)
    reviews = db.relationship('Review', backref='project', lazy=True)
    images = db.relationship('ProjectImage', backref='project', lazy=True)
