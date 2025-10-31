from app.extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)
    
    google_id = db.Column(db.String(120), unique=True, index=True, nullable=True)

    mood_history = db.relationship('MoodHistory', backref='user', lazy='dynamic')
    
    music_preference = db.Column(db.String(20), nullable=False, default='mixed')

    
    def set_password(self, password):
        """Düz metin şifreyi alır ve hash'lenmiş halini kaydeder."""
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        """Kaydedilmiş hash ile gönderilen şifreyi karşılaştırır."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

# MoodHistory modeli
class MoodHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    mood_data = db.Column(db.JSON, nullable=False)
    suggested_playlist = db.Column(db.String(500), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<MoodHistory {self.id} for User {self.user_id}>'