from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_user 
from routes.project_routes import project_bp
from routes.bookmark_routes import bookmark_bp
from models import db
app=Flask(__name__)
from config import Config
from models.category import Category
from models.bookmark import Bookmark
from models.message import Message
from models.Project import Project
from models.review import  Review
from models.users import Users

app.config['SECRET_KEY']='nikhillll18'
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///projecthub.db'
db.init_app(app)
CORS(app)

app.config.from_object(Config)


# auth blue print like auth route
app.register_blueprint(auth_user,url_prefix='/api/auth')
app.register_blueprint(project_bp,url_prefix='/api/projects')
app.register_blueprint(bookmark_bp,url_prefix='/api/bookmark')
print('hello')


with app.app_context():
    db.create_all()
    # cat1=Category(id=1,name='SOFTWARE')
    # cat2=Category(id=2,name='HARDWARE')
    # db.session.add(cat1)
    # db.session.add(cat2)
    # db.session.commit()
    print('data is inserted in the category')


if __name__=="__main__":
    app.run(debug=True)