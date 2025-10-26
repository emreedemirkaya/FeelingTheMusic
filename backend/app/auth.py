from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from flask_jwt_extended import create_access_token
import datetime

# 'auth' adında yeni bir blueprint oluşturuyoruz
bp = Blueprint('auth', __name__)

@bp.route('/google/verify', methods=['POST'])
def verify_google_token():
    # 1. React'tan gelen Google ID Token'ını al
    token = request.json.get('credential')
    if not token:
        return jsonify({"error": "No token provided"}), 400

    client_id = current_app.config['GOOGLE_CLIENT_ID']
    if not client_id:
            return jsonify({"error": "Server configuration error"}), 500

    try:
        # 2. Token'ı Google sunucularında doğrula
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            client_id
        )

        # 3. Kullanıcı bilgilerini al
        google_id = idinfo['sub']
        email = idinfo['email']
        username = idinfo.get('name') or idinfo.get('given_name')

        # 4. Veritabanında kullanıcıyı ara (Google ID ile)
        user = User.query.filter_by(google_id=google_id).first()

        if not user:
            # Kullanıcı yoksa, e-posta ile ara (belki daha önce başka yolla kayıt oldu)
            user = User.query.filter_by(email=email).first()
            if user:
                # E-posta varsa, Google ID'sini güncelle
                user.google_id = google_id
            else:
                # Kullanıcı hiç yoksa, yeni kullanıcı oluştur
                user = User(
                    google_id=google_id,
                    email=email,
                    username=username 
                )
                db.session.add(user)

        db.session.commit()

        # 5. Kendi uygulamamız için bir JWT (Giriş Token'ı) oluştur
        expires = datetime.timedelta(days=7)
        access_token = create_access_token(
            identity=user.id, 
            expires_delta=expires
        )

        # Bu token'ı React'a geri gönder
        return jsonify(access_token=access_token)

    except ValueError as e:
        # Token geçersizse
        return jsonify({"error": "Invalid token", "details": str(e)}), 401