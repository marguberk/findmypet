from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.pet_post import PetPost
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename
import logging
import json
import sys

pets_bp = Blueprint('pets', __name__)

# Настройка логирования
logger = logging.getLogger("pets_api")
logger.setLevel(logging.DEBUG)
# Добавляем вывод в консоль
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

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

# Helper to validate form data
def validate_pet_data(data):
    errors = []
    
    # Обработка subject -> title преобразования
    if 'subject' in data and 'title' not in data:
        try:
            data['title'] = str(data['subject'])
            logger.info(f"Converted subject to title: {data['title']}")
        except Exception as e:
            logger.error(f"Failed to convert subject to string: {e}")
            errors.append("subject must be a string")
    
    # Специальная проверка для subject, если оно есть
    if 'subject' in data and not isinstance(data['subject'], str):
        try:
            data['subject'] = str(data['subject'])
            logger.info(f"Converted subject to string: {data['subject']}")
        except Exception as e:
            logger.error(f"Failed to convert subject to string: {e}")
            errors.append("subject must be a string")
    
    # Validate required fields
    required_fields = ['title', 'description', 'pet_type', 'last_seen_address', 'last_seen_date']
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"{field} is required")
    
    # Validate title is a string
    if 'title' in data:
        if not isinstance(data['title'], str):
            errors.append("title must be a string")
            # Попытка преобразования title в строку
            try:
                data['title'] = str(data['title'])
                logger.info(f"Converted title to string: {data['title']}")
            except Exception as e:
                logger.error(f"Failed to convert title to string: {e}")
    
    # Validate pet_type
    valid_pet_types = ['cat', 'dog', 'bird', 'other']
    if 'pet_type' in data and data['pet_type'] not in valid_pet_types:
        errors.append(f"pet_type must be one of: {', '.join(valid_pet_types)}")
    
    # Validate status
    valid_statuses = ['missing', 'found']
    if 'status' in data and data['status'] not in valid_statuses:
        errors.append(f"status must be one of: {', '.join(valid_statuses)}")
    
    # Validate coordinates if present
    if 'latitude' in data and data['latitude']:
        try:
            float(data['latitude'])
        except (ValueError, TypeError):
            errors.append("latitude must be a valid number")
    
    if 'longitude' in data and data['longitude']:
        try:
            float(data['longitude'])
        except (ValueError, TypeError):
            errors.append("longitude must be a valid number")
    
    return errors

