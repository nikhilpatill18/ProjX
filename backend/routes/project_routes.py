from models import db
# from models import users
from flask import request,make_response,jsonify,current_app,Blueprint
from flask_bcrypt import Bcrypt
import cloudinary
import cloudinary.uploader
import datetime
from functools import wraps
from routes.auth_routes import firebaseAuthmiddleware
import google.generativeai as genai
import requests
import base64
import json
from models.Project import Project,SoftwareProject,HardwareProject
from models.category import Category
from models.projectImages import ProjectImage
from models.payment import Payment
from models.bookmark import Bookmark
from models.users import Users
project_bp=Blueprint('/api/projects',__name__)
cloudinary.config(
    cloud_name= 'dwg1z2iih',
    api_key= '886927352398459',
    api_secret= '3PGTVBNx3qQ51x0T7VexbEGVJdU'
)
# genai.configure(api_key=current_app.config['GEMINI_API_KEY'])
# model=genai.GenerativeModel('gemini-1.5-pro')
vision_model=genai.GenerativeModel('gemini-1.5-pro-vision')


# model to anayize the readme.file
def analyze_readme(readme_text):
    genai.configure(api_key=current_app.config['GEMINI_API_KEY'])
    model=genai.GenerativeModel('gemini-1.5-pro')
    print('hello')

    prompt = f"""
You're an assistant that reviews README.md files.

Check if this README has:
- A description of the project
- Installation instructions
- Usage examples
- License section
- Contributing section

Return the result strictly in JSON format (no markdown, no code fences):
{{
  "description": "yes/no + why",
  "installation": "yes/no + why",
  "usage": "yes/no + why",
  "license": "yes/no + why",
  "contributing": "yes/no + why",
  "suggestions": "Suggestions to improve README"
}}
README:
\"\"\"
{readme_text}
\"\"\"
"""
    response = model.generate_content(prompt)
    text = response.text.strip()
    # Remove possible code fences if Gemini still adds
    text = text.replace('```json', '').replace('```', '').strip()
    print(text)

    try:
        json_data = json.loads(text)
    except json.JSONDecodeError:
        json_data = {"error": "Failed to parse Gemini response", "raw": text}

    return json_data

# model to analyze the hardware
def verify_hardware_images(image_files):
    genai.configure(api_key=current_app.config['GEMINI_API_KEY'])
    model=genai.GenerativeModel('gemini-1.5-pro')
    
    """
    image_files: list of FileStorage objects from request.files.getlist()
    """
    for img in image_files:
        # read bytes
        img_bytes = img.read()

        prompt = "Does this image show a real hardware prototype, electronic device, or PCB? Answer 'yes' or 'no' and explain briefly."
        content = [
            prompt,
            {"mime_type": img.mimetype, "data": img_bytes}
        ]

        try:
            response = model.generate_content(content)
            answer = response.text.lower()
            print("Gemini answer:", answer)
            if "yes" in answer:
                return True
        except Exception as e:
            print("Error analyzing image:", e)

    return False




# analyze the harware image photot
@project_bp.route('/anayze-hardware',methods=['POST'])
def analyze_image():
     try:
          images=request.files.getlist('hardware_images')
          res=verify_hardware_images(images)
          print(res)
          return jsonify({'message':res})
     except Exception as e:
          print(e)
        
     
# repo naalyze repo route
@project_bp.route('/anayze-repo',methods=['POST'])
@firebaseAuthmiddleware
def anaylze_repo():
     try:
        user=request.user
        # print(user.github_username)
        print(request.get_json())
        repo_url=request.get_json()['repo_url']
        if len(repo_url)==0:
               jsonify({'message':'Please enter the url'}),404
        print(repo_url.rstrip('/').split('/'))
        repo_name=repo_url.rstrip('/').split('/')[-1]
        repo_api_url=f"https://api.github.com/repos/{user.github_username}/{repo_name}"
        repo_response=requests.get(repo_api_url)
        print(repo_response.status_code)
        if(repo_response.status_code!=200):
               return jsonify({'message':'repo not exits'}),404
        #   get readme file
        readme_api_url = f"https://api.github.com/repos/{'nikhilpatill18'}/{repo_name}/readme"
        readme_response = requests.get(readme_api_url)
        if readme_response.status_code!=200:
               jsonify({'message':'please enter the readme.md file in repo'}),404
        readme_data = readme_response.json()
        content_base64 = readme_data.get('content', '')
        readme_text = base64.b64decode(content_base64).decode('utf-8', errors='ignore')
        #   analyze the model
        analyze=analyze_readme(readme_text)
        is_valid = all(
        analyze.get(key, '').lower().startswith('yes')
        for key in ['description', 'installation', 'usage', 'license', 'contributing']
    )
        request.repo_url=repo_url
        return jsonify({'isvalid':is_valid,'analysis':analyze,'repo_name':repo_name})
     except Exception:
          print(Exception)



