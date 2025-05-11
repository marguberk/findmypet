# FindMyPet

FindMyPet - это веб-приложение, разработанное для помощи владельцам потерянных питомцев и тем, кто находит потерянных животных. Платформа позволяет создавать объявления о пропавших или найденных питомцах, связываться с владельцами и просматривать объявления на карте.

## Функционал

- Регистрация и аутентификация пользователей
- Создание, редактирование и удаление объявлений о потерянных/найденных питомцах
- Просмотр объявлений других пользователей
- Контактная форма для связи с владельцами
- Отображение объявлений на карте
- Интернет-магазин товаров для питомцев (демо)

## Технический стек

### Backend
- Python 3.8+
- Flask
- SQLAlchemy
- JWT для аутентификации
- SQLite (для разработки)

### Frontend
- React.js
- React Router
- Bootstrap 5
- React Hooks
- Axios для API запросов

## Установка и запуск

### Предварительные требования
- Python 3.8 или выше
- Node.js и npm
- Git

### Шаги по установке

1. Клонируйте репозиторий
```
git clone https://github.com/marguberk/findmypet.git
cd findmypet
```

2. Настройка Backend
```
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения
# Для Windows:
venv\Scripts\activate
# Для macOS/Linux:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера разработки
python run.py
```
Backend будет доступен по адресу http://localhost:5001

3. Настройка Frontend
```
cd ../frontend/findmypet-client

# Установка зависимостей
npm install

# Запуск сервера разработки
npm start
```
Frontend будет доступен по адресу http://localhost:3000

4. Для одновременного запуска backend и frontend можно использовать скрипт start_servers.sh (только для macOS/Linux):
```
chmod +x start_servers.sh
./start_servers.sh
```

## Структура проекта

```
findmypet/
├── backend/
│   ├── app/
│   │   ├── models/         # Модели базы данных
│   │   ├── routes/         # API маршруты
│   │   ├── static/         # Статические файлы
│   │   └── templates/      # HTML шаблоны
│   ├── instance/           # Экземпляр базы данных
│   ├── config.py           # Конфигурация
│   ├── requirements.txt    # Зависимости Python
│   └── run.py              # Точка входа для запуска
├── frontend/
│   └── findmypet-client/   # React приложение
│       ├── public/
│       └── src/
│           ├── components/ # React компоненты
│           ├── context/    # React контекст
│           └── services/   # Сервисы для работы с API
└── start_servers.sh        # Скрипт для запуска
```

## Документация API

### Аутентификация
- POST /api/auth/register - Регистрация нового пользователя
- POST /api/auth/login - Вход в систему
- GET /api/auth/profile - Получение профиля текущего пользователя

### Питомцы
- GET /api/pets - Получение списка всех объявлений
- GET /api/pets/<id> - Получение информации об объявлении
- POST /api/pets - Создание нового объявления
- PUT /api/pets/<id> - Обновление объявления
- DELETE /api/pets/<id> - Удаление объявления
- GET /api/pets/user - Получение объявлений текущего пользователя

## Лицензия

MIT 