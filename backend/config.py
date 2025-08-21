import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret")

    GITHUB_CLIENT_ID = os.environ.get('CLIENT_ID')
    GITHUB_CLIENT_SECRET = os.environ.get('CLIENT_SECRET_ID')
    CLOUD_NAME = os.environ.get('CLOUD_NAME')
    CLOUD_API_KEY = os.environ.get('CLOUD_API_KEY')
    CLOUD_API_SECRET = os.environ.get('CLOUD_API_SECRET')
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    STRIPE_API = os.environ.get('STRIPE_API')


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///projecthub.db"


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {"sslmode": "require"}
    }
