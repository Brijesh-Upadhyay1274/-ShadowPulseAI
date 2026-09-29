@echo off
title ShadowPulse AI - Launcher
echo ========================================================
echo       ShadowPulse AI - NTRO Passive Intelligence
echo ========================================================
echo.
echo Starting FastAPI Backend on Port 8080...
start "ShadowPulse Backend" cmd /k "cd /d %~dp0backend && py -m uvicorn main:app --host 127.0.0.1 --port 8080 --reload"

timeout /t 2 /nobreak >nul

echo Starting React SOC Dashboard on Port 5173...
start "ShadowPulse Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo [OK] Both services launched!
echo - Dashboard: http://127.0.0.1:5173
echo - API Docs:  http://127.0.0.1:8080/docs
echo.
pause
