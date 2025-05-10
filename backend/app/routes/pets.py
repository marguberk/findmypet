from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.pet_post import PetPost
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename

pets_bp = Blueprint('pets', __name__)

# Helper function to check if file is allowed
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to save file
def save_file(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        # Return the URL path to access the file
        return f"/static/uploads/{unique_filename}"
    return None

@pets_bp.route('/', methods=['POST'])
@jwt_required()
def create_pet_post():
    current_user_id = get_jwt_identity()
    
    # Handle form data
    data = request.form.to_dict()
    
    # Check if required fields are provided
    required_fields = ['title', 'description', 'pet_type', 'last_seen_address', 'last_seen_date']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
    
    # Process image if provided
    image_url = None
    if 'image' in request.files:
        image_url = save_file(request.files['image'])
    
    # Parse date
    try:
        last_seen_date = datetime.fromisoformat(data['last_seen_date'].replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400
    
    # Create new pet post
    pet_post = PetPost(
        title=data['title'],
        description=data['description'],
        pet_type=data['pet_type'],
        status=data.get('status', 'missing'),
        image_url=image_url,
        last_seen_address=data['last_seen_address'],
        last_seen_date=last_seen_date,
        latitude=float(data['latitude']) if 'latitude' in data and data['latitude'] else None,
        longitude=float(data['longitude']) if 'longitude' in data and data['longitude'] else None,
        user_id=current_user_id
    )
    
    db.session.add(pet_post)
    db.session.commit()
    
    return jsonify({
        'message': 'Pet post created successfully',
        'pet_post': pet_post.to_dict()
    }), 201


@pets_bp.route('/', methods=['GET'])
def get_pet_posts():
    # Get query parameters
    pet_type = request.args.get('pet_type')
    status = request.args.get('status')
    
    # Base query
    query = PetPost.query
    
    # Apply filters if provided
    if pet_type:
        query = query.filter_by(pet_type=pet_type)
    if status:
        query = query.filter_by(status=status)
    
    # Order by created_at descending
    pet_posts = query.order_by(PetPost.created_at.desc()).all()
    
    return jsonify({
        'pet_posts': [post.to_dict() for post in pet_posts]
    }), 200


@pets_bp.route('/<int:post_id>', methods=['GET'])
def get_pet_post(post_id):
    pet_post = PetPost.query.get_or_404(post_id)
    
    return jsonify({
        'pet_post': pet_post.to_dict()
    }), 200


@pets_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_pet_post(post_id):
    current_user_id = get_jwt_identity()
    pet_post = PetPost.query.get_or_404(post_id)
    
    # Check if the user is the owner of the post
    if pet_post.user_id != current_user_id:
        return jsonify({'message': 'You are not authorized to update this post'}), 403
    
    # Handle form data
    data = request.form.to_dict()
    
    # Update fields if provided
    if 'title' in data:
        pet_post.title = data['title']
    if 'description' in data:
        pet_post.description = data['description']
    if 'pet_type' in data:
        pet_post.pet_type = data['pet_type']
    if 'status' in data:
        pet_post.status = data['status']
    if 'last_seen_address' in data:
        pet_post.last_seen_address = data['last_seen_address']
    if 'last_seen_date' in data:
        try:
            pet_post.last_seen_date = datetime.fromisoformat(data['last_seen_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400
    if 'latitude' in data and data['latitude']:
        pet_post.latitude = float(data['latitude'])
    if 'longitude' in data and data['longitude']:
        pet_post.longitude = float(data['longitude'])
    
    # Process image if provided
    if 'image' in request.files:
        image_url = save_file(request.files['image'])
        if image_url:
            pet_post.image_url = image_url
    
    db.session.commit()
    
    return jsonify({
        'message': 'Pet post updated successfully',
        'pet_post': pet_post.to_dict()
    }), 200


@pets_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_pet_post(post_id):
    current_user_id = get_jwt_identity()
    pet_post = PetPost.query.get_or_404(post_id)
    
    # Check if the user is the owner of the post
    if pet_post.user_id != current_user_id:
        return jsonify({'message': 'You are not authorized to delete this post'}), 403
    
    db.session.delete(pet_post)
    db.session.commit()
    
    return jsonify({
        'message': 'Pet post deleted successfully'
    }), 200


@pets_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_pet_posts():
    current_user_id = get_jwt_identity()
    
    pet_posts = PetPost.query.filter_by(user_id=current_user_id).order_by(PetPost.created_at.desc()).all()
    
    return jsonify({
        'pet_posts': [post.to_dict() for post in pet_posts]
    }), 200 