@echo off
echo ===================================================
echo Starting Smart Resume Analyzer - FastAPI Backend
echo ===================================================

cd /d "%~dp0backend"

if not exist "venv\Scripts\activate.bat" (
    echo Virtual environment not found. Running setup first...
    call "%~dp0setup_backend.bat"
)

echo Activating venv and launching FastAPI server on http://localhost:8000...
call venv\Scripts\activate.bat
python run.py
pause