@project_bp.route('/add-project',methods=['POST'])
@firebaseAuthmiddleware
def add_project():
    try:
        userID=request.user.user_id
        category=request.form.get('category')
        category_obj=Category.query.filter_by(name=category).first()
        cat_id=category_obj.id
        if category=='SOFTWARE':
            title=request.form.get('title')
            description=request.form.get('description')
            price=request.form.get('price')
            complexity=request.form.get('complexity')
            duration_hours=request.form.get('duration_hours')
            repo_name=request.form.get('repo_name')
            repo_url=request.form.get('repo_url')
            subject=request.form.get('subject')
            is_verified=request.form.get('is_verified')
            tech_stack=request.form.get('tech_stack')
            existed_project=SoftwareProject.query.filter_by(repo_url=repo_url).first()
            if existed_project:
                return jsonify({'message':'Project Already registed'})
            project=Project(title=title,description =description,price=price,complexity=complexity,duration_hours=duration_hours,user_id=userID,category_id=cat_id,subject=subject,status='available',is_verified=False if is_verified=='False' else True)
            db.session.add(project)
            db.session.flush()
            # upload the images to the cloudiniary and data base
            image_urls=[]
            if 'images' in request.files:
                images=request.files.getlist('images')
                for img in images:
                    upload_result=cloudinary.uploader.upload(img)
                    url=upload_result['url']
                    db_image=ProjectImage(project_id=project.id,url=url)
                    image_urls.append(url)
                    db.session.add(db_image)
                    db.session.flush()
            software_project=SoftwareProject(project_id=project.id,readme_verified=False if is_verified=='False' else True,tech_stack=tech_stack,repo_url=repo_url)
            db.session.add(software_project)
            db.session.commit()
            print('data added succesfully in the data base')
            print(project.id)
            return jsonify({'message':'Project added successFully','data':{
                'project_id': project.id,
                'title': project.title,
                'description': project.description,
                'price': project.price,
                'complexity': project.complexity,
                'duration_hours': project.duration_hours,
                'subject': project.subject,
                'is_verified': project.is_verified,
                'category': category_obj.name,
                'status':project.status,
                'software': {
                    'readme_verified': software_project.readme_verified,
                    'tech_stack': software_project.tech_stack,
                    'repo_url': software_project.repo_url
                },
                'images': image_urls
            }}),200
        else :
            title=request.form.get('title')
            description=request.form.get('description')
            price=request.form.get('price')
            complexity=request.form.get('complexity')
            duration_hours=request.form.get('duration_hours')
            subject=request.form.get('subject')
            is_verified=request.form.get('is_verified')
          #   existed_project=HardwareProject.query.filter_by(repo_url=repo_url).first()
          #   if existed_project:
          #       return jsonify({'message':'Project Already registed'})
            project=Project(title=title,description =description,price=price,complexity=complexity,duration_hours=duration_hours,user_id=userID,category_id=cat_id,subject=subject,is_verified=False if is_verified=='False' else True)
            db.session.add(project)
            db.session.flush()
            # upload the images to the cloudiniary and data base
            image_urls=[]
            if 'images' in request.files:
                images=request.files.getlist('images')
                for img in images:
                    upload_result=cloudinary.uploader.upload(img)
                    url=upload_result['url']
                    db_image=ProjectImage(project_id=project.id,url=url)
                    image_urls.append(url)
                    db.session.add(db_image)
                    db.session.flush()
            hardware_project=HardwareProject(project_id=project.id,hardware_verified=False if is_verified=='False' else True)
            db.session.add(hardware_project)
            db.session.commit()
            print('data added succesfully in the data base')
            return jsonify({'message':'Project added successFully','data':{
                'project_id': project.id,
                'title': project.title,
                'description': project.description,
                'price': project.price,
                'complexity': project.complexity,
                'duration_hours': project.duration_hours,
                'subject': project.subject,
                'is_verified': project.is_verified,
                'category': category_obj.name,
                'hardware': {
                    'hardware_verified': hardware_project.hardware_verified,
                    # 'tech_stack': software_project.tech_stack,
                    # 'repo_url': software_project.repo_url
                },
                'images': image_urls
            }})
             
        

    except Exception as e:
        print(e)
        return jsonify({'message':'error in adding project'}),500
    


