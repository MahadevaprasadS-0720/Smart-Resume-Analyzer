@echo off
echo =========================================================
echo    SMART RESUME ANALYZER - UNIFIED 1-CLICK LAUNCHER
echo =========================================================

set ROOT_DIR=%~dp0

echo [1/3] Starting FastAPI Backend on http://localhost:8000 ...
start "Smart Resume Analyzer - Backend" cmd /k "cd /d "%ROOT_DIR%backend" && if not exist "venv\Scripts\activate.bat" ( call "%ROOT_DIR%setup_backend.bat" ) else ( call venv\Scripts\activate.bat && python run.py )"

echo [2/3] Starting React + Vite Frontend on http://localhost:5173 ...
start "Smart Resume Analyzer - Frontend" cmd /k "cd /d "%ROOT_DIR%frontend" && if not exist "node_modules" ( npm install && npm run dev ) else ( npm run dev )"

echo [3/3] Opening App in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo =========================================================
echo  Complete project is running live at: http://localhost:5173
echo  FastAPI Swagger Docs available at: http://localhost:8000/docs
echo =========================================================
pause
