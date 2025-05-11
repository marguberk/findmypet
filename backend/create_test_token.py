from app import create_app
from flask_jwt_extended import create_access_token

app = create_app()

with app.app_context():
    # Создаем токен со строковым идентификатором
    token = create_access_token(identity='test')
    print(f'Тестовый токен: {token}')
    
    # Создаем токен с числовым идентификатором, преобразованным в строку
    token2 = create_access_token(identity=str(123))
    print(f'Токен с числовым ID: {token2}') 