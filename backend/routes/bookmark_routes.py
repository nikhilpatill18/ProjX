from models import db
from flask import request,make_response,jsonify,current_app,Blueprint
from routes.auth_routes import authMiddleware
from models.category import Category
from models.Project import  Project
from models.bookmark import Bookmark
print('bookmark file')

bookmark_bp=Blueprint('bookmark_bp',__name__)


# get the bookmark project
@bookmark_bp.route('/',methods=['GET'])
@authMiddleware
def get_bookmark():
    try:
        data=[]
        bookmarked=Bookmark.query.filter_by(user_id=request.user.user_id).all()
        for bookmark in bookmarked:
            project=Project.query.filter_by(id=bookmark.project_id).first()
            images=project.images
            data.append({'title':project.title,'description':project.description,'images':[img.url for img  in images]})
        return jsonify({'message':'success','data':data})
        # print()
    except Exception:
        print(Exception)
# bookmark a project
@bookmark_bp.route('/<int:project_id>',methods=['POST'])
@authMiddleware
def add_bookmark(project_id):
    try:
        user_id=request.user.user_id
        bookmark=Bookmark(user_id=user_id,project_id=project_id)
        db.session.add(bookmark)
        db.session.commit()
        return jsonify({'message':'book mark added sussfully'}),200
    except Exception as e:
        print(e)



# remove a book mark project
@bookmark_bp.route('/<int:project_id>',methods=['DELETE'])
@authMiddleware
def remove_bookmark(project_id):
    try:
        user_id=request.user.user_id
        result=Bookmark.query.filter_by(user_id=user_id,project_id=project_id).delete()
        db.session.commit()
        return jsonify({'message':'removed sussfully','result':result}),200
    except Exception as e:
        print(e)
 