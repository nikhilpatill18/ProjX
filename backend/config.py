import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GITHUB_CLIENT_ID = os.environ.get('CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.environ.get('CLIENT_SECRET_ID')
    CLOUD_NAME=os.environ.get('CLOUD_NAME')
    CLOUD_API_KEY=os.environ.get('CLOUD_API_KEY')
    CLOUD_API_SECRET=os.environ.get('CLOUD_API_SECRET')
    GEMINI_API_KEY=os.environ.get('GEMINI_API_KEY')