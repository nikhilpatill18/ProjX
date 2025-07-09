from models import db
from flask import Flask,request,make_response,jsonify,current_app,blueprints
from flask_bcrypt import Bcrypt
import cloudinary
import cloudinary.uploader
import datetime
from functools import wraps
from auth_routes import authMiddleware


project_bp=blueprints('/projects',__name__)
cloudinary.config(
    cloud_name= 'dwg1z2iih',
    api_key= '886927352398459',
    api_secret= '3PGTVBNx3qQ51x0T7VexbEGVJdU'
)

