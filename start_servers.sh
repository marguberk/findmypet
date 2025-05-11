#!/bin/bash

# Запуск бэкенда
cd /Users/almaty/cursors/elaman/backend
source venv/bin/activate
echo "Запуск бэкенд-сервера..."
python run.py &
BACKEND_PID=$!
echo "Бэкенд запущен с PID: $BACKEND_PID"

# Даем бэкенду немного времени для запуска
sleep 2

# Запуск фронтенда
cd /Users/almaty/cursors/elaman/frontend/findmypet-client
echo "Запуск фронтенд-сервера..."
PORT=3001 npm start &
FRONTEND_PID=$!
echo "Фронтенд запущен с PID: $FRONTEND_PID"

echo "Серверы запущены. Нажмите Ctrl+C для остановки."
wait 