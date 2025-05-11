try:
    from flask_cors import CORS
    print("flask_cors успешно импортирован!")
except ImportError as e:
    print(f"Ошибка импорта: {e}") 