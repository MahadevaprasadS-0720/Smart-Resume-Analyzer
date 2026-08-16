Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting Smart Resume Analyzer - FastAPI Backend" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "backend"
Set-Location $backendDir

if (-not (Test-Path ".\venv\Scripts\Activate.ps1")) {
    Write-Host "Virtual environment not found. Running setup first..." -ForegroundColor Yellow
    & "$PSScriptRoot\setup_backend.ps1"
}

Write-Host "`nActivating venv and launching FastAPI server on http://localhost:8000..." -ForegroundColor Green
& ".\venv\Scripts\Activate.ps1"
python run.py
