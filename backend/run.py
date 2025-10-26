from app import create_app, db
from app.models import User, MoodHistory

app = create_app()

@app.shell_context_processor
def make_shell_context():
    # 'flask shell' komutunu çalıştırdığımızda
    # bu modelleri otomatik olarak import et
    return {'db': db, 'User': User, 'MoodHistory': MoodHistory}