@pets_bp.route('/', methods=['POST'])
@jwt_required()
def create_pet_post():
    current_user_id = get_jwt_identity()
    logger.info(f"JWT identity received: {current_user_id}, type: {type(current_user_id)}")
    
    try:
        # Check if the identifier is a string
        if not isinstance(current_user_id, str):
            logger.error(f"User ID is not a string: {type(current_user_id)}")
            return jsonify({"message": "User ID must be a string"}), 400
            
        # Check if the string represents a number
        if not current_user_id.isdigit():
            logger.error(f"User ID is not a number: {current_user_id}")
            return jsonify({"message": "User ID must be a number"}), 400
            
        # Convert to integer
        current_user_id = int(current_user_id)
    except (ValueError, TypeError, AttributeError) as e:
        logger.error(f"Error processing user ID ({current_user_id}): {e}")
        return jsonify({"message": f"Invalid user ID format: {e}"}), 400
        
    logger.info(f"Creating pet post for user: {current_user_id}")
    
    # Log request information
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Request form data: {request.form}")
    logger.info(f"Request files: {request.files}")
    
    # Handle form data
    data = request.form.to_dict()
    logger.info(f"Parsed form data: {data}")
    
    # Добавляем расширенное логирование для отладки JWT ошибок
    logger.info(f"JWT Identity: {current_user_id}, Type: {type(current_user_id)}")
    try:
        logger.info(f"JWT Config: {current_app.config.get('JWT_ERROR_MESSAGE_KEY', 'No JWT_ERROR_MESSAGE_KEY found')}")
    except Exception as e:
        logger.error(f"Error checking JWT config: {e}")
    
    # Специальная проверка для поля title
    # Проблема может быть в том, что форма передаёт title не как строку
    if 'title' in data:
        try:
            # Принудительно преобразуем title в строку
            title_value = data['title']
            str_title = str(title_value)
            data['title'] = str_title
            logger.info(f"Title field processed: '{data['title']}', Type: {type(data['title'])}")
        except Exception as e:
            logger.error(f"Error processing title field: {e}")
            # Если title нельзя преобразовать в строку - создаём пустую строку
            data['title'] = ""
    elif 'subject' in data:
        # Если передано поле subject, используем его как title
        try:
            subject_value = data['subject']
            str_subject = str(subject_value)
            data['title'] = str_subject
            logger.info(f"Subject field used as title: '{data['title']}', Type: {type(data['title'])}")
        except Exception as e:
            logger.error(f"Error processing subject field: {e}")
            data['title'] = ""
    else:
        logger.warning("Neither title nor subject field found in data")
    
    # Quick debug check for the title field
    if 'title' in data:
        logger.info(f"Title field: '{data['title']}', Type: {type(data['title'])}")
    else:
        logger.warning("Title field missing from data")
    
    # Validate the data
    validation_errors = validate_pet_data(data)
    if validation_errors:
        error_msg = f"Validation errors: {', '.join(validation_errors)}"
        logger.error(f"Error: {error_msg}")
        return jsonify({
            'message': error_msg,
            'errors': validation_errors
        }), 400
    
    # Process image if provided
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        logger.info(f"Image file: {file.filename}, Content type: {file.content_type}")
        image_url = save_file(file)
        if image_url:
            logger.info(f"Image saved successfully: {image_url}")
        else:
            logger.warning("Failed to save image, might be an invalid format")
    else:
        logger.info("No image file in request")
    
    # Parse date
    try:
        logger.info(f"Parsing date: {data['last_seen_date']}")
        last_seen_date = datetime.fromisoformat(data['last_seen_date'].replace('Z', '+00:00'))
        logger.info(f"Parsed date: {last_seen_date}")
    except ValueError as e:
        error_msg = f"Invalid date format: {str(e)}"
        logger.error(f"Error: {error_msg}")
        return jsonify({'message': error_msg}), 400
    
    # Parse location coordinates
    latitude = None
    longitude = None
    try:
        if 'latitude' in data and data['latitude']:
            latitude = float(data['latitude'])
            logger.info(f"Parsed latitude: {latitude}")
        if 'longitude' in data and data['longitude']:
            longitude = float(data['longitude'])
            logger.info(f"Parsed longitude: {longitude}")
    except ValueError as e:
        error_msg = f"Invalid coordinate format: {str(e)}"
        logger.error(f"Error: {error_msg}")
        return jsonify({'message': error_msg}), 400
    
    # Create new pet post
    try:
        # Создаем словарь с данными для отладки
        pet_data = {
            'title': data['title'],
            'description': data['description'],
            'pet_type': data['pet_type'],
            'status': data.get('status', 'missing'),
            'image_url': image_url,
            'last_seen_address': data['last_seen_address'],
            'last_seen_date': last_seen_date,
            'latitude': latitude,
            'longitude': longitude,
            'user_id': current_user_id
        }
        
        logger.info(f"Creating new PetPost instance with data: {pet_data}")
        
        # Выводим типы данных для отладки
        type_info = {key: str(type(value)) for key, value in pet_data.items()}
        logger.info(f"Data types: {type_info}")
        
        pet_post = PetPost(
            title=data['title'],
            description=data['description'],
            pet_type=data['pet_type'],
            status=data.get('status', 'missing'),
            image_url=image_url,
            last_seen_address=data['last_seen_address'],
            last_seen_date=last_seen_date,
            latitude=latitude,
            longitude=longitude,
            user_id=current_user_id
        )
        
        db.session.add(pet_post)
        db.session.commit()
        
        logger.info(f"Pet post created successfully with ID: {pet_post.id}")
        return jsonify({
            'message': 'Pet post created successfully',
            'pet_post': pet_post.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        error_msg = f"Database error: {str(e)}"
        logger.error(f"Error: {error_msg}")
        logger.exception("Exception details")
        return jsonify({'message': error_msg}), 422


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
    logger.info(f"Получен JWT identity: {current_user_id}, тип: {type(current_user_id)}")
    
    try:
        # Проверяем, что идентификатор - это строка
        if not isinstance(current_user_id, str):
            logger.error(f"ID пользователя не строка: {type(current_user_id)}")
            return jsonify({"message": "ID пользователя должен быть строкой"}), 400
            
        # Проверяем, что строка представляет число
        if not current_user_id.isdigit():
            logger.error(f"ID пользователя не является числом: {current_user_id}")
            return jsonify({"message": "ID пользователя должен быть числом"}), 400
            
        # Преобразуем в целое число
        current_user_id = int(current_user_id)
    except (ValueError, TypeError, AttributeError) as e:
        logger.error(f"Ошибка при обработке ID пользователя ({current_user_id}): {e}")
        return jsonify({"message": f"Неверный формат ID пользователя: {e}"}), 400
        
    pet_post = PetPost.query.get_or_404(post_id)
    
    # Check if the user is the owner of the post
    if pet_post.user_id != current_user_id:
        return jsonify({'message': 'You are not authorized to update this post'}), 403
    
    # Handle form data
    data = request.form.to_dict()
    
    # Validate the update data
    validation_errors = validate_pet_data({**pet_post.to_dict(), **data})
    if validation_errors:
        error_msg = f"Validation errors: {', '.join(validation_errors)}"
        return jsonify({
            'message': error_msg,
            'errors': validation_errors
        }), 400
    
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
    logger.info(f"Получен JWT identity: {current_user_id}, тип: {type(current_user_id)}")
    
    try:
        # Проверяем, что идентификатор - это строка
        if not isinstance(current_user_id, str):
            logger.error(f"ID пользователя не строка: {type(current_user_id)}")
            return jsonify({"message": "ID пользователя должен быть строкой"}), 400
            
        # Проверяем, что строка представляет число
        if not current_user_id.isdigit():
            logger.error(f"ID пользователя не является числом: {current_user_id}")
            return jsonify({"message": "ID пользователя должен быть числом"}), 400
            
        # Преобразуем в целое число
        current_user_id = int(current_user_id)
    except (ValueError, TypeError, AttributeError) as e:
        logger.error(f"Ошибка при обработке ID пользователя ({current_user_id}): {e}")
        return jsonify({"message": f"Неверный формат ID пользователя: {e}"}), 400
        
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
    logger.info(f"Получен JWT identity: {current_user_id}, тип: {type(current_user_id)}")
    
    try:
        # Проверяем, что идентификатор - это строка
        if not isinstance(current_user_id, str):
            logger.error(f"ID пользователя не строка: {type(current_user_id)}")
            return jsonify({"message": "ID пользователя должен быть строкой"}), 400
            
        # Проверяем, что строка представляет число
        if not current_user_id.isdigit():
            logger.error(f"ID пользователя не является числом: {current_user_id}")
            return jsonify({"message": "ID пользователя должен быть числом"}), 400
            
        # Преобразуем в целое число
        current_user_id = int(current_user_id)
    except (ValueError, TypeError, AttributeError) as e:
        logger.error(f"Ошибка при обработке ID пользователя ({current_user_id}): {e}")
        return jsonify({"message": f"Неверный формат ID пользователя: {e}"}), 400
        
    pet_posts = PetPost.query.filter_by(user_id=current_user_id).order_by(PetPost.created_at.desc()).all()
    
    return jsonify({
        'pet_posts': [post.to_dict() for post in pet_posts]
    }), 200 