@echo off
echo =========================================================
echo  SMART RESUME ANALYZER - SINGLE URL SERVER LAUNCHER
echo  (Runs Complete UI + API from one single link: :8000)
echo =========================================================

set ROOT_DIR=%~dp0

echo [1/3] Building React Frontend Bundle (frontend/dist)...
cd /d "%ROOT_DIR%frontend"
if not exist "node_modules" (
    call npm install
)
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Starting Unified FastAPI Single Server on http://localhost:8000 ...
cd /d "%ROOT_DIR%backend"
if not exist "venv\Scripts\activate.bat" (
    call "%ROOT_DIR%setup_backend.bat"
)
call venv\Scripts\activate.bat

echo.
echo [3/3] Opening Single Unified App Link in your browser...
start http://localhost:8000

python run.py
pause
