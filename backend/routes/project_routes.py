from models import db
# from models import users
from flask import request,make_response,jsonify,current_app,Blueprint
from flask_bcrypt import Bcrypt
import cloudinary
import cloudinary.uploader
import datetime
from functools import wraps
from routes.auth_routes import authMiddleware
import google.generativeai as genai
import requests
import base64
import json
project_bp=Blueprint('/api/projects',__name__)
cloudinary.config(
    cloud_name= 'dwg1z2iih',
    api_key= '886927352398459',
    api_secret= '3PGTVBNx3qQ51x0T7VexbEGVJdU'
)
genai.configure(api_key="AIzaSyC71GPRUDdZHAvA0nM9192UZgIwP7zGTV4")
model=genai.GenerativeModel('gemini-1.5-pro')


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



@project_bp.route('/anayze-repo',methods=['POST'])
@authMiddleware
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

        return jsonify({'isvalid':is_valid,'analysis':analyze})
     except Exception:
          print(Exception)



@project_bp.route('/add-project',methods=['POST'])
@authMiddleware
def add_project():
    print('hi')
    try:
        user=request.user
        title=request.form.get('tittle')
        description=request.form.get('description')
        category=request.files.get('category')
        subject=request.form.get('subject')
        price=request.form.get('price')
        complexity=request.form.get('complexity')
        time=request.form.get('time')
        images=request.files.get('images')
        url=request.files.get('url')
        if category=='SOFTWARE'  or category=='IOT':
                github_username=user.github_username
                verified=user.verified
                if not verified:
                    return jsonify({'message':'please verify the github first'}),401
        


    except Exception as e:
        print(e)
    return jsonify({'message':'work'})
    