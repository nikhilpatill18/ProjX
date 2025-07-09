from flask import Blueprint , request,jsonify,make_response,current_app
from models import db
from models.users import Users
import jwt
from flask_bcrypt import Bcrypt
import cloudinary
import cloudinary.uploader
import datetime
from functools import wraps

auth_user=Blueprint('/auth',__name__)

bcrypt=Bcrypt()
cloudinary.config(
    cloud_name= 'dwg1z2iih',
    api_key= '886927352398459',
    api_secret= '3PGTVBNx3qQ51x0T7VexbEGVJdU'
)


# auth middleware

def authMiddleware(f):
    @wraps(f)
    def decorated_function(*args,**kwargs):
        token=request.cookies.get('Access-token')
        if not token:
            return jsonify({"message":'Invlaid crendtials'}),401
        try:
            payload=jwt.decode(token,current_app.config['SECRET_KEY'],algorithms='HS256')
            print(payload)
            user=Users.query.filter_by(user_id=payload['user_id']).first()
            if not user:
                return jsonify({"message":'no data found'}),404
            request.user=user
            # request.user=user
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        return f(*args,**kwargs)
    return decorated_function



# register user controller
@auth_user.route('/register',methods=['POST'])
def register():
    username=request.form.get('username')
    email=request.form.get('email')
    password=request.form.get('password')
    full_name=request.form.get('username')
    file_upload=request.files.get('profile_photo')
    print(request.form)
    try:

        if (not username or not email or not password or not full_name ):
            respone=make_response(jsonify({'message':'All the Fields are compulsary'}),404)
            return respone
        existing_user=Users.query.filter((Users.email==email)|(Users.username==username)).first()
        if(existing_user):
            return jsonify({'message':'User already exits with same email or username'}),404
        hash_pass=bcrypt.generate_password_hash(password).decode('utf-8')
        if not file_upload:
            return jsonify({'message':"profilePic is required"}) , 404
        upload_result=cloudinary.uploader.upload(file_upload)
        print(upload_result['url'])
        user=Users(username=username,password=hash_pass,profile_photo=upload_result['url'],full_name=full_name,email=email)
        db.session.add(user)
        db.session.commit()
        print(user)
        token=jwt.encode({'user_id':user.user_id,'exp':datetime.datetime.utcnow()+datetime.timedelta(hours=1)},
         current_app.config['SECRET_KEY'] ,algorithm='HS256'
                         )
        response=make_response(jsonify({'message':'user created successfull','data':{
            'user_id':user.user_id,
            'username':user.username,
            'email':user.email,
            'full_name':user.full_name,
            'profile_photo':user.profile_photo
        }}))
        response.set_cookie('Access-token',token,httponly=True,secure=False)
        return response
    except :
        print('something error in register')



# login user controller
@auth_user.route('/login',methods=['POSt'])
def login():
    username=request.form.get('username')
    password=request.form.get('password')
    print(username,password)
    try:
        exitsing_user=Users.query.filter_by(username=username).first()
        check_pass=bcrypt.check_password_hash(exitsing_user.password,password)
        print(check_pass)
        if  not check_pass:
            return jsonify({'message':'Please Enter the correct pass'}),500
        print(exitsing_user.user_id,'user')
        token=jwt.encode({
            'user_id':exitsing_user.user_id,
            'exp':datetime.datetime.utcnow()+datetime.timedelta(hours=1)
        },current_app.config['SECRET_KEY'],algorithm='HS256')
        response=make_response(jsonify({'message':'Login Success Fully','data':{
            'user_id':exitsing_user.user_id,
            'username':exitsing_user.username,
            'email':exitsing_user.email,
            'full_name':exitsing_user.full_name,
            'profile_photo':exitsing_user.profile_photo
        }}),200)
        response.set_cookie('Access-token',token,httponly=True,secure=False)
        return response
    except:
        print('errro')

@auth_user.route('/updateProfile',methods=['POST'])
@authMiddleware
def updateProfile():
    try:
        user=request.user
        username=request.form.get('username')
        email=request.form.get('email')
        full_name=request.form.get('full_name')
        file_upload=request.files.get('profile_photo')
        if(file_upload):
            upload_result=cloudinary.uploader.upload(file_upload)
            user.profile_photo=upload_result['url']
        if username:
            user.username=username
        if email:
            user.email=email
        if full_name:
            user.full_name=full_name
        db.session.commit()
        response=make_response(jsonify({'message':'profile updatesussfully','data':{
                                        'user_id': user.user_id,
                                        'username': user.username,
                                        'email': user.email,
                                        'full_name': user.full_name,
                                        'profile_photo': user.profile_photo}
                                        }),200)
        return response



    except:
        print('error in updateprofile')



@auth_user.route('/logout',methods=['GET'])
@authMiddleware
def logout():
    try:
        response=make_response({"mesage":'logout'})
        response.set_cookie('Access-token','',expires=0,httponly=True)
        return response
    
    except:
        print('error in logout')