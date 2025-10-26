from app.extensions import db
from datetime import datetime

# Kullanıcı veritabanı modeli
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(256)) # Şifreyi asla düz metin olarak saklamayacağız
    
    # Google ile giriş yapanlar için Google ID'si
    google_id = db.Column(db.String(120), unique=True, index=True, nullable=True)

    # Bir kullanıcının birden fazla duygu geçmişi olabilir
    mood_history = db.relationship('MoodHistory', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.username}>'

# Duygu Geçmişi veritabanı modeli
class MoodHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    
    # Yüzdesel grafik verilerini JSON olarak saklayabiliriz
    # Örn: {"happy": 80, "sad": 10, "calm": 10}
    mood_data = db.Column(db.JSON, nullable=False)
    
    # Önerilen müzik listesi (belki playlist linki veya ID'leri)
    suggested_playlist = db.Column(db.String(500))
    
    # Hangi kullanıcıya ait olduğu
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<MoodHistory {self.id} for User {self.user_id}>'