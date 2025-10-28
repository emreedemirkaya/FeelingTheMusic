from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from flask_jwt_extended import create_access_token
import datetime


bp = Blueprint('auth', __name__)

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
                user = User(
                    google_id=google_id,
                    email=email,
                    username=username 
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