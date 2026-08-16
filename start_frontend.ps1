Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting Smart Resume Analyzer - React Vite Frontend" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$frontendDir = Join-Path $PSScriptRoot "frontend"
Set-Location $frontendDir

if (-not (Test-Path ".\node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "`nStarting Vite development server on http://localhost:5173..." -ForegroundColor Green
npm run dev
