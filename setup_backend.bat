@echo off
echo ===================================================
echo Setting up Smart Resume Analyzer Backend Environment
echo ===================================================

cd /d "%~dp0backend"

echo [1/3] Creating Python Virtual Environment (venv)...
python -m venv venv
if %errorlevel% neq 0 (
    echo Error creating virtual environment. Ensure Python is installed and added to PATH.
    pause
    exit /b %errorlevel%
)

echo [2/3] Activating Virtual Environment...
call venv\Scripts\activate.bat

echo [3/3] Installing Python Dependencies from requirements.txt...
python -m pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing dependencies.
    pause
    exit /b %errorlevel%
)

echo ===================================================
echo Backend Setup Complete! You can now run start_backend.bat
echo ===================================================
pause
