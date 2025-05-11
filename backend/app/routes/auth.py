from flask import Blueprint, request, jsonify
from app import db, jwt
from app.models.user import User
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if required fields are provided
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User with this email already exists'}), 409
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 409
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        phone=data.get('phone')
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Generate access token
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check if required fields are provided
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Generate access token
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    print(f"JWT identity received: {current_user_id}, type: {type(current_user_id)}")
    
    try:
        # Check if the identifier is a string
        if not isinstance(current_user_id, str):
            print(f"User ID is not a string: {type(current_user_id)}")
            return jsonify({'message': 'User ID must be a string'}), 400
            
        # Check if the string represents a number
        if not current_user_id.isdigit():
            print(f"User ID is not a number: {current_user_id}")
            return jsonify({'message': 'User ID must be a number'}), 400
            
        # Convert to integer
        current_user_id = int(current_user_id)
    except (ValueError, TypeError, AttributeError) as e:
        print(f"Error processing user ID ({current_user_id}): {e}")
        return jsonify({'message': f'Invalid user ID format: {e}'}), 400
        
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200 