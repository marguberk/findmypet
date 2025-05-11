from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from config import get_config

# Try to import CORS with error handling
try:
    from flask_cors import CORS
    cors_available = True
except ImportError:
    print("WARNING: flask_cors not available, CORS will not be enabled")
    cors_available = False

from flask_jwt_extended import JWTManager

# Initialize SQLAlchemy instance
db = SQLAlchemy()

# Initialize JWT
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())
    
    # Настройка параметров JWT
    app.config['JWT_ERROR_MESSAGE_KEY'] = 'message'
    app.config['JWT_IDENTITY_CLAIM'] = 'sub'
    app.config['JWT_JSON_KEY'] = 'access_token'  # По умолчанию - 'access_token'
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Установка обработчиков ошибок JWT
    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        import logging
        logging.error(f"Invalid token error: {error_string}")
        return jsonify({"message": error_string}), 422
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        logging.error(f"Expired token: header={jwt_header}, payload={jwt_payload}")
        return jsonify({"message": "Token has expired"}), 401
    
    @jwt.unauthorized_loader
    def unauthorized_loader_callback(error_string):
        logging.error(f"Unauthorized: {error_string}")
        return jsonify({"message": "Missing or invalid Authorization header"}), 401
    
    @jwt.needs_fresh_token_loader
    def needs_fresh_token_callback(jwt_header, jwt_payload):
        logging.error(f"Needs fresh token: header={jwt_header}, payload={jwt_payload}")
        return jsonify({"message": "Fresh token required"}), 401
    
    # Enable CORS if available
    if cors_available:
        cors = CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
        print("CORS has been enabled with extended settings")
    else:
        print("WARNING: Running without CORS support")

    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.pets import pets_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(pets_bp, url_prefix='/api/pets')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app
