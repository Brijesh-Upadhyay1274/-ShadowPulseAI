# ShadowPulse AI - PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      ShadowPulse AI - NTRO Passive Intelligence        " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot

Write-Host "Starting FastAPI Backend on Port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; py -m uvicorn main:app --host 127.0.0.1 --port 8080 --reload"

Start-Sleep -Seconds 2

Write-Host "Starting React Frontend on Port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev -- --host 127.0.0.1 --port 5173"

Write-Host ""
Write-Host "[OK] Both services are running!" -ForegroundColor Green
Write-Host "Dashboard: http://127.0.0.1:5173" -ForegroundColor White
Write-Host "API Docs:  http://127.0.0.1:8080/docs" -ForegroundColor White
