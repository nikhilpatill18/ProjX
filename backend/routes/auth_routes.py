from flask import Blueprint , request,jsonify,make_response,current_app,redirect,url_for
from models import db
from models.users import Users
import jwt
from flask_bcrypt import Bcrypt
import cloudinary
import cloudinary.uploader
import datetime
from functools import wraps
import requests
import firebase_admin
from firebase_admin import credentials,auth as firebase_auth
from models.payment import Payment
from models.Project import Project
from sqlalchemy import func


cred=credentials.Certificate('servicekey.json')
firebase_admin.initialize_app(cred)
auth_user=Blueprint('auth_user',__name__,url_prefix='/api/auth')

bcrypt=Bcrypt()



# auth middleware

# def authMiddleware(f):
#     @wraps(f)
#     def decorated_function(*args,**kwargs):
#         token=request.cookies.get('Access-token')
#         if not token:
#             return jsonify({"message":'Invlaid crendtials'}),401
#         try:
#             payload=jwt.decode(token,current_app.config['SECRET_KEY'],algorithms='HS256')
#             print(payload)
#             user=Users.query.filter_by(user_id=payload['user_id']).first()
#             if not user:
#                 return jsonify({"message":'no user  found'}),404
#             request.user=user
#             # request.user=user
#         except jwt.ExpiredSignatureError:
#             return jsonify({'message': 'Token expired'}), 401
#         except jwt.InvalidTokenError:
#             return jsonify({'message': 'Invalid token'}), 401
#         return f(*args,**kwargs)
#     return decorated_function



