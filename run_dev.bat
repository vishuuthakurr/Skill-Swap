@echo off
echo ===================================================
echo   Starting Skill-Swap Local Development Servers
echo ===================================================

echo [1/3] Launching Django Backend (port 8000)...
start "Skill-Swap - Django Backend" cmd /k "cd /d %~dp0django_backend && python manage.py runserver 127.0.0.1:8000"

echo [2/3] Launching Socket.io Service (port 4100)...
start "Skill-Swap - Socket.io Service" cmd /k "cd /d %~dp0socket_service && npm start"

echo [3/3] Launching React Client (port 5173)...
start "Skill-Swap - React Frontend" cmd /k "cd /d %~dp0 && npm run dev:client"

echo.
echo ===================================================
echo All 3 services have been launched in separate windows:
echo - Django API:       http://127.0.0.1:8000/health
echo - Socket.io Server: http://127.0.0.1:4100/health
echo - React Web App:    http://localhost:5173
echo ===================================================
pause
