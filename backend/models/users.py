from models import db
from datetime import datetime

class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    username = db.Column(db.String(100), nullable=True, unique=True)
    email = db.Column(db.String(120), nullable=True, unique=True)
    firebase_uid=db.Column(db.String(200),nullable=False,unique=True)
    # password = db.Column(db.String(200), nullable=False)
    profile_photo = db.Column(db.String(200))
    github_username = db.Column(db.String(100),nullable=True)
    github_verified = db.Column(db.Boolean, default=False)
    full_name = db.Column(db.String(150))
    IsprofileCompletd=db.Column(db.Boolean,default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    # projects = db.relationship('Project', backref='owner', lazy=True)
    # bookmarks = db.relationship('Bookmark', backref='user', lazy=True)
    # reviews = db.relationship('Review', backref='user', lazy=True)
    # sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    # received_messages = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)
    