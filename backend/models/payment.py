from models import db
from datetime import datetime
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)  # who paid
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)  # for which project
    amount = db.Column(db.Integer, nullable=False)  # in paise/cents, e.g., ₹100 = 10000
    currency = db.Column(db.String(10), default='INR')
    status = db.Column(db.String(20), nullable=False)  # pending, succeeded, failed
    payment_intent_id = db.Column(db.String(100))  # Stripe payment intent ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