def firebaseAuthmiddleware(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token=request.headers.get('Authorization','').replace('Bearer ','')
        if not token:
            return jsonify({'message':'Missing token'}),401
        try:
            decoded=firebase_auth.verify_id_token(token)
            firebase_uid=decoded['uid']
            user = Users.query.filter_by(firebase_uid=firebase_uid).first()
            if not user:
                return jsonify({'message': 'User profile not found'}), 404
            request.user=user
        except Exception as e:
            print(e)
            return jsonify({'message': 'Invalid or expired token'}), 401
        return f(*args, **kwargs)
    return decorated

# register user controller
@auth_user.route('/register',methods=['GET'])
def register():
    cloudinary.config(
    cloud_name= current_app.config['CLOUD_NAME'],
    api_key= current_app.config['CLOUD_API_KEY'],
    api_secret= current_app.config['CLOUD_API_SECRET']
)
    token=request.headers.get('Authorization','').replace('Bearer ','')
    print(token)
    try:
        decoded=firebase_auth.verify_id_token(token)
        firebase_uid=decoded['uid']
        email=decoded['email']
    except Exception as e:
        print(e)
        return jsonify({'message': 'Invalid token'}), 401
    user=Users(firebase_uid=firebase_uid,email=email,IsprofileCompletd=False)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message':'user successfully register in database'}),200



# complete profile route
@auth_user.route('/complete-profile',methods=['POST'])
def complete_profile():
    cloudinary.config(
    cloud_name= current_app.config['CLOUD_NAME'],
    api_key= current_app.config['CLOUD_API_KEY'],
    api_secret= current_app.config['CLOUD_API_SECRET'])
    try:
        token=request.headers.get('Authorization').replace('Bearer ','')
        decodedToken=firebase_auth.verify_id_token(token)
        firebase_uid=decodedToken['uid']
        username=request.form.get('username')
        full_name=request.form.get('full_name')
        file_upload=request.files.get('profile_photo')
        if not username or not full_name:
            return jsonify({'message': 'username and full_name required'}), 400
        profile_photo=None
        if file_upload :
            upload_result=cloudinary.uploader.upload(file_upload)
            profile_photo=upload_result['url']
        user=Users.query.filter_by(firebase_uid=firebase_uid).first()
        print('heloooo')
        print(user.user_id)
        user.username=username
        user.full_name=full_name
        user.profile_photo=profile_photo
        user.IsprofileCompletd=True
        db.session.commit()
        print('heloooo')
        return jsonify({'message': 'Profile created successfully', 'data': {
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'profile_photo': user.profile_photo
        }}),200
        # return jsonify({'message': 'Profile created successfully'}),200
    except Exception as e:
        print(e)

@auth_user.route('/me')
@firebaseAuthmiddleware
def me():
    try:
        user=request.user
        buyedProject=Payment.query.filter_by(buyer_id=user.user_id,status='succeeded').count()
        soldProject=db.session.query(Project,Payment).join(Project,Project.id==Payment.project_id).filter(Project.user_id==user.user_id,Payment.status=='succeeded').count()
        total_paymentreceived=db.session.query(func.sum(Payment.amount)).join(Project,Project.id==Payment.project_id).filter(Payment.status=='succeeded',Project.user_id==user.user_id).scalar()
        return jsonify({'message':'success','data':{
            'user_id':user.user_id,
            'firebase_uid':user.firebase_uid,
            'fullname':user.full_name,
            'email':user.email,
            'username':user.username,
            'profile_photo':user.profile_photo,
            'IsprofileCompletd':user.IsprofileCompletd,
            'github_username':user.github_username,
            'github_verified':user.github_verified,
            'buyedProject':buyedProject,
            'soldProject':soldProject,
            'total_sale':0 if not total_paymentreceived else total_paymentreceived/100,
            'created_at':user.created_at

        }}),200
    except  Exception as e:
        print(e)



# login user controller
# @auth_user.route('/login',methods=['POST'])
# def login():
#     username=request.form.get('username')
#     password=request.form.get('password')
#     print(username,password)
#     try:
#         print('hi')
#         exitsing_user=Users.query.filter_by(username=username).first()
#         print('hii')
#         check_pass=bcrypt.check_password_hash(exitsing_user.password,password)
#         print('hiii')
#         print(check_pass)
#         if  not check_pass:
#             return jsonify({'message':'Please Enter the correct pass'}),500
#         print(exitsing_user.user_id,'user')
#         token=jwt.encode({
#             'user_id':exitsing_user.user_id,
#             'exp':datetime.datetime.utcnow()+datetime.timedelta(hours=1)
#         },current_app.config['SECRET_KEY'],algorithm='HS256')
#         response=make_response(jsonify({'message':'Login Success Fully','data':{
#             'user_id':exitsing_user.user_id,
#             'username':exitsing_user.username,
#             'email':exitsing_user.email,
#             'full_name':exitsing_user.full_name,
#             'profile_photo':exitsing_user.profile_photo
#         }}),200)
#         response.set_cookie('Access-token',token,httponly=True,secure=False)
#         print(response,'response')
#         return response
#     except Exception:
#         print(Exception)

@auth_user.route('/updateProfile',methods=['POST'])
@firebaseAuthmiddleware
def updateProfile():
    cloudinary.config(
    cloud_name= current_app.config['CLOUD_NAME'],
    api_key= current_app.config['CLOUD_API_KEY'],
    api_secret= current_app.config['CLOUD_API_SECRET']
)
    try:
        user=request.user
        username=request.form.get('username')
        full_name=request.form.get('full_name')
        file_upload=request.files.get('profile_photo')
        if(file_upload):
            upload_result=cloudinary.uploader.upload(file_upload)
            user.profile_photo=upload_result['url']
        if username:
            user.username=username
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
@firebaseAuthmiddleware
def logout():
    try:
        response=make_response({"mesage":'logout'})
        response.set_cookie('Access-token','',expires=0,httponly=True)
        return response
    
    except:
        print('error in logout')


@auth_user.route('/searchuser',methods=['GET'])
@firebaseAuthmiddleware
def searchUser():

    try:
        query=request.args.get('search')
        # print(query)
        if not query:
             return jsonify({'message': 'Search query is required'}), 400
        users=Users.query.filter((Users.username.ilike(f'%{query}%'))).all()
        results = [{
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'profile_photo': user.profile_photo
        } for user in users]
        # print(results)
        return jsonify({'message': 'Search results', 'results': results}),200
    except Exception as e:
        print('Error in search_users:', str(e))
        # return jsonify({'message': 'Internal server error'}), 500


# github login

@auth_user.route('/github/login')
def  github_login():
    print("helllllllllllllllllllllllllllll")
    userId=request.args.get('idtoken')
    github_client_id=current_app.config['GITHUB_CLIENT_ID']
    redirect_uri=url_for('auth_user.github_callback',_external=True)
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={github_client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope=read:user"
    )
    print("hello")
    # print(github_auth_url)
    response=redirect(github_auth_url)
    response.set_cookie('idtoken',userId,httponly=True,secure=False,max_age=3000)
    return response

#route where the girhub redirect

@auth_user.route('/github/callback')
def github_callback():
    code=request.args.get('code')
    if not code :
        return jsonify({'error': 'Missing code from GitHub'}), 400
    #exchange code  for access_token
    token_url='https://github.com/login/oauth/access_token'
    client_id=current_app.config['GITHUB_CLIENT_ID']
    client_secret=current_app.config['GITHUB_CLIENT_SECRET']
    payload={'client_id':client_id,'client_secret':client_secret,'code':code}
    headers={'Accept':'application/json'}
    response=requests.post(token_url,json=payload,headers=headers)
    token_json=response.json()
    access_token=token_json.get('access_token')
    if not access_token:
        return jsonify({'error': 'Failed to get access token'}), 400
    user_response = requests.get(
        'https://api.github.com/user',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    github_data = user_response.json()
    github_username = github_data.get('login')

    if not github_username:
        return jsonify({'error': 'Failed to get GitHub username'}), 400

    # Now update user in DB (dummy example, you need to know who is logged in)
    # For example, you might use session['user_id'] or JWT
    user_id = firebase_auth.verify_id_token(request.cookies.get('idtoken'))['uid']
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    from models.users import Users, db
    user = Users.query.filter_by(firebase_uid=user_id).first()
    if user:
        user.github_username = github_username
        user.github_verified = True
        db.session.commit()
    print('github login verify sussfully')

    # Redirect user back to frontend profile page
    return redirect("https://proj-x-nine.vercel.app/dashboard")
