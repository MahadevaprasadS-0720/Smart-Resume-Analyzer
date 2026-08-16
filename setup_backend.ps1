Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Setting up Smart Resume Analyzer Backend Environment" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "backend"
Set-Location $backendDir

Write-Host "`n[1/3] Creating Python Virtual Environment (venv)..." -ForegroundColor Yellow
python -m venv venv
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error creating virtual environment. Ensure Python is installed." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n[2/3] Activating Virtual Environment & Upgrading pip..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
python -m pip install --upgrade pip

Write-Host "`n[3/3] Installing Python Dependencies from requirements.txt..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing dependencies." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host "Backend Setup Complete! Run .\start_backend.ps1 to start the API." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