# get all the project posted by other uiser
@project_bp.route('/getproject', methods=['GET'])
@firebaseAuthmiddleware
def getProject():
    try:
        user=request.user
        projects=Project.query.filter(Project.user_id!=user.user_id).all()
        bookmark_projects=Bookmark.query.filter(Bookmark.user_id==user.user_id)
        bookmark_ids={bp.project_id for bp in bookmark_projects}
        result=[]
        for project in projects:
                owner_data=Users.query.filter_by(user_id=project.user_id).first()
                print(owner_data)
                category=Category.query.filter_by(id=project.category_id).first()
                print(category)
                category_name=category.name if category else None
                if category_name=='SOFTWARE':
                     software_project=SoftwareProject.query.filter_by(project_id=project.id).first()
                     software_data=None
                     if software_project:
                          software_data={
                               'readme_verified': software_project.readme_verified,
                                'tech_stack': software_project.tech_stack,
                                'repo_url': software_project.repo_url,
                                'tech_stack':software_project.tech_stack
                          }
                else:
                     hardware_project=HardwareProject.query.filter_by(project_id=project.id).first()
                     hardware_data=None
                     if hardware_project:
                          hardware_data={
                                'video_url': hardware_project.video_url,
                                'hardware_verified': hardware_project.hardware_verified,
                          }
                project_data=software_data if hardware_data==None else hardware_data
                result.append({
                'project_id': project.id,
                'title': project.title,
                'description':project.description,
                'subject':project.subject,  
                'duration_hours':project.duration_hours ,
                'price':project.price,
                'complexity':project.complexity,
                'images': [img.url for img in project.images],
                'category': category_name,
                'Project_data': project_data,
                'status': project.status,
                'bookedmarked':project.id in bookmark_ids,
                'author':{
                     'avatar':owner_data.profile_photo,
                     'name':owner_data.full_name,
                     'email':owner_data.email,
                     'username':owner_data.username
                },
                'created_at':project.created_at
                })
                print(result)
        return jsonify({'message':'done','data':result})
    except  Exception:
         print(Exception)



