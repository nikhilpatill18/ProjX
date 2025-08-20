from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate

from config import Config
from models import db
from routes.auth_routes import auth_user 
from routes.project_routes import project_bp
from routes.bookmark_routes import bookmark_bp
from routes.payment_routes import payment_bp

# Import all models so Migrate can detect them
from models.category import Category
from models.bookmark import Bookmark
from models.message import Message
from models.Project import Project
from models.review import Review
from models.users import Users
from models.payment import Payment
from models.projectImages import ProjectImage
from models.Project import SoftwareProject,HardwareProject
from models.projectImages import ProjectImage
from models.shippingdeatils import ShippingDetails

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = 'nikhillll18'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projecthub.db'

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

# Register routes
app.register_blueprint(auth_user, url_prefix='/api/auth')
app.register_blueprint(project_bp, url_prefix='/api/projects')
app.register_blueprint(bookmark_bp, url_prefix='/api/bookmark')
app.register_blueprint(payment_bp, url_prefix='/api/payment')



# with app.app_context():
#     # Delete all existing categories if needed
#     db.session.query(Project).delete()
#     db.session.query(SoftwareProject).delete()
#     db.session.query(HardwareProject).delete()
#     db.session.query(ProjectImage).delete()
#     db.session.query(Category).delete()
#     db.session.query(Bookmark).delete()
#     db.session.query(Payment).delete()
#     db.session.query(Users).delete()
#     db.session.commit()

#     # Manually insert categories with specific IDs
#     category1 = Category(id=1, name="SOFTWARE")
#     category2 = Category(id=2, name="HARDWARE")

#     db.session.add_all([category1, category2])
#     db.session.commit()
    # shi=ShippingDetails(id=8,user_id=2,project_id=8,shipping_address='gokul',phone_number=7226052966)
    # db.session.add(shi)
    # db.session.commit()


#     print("Categories inserted with specific IDs.")

@app.route('/username', methods=['GET'])
def usernames():
    users = Users.query.all()
    return jsonify({'data': [user.username for user in users]}), 200

if __name__ == "__main__":
    app.run(debug=True)
