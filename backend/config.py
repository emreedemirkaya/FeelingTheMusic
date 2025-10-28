import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cok-gizli-bir-anahtar-kodu'

    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'baska-bir-super-gizli-anahtar'

    SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')
    

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False