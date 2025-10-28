from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import MoodHistory 
from flask_jwt_extended import jwt_required, get_jwt_identity
import datetime
import json  

bp = Blueprint('quiz', __name__)

@bp.route('/save_results', methods=['POST'])
@jwt_required() 
def save_results():
    
    current_user_id = get_jwt_identity()
    
    
    mood_data = request.get_json()
    
    if not mood_data:
        return jsonify({"error": "No mood data provided"}), 400

    try:
        
        new_history_entry = MoodHistory(
            user_id=current_user_id,
            mood_data=mood_data
            
        )
        
   
        db.session.add(new_history_entry)
        db.session.commit()
        
        return jsonify({"message": "Quiz results saved successfully"}), 201
    
    except Exception as e:
        db.session.rollback() 
        return jsonify({"error": str(e)}), 500

@bp.route('/get_history', methods=['GET'])
@jwt_required() 
def get_history():
    current_user_id = get_jwt_identity()
    
    try:
        history = MoodHistory.query.filter_by(user_id=current_user_id).order_by(MoodHistory.timestamp.desc()).all()
        results = []
        for entry in history:
            
            mood_data_object = entry.mood_data
            if isinstance(mood_data_object, str):
                mood_data_object = json.loads(mood_data_object)
                
            results.append({
                "id": entry.id,
                "timestamp": entry.timestamp.isoformat(), 
                "mood_data": mood_data_object 
            })
        
        return jsonify(results), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500