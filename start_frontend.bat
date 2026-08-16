@echo off
echo ===================================================
echo Starting Smart Resume Analyzer - React Vite Frontend
echo ===================================================

cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
)

echo Starting Vite development server on http://localhost:5173...
call npm run dev
pause
