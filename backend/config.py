import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cok-gizli-bir-anahtar-kodu'

    # YENİ EKLENENLER
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'baska-bir-super-gizli-anahtar'
    # ---

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False