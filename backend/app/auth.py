from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from flask_jwt_extended import create_access_token
import datetime
import sqlalchemy

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "E-posta ve şifre gereklidir"}), 400

        user = User.query.filter_by(email=email).first()

        if user is None or not user.password_hash or not user.check_password(password):
            return jsonify({"error": "Geçersiz e-posta veya şifre"}), 401

        expires = datetime.timedelta(days=7)
        access_token = create_access_token(
            identity=str(user.id), 
            expires_delta=expires
        )
        
        return jsonify(access_token=access_token)

    except Exception as e:
        print(f"GİRİŞ GENEL HATA: {e}")
        return jsonify({"error": f"Bilinmeyen bir hata oluştu: {str(e)}"}), 500

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"error": "Eksik bilgi: Kullanıcı adı, e-posta ve şifre gereklidir"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Bu kullanıcı adı zaten alınmış"}), 409
        
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Bu e-posta adresi zaten kullanılıyor"}), 409

        new_user = User(
            username=username, 
            email=email,
            google_id=None 
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Kullanıcı başarıyla kaydedildi"}), 201

    except sqlalchemy.exc.IntegrityError as e:
        db.session.rollback()
        print(f"KAYIT VERİTABANI HATA: {e}")
        return jsonify({"error": "Veritabanı hatası: Kullanıcı adı veya e-posta çakışması"}), 409
    except Exception as e:
        db.session.rollback()
        print(f"KAYIT GENEL HATA: {e}")
        return jsonify({"error": f"Bilinmeyen bir hata oluştu: {str(e)}"}), 500

@bp.route('/google/verify', methods=['POST'])
def verify_google_token():
    token = request.json.get('credential')
    if not token:
        return jsonify({"error": "No token provided"}), 400

    client_id = current_app.config['GOOGLE_CLIENT_ID']
    if not client_id:
            return jsonify({"error": "Server configuration error"}), 500

    try:
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            client_id
        )

        google_id = idinfo['sub']
        email = idinfo['email']
        username = idinfo.get('name') or idinfo.get('given_name')

        user = User.query.filter_by(google_id=google_id).first()

        if not user:
            user = User.query.filter_by(email=email).first()
            if user:
                user.google_id = google_id
            else:
                # 'UNIQUE constraint' hatasını düzelten blok
                if User.query.filter_by(username=username).first() is None:
                    final_username = username
                else:
                    email_prefix = email.split('@')[0]
                    if User.query.filter_by(username=email_prefix).first() is None:
                        final_username = email_prefix
                    else:
                        original_username = email_prefix
                        counter = 1
                        final_username = f"{original_username}{counter}"
                        while User.query.filter_by(username=final_username).first():
                            counter += 1
                            final_username = f"{original_username}{counter}"

                user = User(
                    google_id=google_id,
                    email=email,
                    username=final_username
                )
                db.session.add(user)

        db.session.commit()

        expires = datetime.timedelta(days=7)
        access_token = create_access_token(
            identity=str(user.id), 
            expires_delta=expires
        )

        return jsonify(access_token=access_token)

    except ValueError as e:
        return jsonify({"error": "Invalid token", "details": str(e)}), 401
    
    except sqlalchemy.exc.IntegrityError as e:
        db.session.rollback()
        print(f"GOOGLE GİRİŞ VERİTABANI HATA: {e}")
        return jsonify({"error": "Veritabanı bütünlük hatası. Kullanıcı adı veya e-posta zaten mevcut olabilir."}), 500
    
    except Exception as e:
        db.session.rollback()
        print(f"GOOGLE GİRİŞ GENEL HATA: {e}")
        return jsonify({"error": f"Bilinmeyen bir hata oluştu: {str(e)}"}), 500