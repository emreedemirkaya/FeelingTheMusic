from flask import Flask
from config import Config
from app.extensions import db, migrate, cors, jwt # jwt eklendi

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Eklentileri uygulamaya bağlıyoruz
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, origins="http://localhost:3000") # Adım 4'te güncellenmişti
    jwt.init_app(app) # YENİ

    # Blueprint'leri (route grupları) kaydediyoruz
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.routes import bp as main_bp
    app.register_blueprint(main_bp, url_prefix='/api') # Rotalar /api/.. olacak

    # Eski '/hello' rotasını sil
    # @app.route('/hello') ... bloğu buradan kaldırıldı.

    return app