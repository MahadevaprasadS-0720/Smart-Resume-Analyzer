Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " SMART RESUME ANALYZER - SINGLE URL SERVER LAUNCHER     " -ForegroundColor Cyan
Write-Host " (Runs Complete UI + API from one single link: :8000)   " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
$frontendDir = Join-Path $rootDir "frontend"
$backendDir = Join-Path $rootDir "backend"

Write-Host "`n[1/3] Building React Frontend Bundle (frontend/dist)..." -ForegroundColor Green
Set-Location $frontendDir
if (-not (Test-Path ".\node_modules")) {
    npm install
}
npm run build

Write-Host "`n[2/3] Starting Unified FastAPI Single Server on http://localhost:8000 ..." -ForegroundColor Green
Set-Location $backendDir
if (-not (Test-Path ".\venv\Scripts\Activate.ps1")) {
    & "$rootDir\setup_backend.ps1"
}
& ".\venv\Scripts\Activate.ps1"

Write-Host "`n[3/3] Opening Single Unified App Link in your browser..." -ForegroundColor Yellow
Start-Process "http://localhost:8000"

python run.py
