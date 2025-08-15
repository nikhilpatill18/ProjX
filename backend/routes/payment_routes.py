from models.payment import Payment
from routes.auth_routes import firebaseAuthmiddleware
from flask import jsonify,request,make_response,Blueprint
import stripe
from models import db
from models.Project import Project
from models.users import Users
from sqlalchemy import or_ 

payment_bp=Blueprint('payment_bp',__name__)

stripe.api_key="sk_test_51R0dUjCHGVpdj2fgoJEqDBDWUEDbS9rU95DEQcDIxtrkFN1DFTbPm0OIviG35nCekccyriHeGbl1ewv7qk1fG7oV00qNNOjoYl"


# payment backend created just testing from front is needed
@payment_bp.route('/create-payment-intent',methods=['POST'])
@firebaseAuthmiddleware
def create_payment_intent():
    try:
        print()
        user=request.user
        amount=request.form.get('amount')
        # buyer_id=request.form.get('buyer_i')
        project_id=request.form.get('project_id')
        if not amount or not user.user_id or not project_id:
            return jsonify({'message':'all the thing are required'}),400
        # payment intent
        intent=stripe.PaymentIntent.create(
            amount=amount,
            currency='inr',
            payment_method_types=['card'],
        )

        # save the payment
        payment=Payment(
            buyer_id=user.user_id,
            project_id=project_id,amount=amount,payment_intent_id=intent.id,
            status='pending'
        )
        print(payment)
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



@payment_bp.route('/gethistory',methods=['GET'])
@firebaseAuthmiddleware
def get_history():
    user_id=request.user.user_id
    result=db.session.query(Payment,Project,Users).join(Project,Payment.project_id==Project.id).join(Users,Project.user_id==Users.user_id).filter(or_(
            Payment.buyer_id == user_id,   # Projects the user bought
            Project.user_id == user_id     # Projects the user sold
        )).all()
    history=[]
    for payment,project,user in result:
        history.append({'projectname':project.title,'paymentStatus':payment.status,'paymentDate':payment.created_at,'amount':payment.amount,'username':user.username,'project_id':project.id,'payment_id':payment.id,'project_owner_id':user.user_id,'activity':'bought'if user_id==payment.buyer_id else 'sold'
                        
                        })
    return jsonify({'data':history}),200