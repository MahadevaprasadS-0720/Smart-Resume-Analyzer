Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   SMART RESUME ANALYZER - UNIFIED 1-CLICK LAUNCHER      " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

Write-Host "`n[1/3] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; if (-not (Test-Path '.\venv\Scripts\Activate.ps1')) { & '$rootDir\setup_backend.ps1' } else { & '.\venv\Scripts\Activate.ps1'; python run.py }"

Write-Host "`n[2/3] Starting React + Vite Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; if (-not (Test-Path '.\node_modules')) { npm install; npm run dev } else { npm run dev }"

Write-Host "`n[3/3] Opening App in your default browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host "`n=========================================================" -ForegroundColor Cyan
Write-Host " Complete project is running live at: http://localhost:5173" -ForegroundColor Green
Write-Host " FastAPI Swagger Docs available at: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Cyan
