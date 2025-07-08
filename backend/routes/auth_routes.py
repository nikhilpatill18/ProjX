from flask import Blueprint , request,jsonify,make_response
from models import db
from models.users import Users
import jwt
from flask_bcrypt import Bcrypt
import cloudinary
import cloudinary.uploader

auth_user=Blueprint('/auth',__name__)

bcrypt=Bcrypt()
cloudinary.config(
    cloud_name= 'dwg1z2iih',
    api_key= '886927352398459',
    api_secret= '3PGTVBNx3qQ51x0T7VexbEGVJdU'
)


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
        hash_pass=bcrypt.generate_password_hash(password).decode('utf-8')
        if not file_upload:
            return jsonify({'message':"profilePic is required"}) , 404
        upload_result=cloudinary.uploader.upload(file_upload)
        print(upload_result['url'])
        user=Users(username=username,password=hash_pass,profile_photo=upload_result['url'],full_name=full_name,email=email)
        db.session.add(user)
        db.session.commit()
        print(user)
        response=make_response(jsonify({'message':'user created successfull','data':{
            'user_id':user.user_id,
            'username':user.username,
            'email':user.email,
            'full_name':user.full_name,
            'profile_photo':user.profile_photo
        }}))
        return response
    except :
        print('something error in register')