from flask import Blueprint

# 'main' adında bir blueprint oluşturuyoruz
bp = Blueprint('main', __name__)

# '/hello' rotasını '/api/hello' olarak buraya taşıyoruz
@bp.route('/hello')
def hello():
    return "Backend çalışıyor!"

# Gelecekte duygu testi (quiz) ve geçmiş (history) endpoint'leri buraya eklenecek