# search any project
@project_bp.route('/searchproject',methods=['GET'])
@firebaseAuthmiddleware
def search_project():
     try:
          user=request.user
          query=request.args.get('search')
          bookmark_projects=Bookmark.query.filter(Bookmark.user_id==user.user_id)
          bookmark_ids={bp.project_id for bp in bookmark_projects}
          projects=Project.query.filter((Project.title.ilike(f'%{query}%')|Project.description.ilike(f'%{query}%')|Project.subject.ilike(f'%{query}%')))
          result=[]
          for project in projects:
                print(project.id)
                category=Category.query.filter_by(id=project.category_id).first()
                owner_data=Users.query.filter_by(user_id=project.user_id).first()
                category_name=category.name if category else None
                if category_name=='SOFTWARE':
                     software_project=SoftwareProject.query.filter_by(project_id=project.id).first()
                     software_data=None
                     print(software_project.id)
                     if software_project:
                          software_data={
                               'readme_verified': software_project.readme_verified,
                                'tech_stack': software_project.tech_stack,
                                'repo_url': software_project.repo_url
                          }
                else:
                     hardware_project=HardwareProject.query.filter_by(project_id=project.id).first()
                     hardware_data=None
                     if hardware_project:
                          hardware_data={
                               'video_url': hardware_project.video_url,
                                'hardware_verified': hardware_project.hardware_verified,
                          }
                project_data=software_data if hardware_data==None else hardware_data
                result.append({
                'project_id': project.id,
                'title': project.title,
                'description':project.description,
                'subject':project.subject,  
                'duration_hours':project.duration_hours ,
                'price':project.price,
                'complexity':project.complexity,
                'images': [img.url for img in project.images],
                'category': category_name,
                'Project_data': project_data,
                'status':project.status,
                'bookedmarked':project.id in bookmark_ids,
                'created_at':project.created_at,
                'author':{
                     'avatar':owner_data.profile_photo,
                     'name':owner_data.full_name,
                     'email':owner_data.email,
                     'username':owner_data.username
                },
                })

          

        #   if len(result)==0:
        #        return jsonify({'messgae':'NO Result Found','data':result}),200
          return jsonify({'data':result,'success':True}),200
          
          print()
     except Exception:
          print(Exception)


# get the details of project by Id
@project_bp.route('/projectdetails/<int:id>', methods=['GET'])
@firebaseAuthmiddleware
def project_details(id):
    try:
        #  print()
         user=request.user 
         project=Project.query.filter_by(id=id).first()
         owner_data=Users.query.filter_by(user_id=project.user_id).first()
         images=project.images
         category_name=Category.query.filter_by(id=project.category_id).first().name
         print(category_name)
         if category_name=='SOFTWARE':
              software_project=SoftwareProject.query.filter_by(project_id=project.id).first()
              project_data={
                               'readme_verified': software_project.readme_verified,
                                'tech_stack': software_project.tech_stack,
                                'repo_url': software_project.repo_url
                          }
         else:
              hardware_project=HardwareProject.query.filter_by(project_id=project.id).first()
              
              project_data={
                               'video_url': hardware_project.video_url,
                                'hardware_verified': hardware_project.hardware_verified,
                          }
              
         if not project:
              return jsonify({'message':'Error at  the  serverd side'}),500
         return jsonify({'message':'Project found successfully','data':{
              
'project_id': project.id,
                'title': project.title,
                'description':project.description,
                'subject':project.subject,  
                'duration_hours':project.duration_hours ,
                'price':project.price,
                'complexity':project.complexity,
                'images': [img.url for img in project.images],
                'category': category_name,
                'Project_data': project_data,
                'status':project.status,
                'created_at':project.created_at,
                'author':{
                     'avatar':owner_data.profile_photo,
                     'name':owner_data.full_name,
                     'email':owner_data.email,
                     'username':owner_data.username
                },
              
              }})
    except Exception:
         print(Exception)
        #  return jsonify({'message': 'done'})








# get the project of the loginedIn user
@project_bp.route('/userprojects',methods=['GET'])
@firebaseAuthmiddleware
def get_project():
    try:
        user_id = request.user.user_id  # Make sure request.user is set by middleware/auth
        projects = Project.query.filter_by(user_id=user_id).all()
        bookmark_projects=Bookmark.query.filter(Bookmark.user_id==user_id)
        bookmark_ids={bp.project_id for bp in bookmark_projects}
        result = []

        for project in projects:
            category = Category.query.get(project.category_id)
            category_name = category.name if category else None
            owner_data=Users.query.filter_by(user_id=project.user_id).first()
            software_data = None
            hardware_data = None

            if category_name == 'SOFTWARE':
                software_project = SoftwareProject.query.filter_by(project_id=project.id).first()
                if software_project:
                    software_data = {
                        'readme_verified': software_project.readme_verified,
                        'tech_stack': software_project.tech_stack,
                        'repo_url': software_project.repo_url
                    }
            else:
                hardware_project = HardwareProject.query.filter_by(project_id=project.id).first()
                if hardware_project:
                    hardware_data = {
                        'video_url': hardware_project.video_url,
                        'hardware_verified': hardware_project.hardware_verified
                    }

            result.append({
                'project_id': project.id,
                'title': project.title,
                'description': project.description,
                'subject': project.subject,
                'duration_hours': project.duration_hours,
                'price': project.price,
                'complexity': project.complexity,
                'images': [img.url for img in project.images],
                'category': category_name,
                'Project_data': software_data if software_data else hardware_data,
                'status':project.status,
                'created_at': project.created_at,
                'author':{
                     'avatar':owner_data.profile_photo,
                     'name':owner_data.full_name,
                     'email':owner_data.email,
                     'username':owner_data.username
                },
                'bookedmarked':project.id in bookmark_ids,
            })

        return jsonify({'message': 'success', 'data': result}), 200

    except Exception as e:
        print("Error in get_project():", e)
        return jsonify({'message': 'Error retrieving projects'}), 500

