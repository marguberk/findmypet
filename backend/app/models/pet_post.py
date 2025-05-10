from app import db
from datetime import datetime

class PetPost(db.Model):
    __tablename__ = 'pet_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    pet_type = db.Column(db.String(20), nullable=False)  # 'cat', 'dog', etc.
    status = db.Column(db.String(20), default='missing')  # 'missing' or 'found'
    image_url = db.Column(db.String(255), nullable=True)
    last_seen_address = db.Column(db.String(255), nullable=False)
    last_seen_date = db.Column(db.DateTime, nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def __init__(self, title, description, pet_type, last_seen_address, 
                 last_seen_date, user_id, status='missing', 
                 image_url=None, latitude=None, longitude=None):
        self.title = title
        self.description = description
        self.pet_type = pet_type
        self.status = status
        self.image_url = image_url
        self.last_seen_address = last_seen_address
        self.last_seen_date = last_seen_date
        self.latitude = latitude
        self.longitude = longitude
        self.user_id = user_id
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'pet_type': self.pet_type,
            'status': self.status,
            'image_url': self.image_url,
            'last_seen_address': self.last_seen_address,
            'last_seen_date': self.last_seen_date.isoformat() if self.last_seen_date else None,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id
        } 