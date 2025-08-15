from datetime import datetime
from models import db

class ShippingDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

    shipping_address = db.Column(db.Text, nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    status = db.Column(db.String(50), default='Pending')  # Pending, Shipped, Delivered, Cancelled
    tracking_id = db.Column(db.String(100), nullable=True)
    courier_name = db.Column(db.String(100), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    project = db.relationship('Project', backref='shipping_orders')