@project_bp.route('/buyed-project',methods=['GET'])
@firebaseAuthmiddleware
def buyed_project():
    try:
        user=request.user
        buyed_project=db.session.query(Project).join(Payment).filter(Payment.buyer_id==user.user_id,Payment.status=='succeeded').all()
        result=[]
        bookmark_projects=Bookmark.query.filter(Bookmark.user_id==user.user_id)
        bookmark_ids={bp.project_id for bp in bookmark_projects}
        for project in buyed_project:
                print(project.id)
                category=Category.query.filter_by(id=project.category_id).first()
                category_name=category.name if category else None
                owner_data=Users.query.filter_by(user_id=project.user_id).first()
                if category_name=='SOFTWARE':
                     software_project=SoftwareProject.query.filter_by(project_id=project.id).first()
                     software_data=None
                     print(software_project.id)
                     if software_project:
                          software_data={
                               'readme_verified': software_project.readme_verified,
                                'tech_stack': software_project.tech_stack,
                                'repo_url': software_project.repo_url
                          }
                else:
                     hardware_project=HardwareProject.query.filter_by(project_id=project.id).first()
                     hardware_data=None
                     if hardware_project:
                          hardware_data={
                               'video_url': hardware_project.video_url,
                                'hardware_verified': hardware_project.hardware_verified,
                          }
                project_data=software_data if hardware_data==None else hardware_data
                result.append({
                'project_id': project.id,
                'title': project.title,
                'description':project.description,
                'subject':project.subject,  
                'duration_hours':project.duration_hours ,
                'price':project.price,
                'complexity':project.complexity,
                'images': [img.url for img in project.images],
                'category': category_name,
                'Project_data': project_data,
                'created_at':project.created_at,
                'author':{
                     'avatar':owner_data.profile_photo,
                     'name':owner_data.full_name,
                     'email':owner_data.email,
                     'username':owner_data.username
                },
                'bookedmarked':project.id in bookmark_ids,
                })
        return jsonify({'message':'success','data':result}),200
          
    except:
          print("error")
     


@project_bp.route('<int:project_id>/mark-sold',methods=['PUT'])
@firebaseAuthmiddleware
def mark_sold(project_id):
     user=request.user
     project=Project.query.get(project_id)
     project.status='sold'
     db.session.commit()
     return jsonify({'message':'project udpated'}),200



@project_bp.route('/<int:id>',methods=['DELETE'])
@firebaseAuthmiddleware
def delete_project(id):
     project_id=id
     try:
          project=Project.query.get(project_id)
          print(project)
          if not project:
               jsonify({'message':'No project found to delete'}),404
          db.session.delete(project)
          db.session.commit()
          return jsonify({'message':'Project Delete Successfull'}),200
     except Exception as e:
          print(e)
          jsonify({'error':e})

@project_bp.route('/<int:id>',methods=['PUT'])
def edit_project(id):
     project_id=id
     title=request.form.get('title')
     description=request.form.get('description')
     price=request.form.get('price')
     duration_hours=request.form.get('duration_hours')
     try:
          project=Project.query.get(project_id)
          project.title=title
          project.price=price
          project.description=description
          project.duration_hours=duration_hours
          db.session.commit()
          return jsonify({'message':'Project data update succesfully'}),200
     except Exception as e:
          print(e)