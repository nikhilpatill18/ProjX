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
project_bp=Blueprint('/api/projects',__name__)
cloudinary.config(
    cloud_name= 'dwg1z2iih',
    api_key= '886927352398459',
    api_secret= '3PGTVBNx3qQ51x0T7VexbEGVJdU'
)
genai.configure(api_key="AIzaSyC71GPRUDdZHAvA0nM9192UZgIwP7zGTV4")
model=genai.GenerativeModel('gemini-1.5-pro')
vision_model=genai.GenerativeModel('gemini-1.5-pro-vision')


# model to anayize the readme.file
def analyze_readme(readme_text):
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

    try:
        json_data = json.loads(text)
    except json.JSONDecodeError:
        json_data = {"error": "Failed to parse Gemini response", "raw": text}

    return json_data

# model to analyze the hardware
def verify_hardware_images(image_files):
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
          images=request.files.getlist('hardware_image')
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
        repo_url=request.get_json()['url']
        if not repo_url:
               jsonify({'message':'Please enter the url'}),404
        print(repo_url.rstrip('/').split('/'))
        repo_name=repo_url.rstrip('/').split('/')[-1]
        repo_api_url=f"https://api.github.com/repos/{'nikhilpatill18'}/{repo_name}"
        repo_response=requests.get(repo_api_url)
        print(repo_response)
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
        category_obj=Category.query.filter(category==category).first()
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
            project=Project(title=title,description =description,price=price,complexity=complexity,duration_hours=duration_hours,user_id=userID,category_id=cat_id,subject=subject)
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
                'software': {
                    'readme_verified': software_project.readme_verified,
                    'tech_stack': software_project.tech_stack,
                    'repo_url': software_project.repo_url
                },
                'images': image_urls
            }})
        


    except Exception as e:
        print(e)
        return jsonify({'message':'error in adding project'}),500
    

@project_bp.route('/getproject', methods=['GET'])
def getProject():
    try:
          projects=Project.query.all()
          result=[]
          for project in projects:
                print(project.id)
                category=Category.query.filter_by(id=project.category_id).first()
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
                result.append({
                'project_id': project.id,
                'title': project.title,
                'images': [img.url for img in project.images],
                'category': category_name,
                'Project_data': hardware_data if software_data==None else software_data
                # 'software': software_data,
                # # 'Hardware':hardware_data
                })
                print(result)
                     
    
          return jsonify({'message':'done','data':result})
    except  Exception:
         print(Exception)


@project_bp.route('/searchproject',methods=['GET'])
@firebaseAuthmiddleware
def search_project():
     try:
          query=request.args.get('search')
          projects=Project.query.filter((Project.title.ilike(f'%{query}%')|Project.description.ilike(f'%{query}%')|Project.subject.ilike(f'%{query}%')))
          result=[]
          for project in projects:
                print(project.id)
                category=Category.query.filter_by(id=project.category_id).first()
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
                result.append({
                'project_id': project.id,
                'title': project.title,
                'images': [img.url for img in project.images],
                'category': category_name,
                'Project_data': hardware_data if software_data==None else software_data
                })

          

          if len(result)==0:
               return jsonify({'messgae':'NO Result Found'},404)
          return jsonify({'data':result,'success':True}),200
          
          print()
     except Exception:
          print(Exception)

@project_bp.route('/projectdetails/<int:id>', methods=['GET'])
@firebaseAuthmiddleware
def project_details(id):
    try:
        #  print()
         
         project=Project.query.filter_by(id=id).first()
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
         return jsonify({'message':'Project found successfully','data':{'project_id':project.id,'title':project.title,'images':[img.url for img in images],'project_data':project_data}})
    except Exception:
         print(Exception)
        #  return jsonify({'message': 'done'})



