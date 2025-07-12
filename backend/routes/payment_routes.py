from models.payment import Payment
from routes.auth_routes import authMiddleware
from flask import jsonify,request,make_response,Blueprint
import stripe
from models import db

payment_bp=Blueprint('payment_bp',__name__)

stripe.api_key="sk_test_51R0dUjCHGVpdj2fgoJEqDBDWUEDbS9rU95DEQcDIxtrkFN1DFTbPm0OIviG35nCekccyriHeGbl1ewv7qk1fG7oV00qNNOjoYl"


# payment backend created just testing from front is needed
@payment_bp.route('/create-payment-intent',methods=['POST'])
@authMiddleware
def create_payment_intent():
    try:
        print()
        amount=request.form.get('amount')
        buyer_id=request.form.get('buyer_id')
        project_id=request.form.get('project_id')
        if not amount or not buyer_id or not project_id:
            return jsonify({'message':'all the thing are required'}),400
        # payment intent
        intent=stripe.PaymentIntent.create(
            amount=amount,
            currency='inr',
            payment_method_types=['card']
        )

        # save the payment
        payment=Payment(
            buyer_id=buyer_id,
            project_id=project_id,amount=amount,payment_intent_id=intent.id,
            status='pending'
        )
        db.session.add(payment)
        db.session.commit()
        print(intent.client_secret)
        return jsonify({'clientSecret':intent.client_secret})
        

    except Exception as e:
        print(e)

@payment_bp.route('/update-status',methods=['POST'])
def update_status():
    try:
        status=request.get_json().get('status')
        payment_intent_id=request.get_json().get('payment_intent_id')
        payment=Payment.query.filter_by(payment_intent_id=payment_intent_id).first()
        if not payment:
            return jsonify({'message':'NO Payment found'}),404
        payment.status=status
        db.session.commit()
        return jsonify({'message':'status updated successfully'}),200
    except Exception as e:
        print(e)