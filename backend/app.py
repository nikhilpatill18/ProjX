from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_user 
from models import db
app=Flask(__name__)

app.config['SECRET_KEY']='nikhillll18'
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///projecthub.db'
db.init_app(app)
CORS(app)




# auth blue print like auth route
app.register_blueprint(auth_user,url_prefix='/auth')

with app.app_context():
    db.create_all()

if __name__=="__main__":
    app.run(debug=True)