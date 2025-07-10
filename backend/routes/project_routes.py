from models import db
from flask import request,make_response,jsonify,current_app,Blueprint
from flask_bcrypt import Bcrypt
import cloudinary
import cloudinary.uploader
import datetime
from functools import wraps
from routes.auth_routes import authMiddleware


project_bp=Blueprint('/api/projects',__name__)
cloudinary.config(
    cloud_name= 'dwg1z2iih',
    api_key= '886927352398459',
    api_secret= '3PGTVBNx3qQ51x0T7VexbEGVJdU'
)


@project_bp.route('/add-project',methods=['POST'])
# @authMiddleware
def add_project():
    print('hi')
    try:
        title=request.form.get('tittle')
        description=request.form.get('description')
        readme_file=request.files.get('readme')
        subject=request.form.get('subject')
        price=request.form.get('price')
        complexity=request.form.get('complexity')
        time=request.form.get('time')
        images=request.files.get('images')
    except Exception as e:
        print(e)
    return jsonify({'message':'work'})
    