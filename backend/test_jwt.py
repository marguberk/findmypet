from app import jwt, create_app
from flask_jwt_extended import decode_token, create_access_token

app = create_app()

def test_jwt():
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjkyMzY3MSwianRpIjoiZDI3Mjg4NGUtMDA1MC00YzkyLTk3OGQtNmI1ZmVkZWJmZTFhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzQ2OTIzNjcxLCJleHAiOjE3NDcwMTAwNzF9.If8Fp0S7Tw94wZFk0iByrwduMEkE3xa6zkxuBnH_pig'
    
    with app.app_context():
        try:
            decoded = decode_token(token)
            print("Decoded token:", decoded)
            print("Identity:", decoded.get('sub'))
            return True
        except Exception as e:
            print(f"Error decoding token: {e}")
            
            # Create a new token with string identity
            print("Creating a new token with string identity...")
            new_token = create_access_token(identity="2")  # Используем строковый идентификатор
            print(f"New token: {new_token}")
            
            try:
                new_decoded = decode_token(new_token)
                print("New decoded token:", new_decoded)
                print("New identity:", new_decoded.get('sub'))
            except Exception as e:
                print(f"Error decoding new token: {e}")
            
            return False

if __name__ == "__main__":
    test_jwt() 