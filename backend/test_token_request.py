import requests
import json

# Тестовый токен, созданный с identity='test'
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjkyNTAwMywianRpIjoiOGFjYzM4MzQtZGY3My00MjBjLWJkYzctNjVjNGE0NTQwYjVmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InRlc3QiLCJuYmYiOjE3NDY5MjUwMDMsImV4cCI6MTc0NzAxMTQwM30.cvP5jIjesWuJkV_zjWfi1XrJwJE8kt9S4z9JPSeS0mo'
# Токен с ID=123
token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjkyNTAwMywianRpIjoiYWQ1NmEyMTktNjA1NS00MWI5LTk2ZDMtMDAzNzI1MDNjYTA5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEyMyIsIm5iZiI6MTc0NjkyNTAwMywiZXhwIjoxNzQ3MDExNDAzfQ.nVGjP65oZrZaURo7h0A2FzzHkkTaG6gWUbaHG-n8h7U'

def test_request(token, test_name="Тест"):
    url = 'http://localhost:5001/api/pets/'
    headers = {'Authorization': f'Bearer {token}'}
    
    # Данные для создания объявления - простая структура
    data = {
        'title': 'Тестовый заголовок',
        'description': 'Тестовое описание',
        'pet_type': 'cat',
        'status': 'missing',
        'last_seen_address': 'Test Address',
        'last_seen_date': '2025-05-11T00:00:00'
    }
    
    print(f"=== {test_name} ===")
    print(f"Отправка запроса с токеном: {token[:20]}...")
    
    try:
        response = requests.post(url, headers=headers, data=data)
        print(f"Статус ответа: {response.status_code}")
        print(f"Ответ: {response.text[:200]}...")
        return response
    except Exception as e:
        print(f"Ошибка при отправке запроса: {e}")
        return None

# Тестируем оба токена
print("=== ТЕСТИРОВАНИЕ JWT-ТОКЕНОВ ===")
test_request(token, "Тест с строковым идентификатором")
print("\n")
test_request(token2, "Тест с числовым идентификатором")

# Проверка, корректно ли работает JWT аутентификация с другим маршрутом
print("\n=== ТЕСТИРОВАНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ ===")
profile_url = 'http://localhost:5001/api/auth/profile'
headers2 = {'Authorization': f'Bearer {token}'}

try:
    response = requests.get(profile_url, headers=headers2)
    print(f"Статус профиля: {response.status_code}")
    print(f"Ответ: {response.text[:200]}...")
except Exception as e:
    print(f"Ошибка при получении профиля: {e}") 