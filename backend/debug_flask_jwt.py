import sys
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

# Настраиваем логирование
import logging
logging.basicConfig(level=logging.DEBUG)

# Создаем тестовое приложение
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'test-key'
app.config['JWT_ERROR_MESSAGE_KEY'] = 'message'  # Устанавливаем ключ для сообщений об ошибках
jwt = JWTManager(app)

# Обработчик ошибки неверного токена
@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    logging.error(f"Invalid token error: {error_string}")
    return jsonify({"message": error_string}), 422

# Обработчик JWT ошибок
@jwt.unauthorized_loader
def unauthorized_loader_callback(error_string):
    logging.error(f"Unauthorized: {error_string}")
    return jsonify({"message": error_string}), 401

# Тестовый маршрут
@app.route('/test', methods=['POST'])
@jwt_required()
def test_route():
    current_user_id = get_jwt_identity()
    logging.info(f"User identity: {current_user_id}")
    data = request.get_json() or {}
    logging.info(f"Request data: {data}")
    return jsonify({"message": "Success", "user_id": current_user_id}), 200

# Маршрут для создания токена
@app.route('/token', methods=['POST'])
def create_token():
    user_id = request.json.get('user_id', 1)
    token = create_access_token(identity=user_id)
    return jsonify({"token": token}), 200

if __name__ == '__main__':
    logging.info("Starting test server for JWT debugging")
    app.run(debug=True, port=5005) 