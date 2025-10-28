from flask import Flask
from config import Config
from app.extensions import db, migrate, cors, jwt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        origins="http://localhost:3000",
        allow_headers=["Content-Type", "Authorization"], 
        supports_credentials=True
        )
    jwt.init_app(app)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.routes import bp as main_bp
    app.register_blueprint(main_bp, url_prefix='/api') 

    from app.quiz import bp as quiz_bp
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')

    return app