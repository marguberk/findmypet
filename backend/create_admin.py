from app import create_app, db
from app.models.user import User
from sqlalchemy import inspect

app = create_app()
with app.app_context():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print('Tables:', tables)
    
    # Создаем таблицы, если их нет
    db.create_all()
    
    # Проверяем, есть ли уже пользователь с таким email
    admin = User.query.filter_by(email='admin@example.com').first()
    if not admin:
        admin = User(username='admin', email='admin@example.com')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print('Admin user created')
    else:
        print('Admin user already exists')
