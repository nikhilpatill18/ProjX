import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GITHUB_CLIENT_ID = os.environ.get('CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.environ.get('CLIENT_SECRET_ID')