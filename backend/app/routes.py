from flask import Blueprint

bp = Blueprint('main', __name__)


@bp.route('/hello')
def hello():
    return "Backend çalışıyor!"
