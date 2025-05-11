import requests
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Настройки API
API_URL = "http://localhost:5001/api"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjkyMzY3MSwianRpIjoiZDI3Mjg4NGUtMDA1MC00YzkyLTk3OGQtNmI1ZmVkZWJmZTFhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzQ2OTIzNjcxLCJleHAiOjE3NDcwMTAwNzF9.If8Fp0S7Tw94wZFk0iByrwduMEkE3xa6zkxuBnH_pig"

def create_pet_post():
    url = f"{API_URL}/pets/"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Данные для создания объявления
    data = {
        "title": "Тестовый заголовок",
        "description": "Тестовое описание",
        "pet_type": "cat",
        "status": "missing",
        "last_seen_address": "Test Address",
        "last_seen_date": "2025-05-11T00:00:00"
    }
    
    # Выполняем запрос
    logger.info(f"Отправка POST запроса на {url}")
    logger.info(f"Данные: {data}")
    
    response = requests.post(url, headers=headers, data=data)
    
    # Выводим результат
    logger.info(f"Статус ответа: {response.status_code}")
    logger.info(f"Ответ: {response.text}")
    
    return response

if __name__ == "__main__":
    create_pet_post() 