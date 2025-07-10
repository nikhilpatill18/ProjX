from models import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

    github_username = db.Column(db.String(100))
    github_verified = db.Column(db.Boolean, default=False)

    # relationships
    projects = db.relationship('Project', backref='owner', lazy=True)
    bookmarks = db.relationship('Bookmark', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    received_messages = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"
    