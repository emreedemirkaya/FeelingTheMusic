from app.extensions import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    
    google_id = db.Column(db.String(120), unique=True, index=True, nullable=True)

    mood_history = db.relationship('MoodHistory', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.username}>'

class MoodHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    
    mood_data = db.Column(db.JSON, nullable=False)
    
    suggested_playlist = db.Column(db.String(500))
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<MoodHistory {self.id} for User {self.user_id}>'