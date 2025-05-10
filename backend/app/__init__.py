from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from config import get_config

# Initialize SQLAlchemy instance
db = SQLAlchemy()

# Initialize JWT
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

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
