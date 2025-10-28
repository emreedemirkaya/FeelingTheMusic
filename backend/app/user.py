from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('user', __name__)

@bp.route('/preference', methods=['POST'])
@jwt_required()
def update_preference():
    """
    Kullanıcının müzik tercihini (local, foreign, mixed) günceller.
    """
    current_user_id_str = get_jwt_identity()
    user = User.query.get(int(current_user_id_str))

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    new_preference = data.get('preference')

    if new_preference not in ['local', 'foreign', 'mixed']:
        return jsonify({"error": "Invalid preference value"}), 400

    try:
        user.music_preference = new_preference
        db.session.commit()
        return jsonify({
            "message": "Preference updated", 
            "new_preference": user.music_preference
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/preference', methods=['GET'])
@jwt_required()
def get_preference():
    """
    Kullanıcının mevcut müzik tercihini döndürür.
    """
    current_user_id_str = get_jwt_identity()
    user = User.query.get(int(current_user_id_str))

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"preference": user.music_preference}), 200