from models import db

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    complexity = db.Column(db.String(50))     # e.g., Easy, Medium, Hard
    duration_hours = db.Column(db.Integer)    # e.g., 10 hours
    subject = db.Column(db.String(50), nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    is_verified = db.Column(db.Boolean, default=False)

    # foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    status = db.Column(
        db.Enum('available', 'sold', name='project_status'),
        nullable=False,
        default='available'
    )

    # relationships
    bookmarks = db.relationship('Bookmark', backref='project', lazy=True)
    reviews = db.relationship('Review', backref='project', lazy=True)
    images = db.relationship('ProjectImage', backref='project', lazy=True)

    software = db.relationship('SoftwareProject', backref='project', uselist=False)
    hardware = db.relationship('HardwareProject', backref='project', uselist=False)


class SoftwareProject(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    readme_verified = db.Column(db.Boolean, default=False)
    tech_stack = db.Column(db.String(200))
    repo_url = db.Column(db.String(200))   


class HardwareProject(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    video_url = db.Column(db.String(500),nullable=True)
    hardware_verified = db.Column(db.Boolean, default=False)
