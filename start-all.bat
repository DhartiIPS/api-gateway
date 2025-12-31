@echo off
REM BFF Gateway Startup Script for Windows
REM This script starts all services in the correct order

echo.
echo 🚀 Starting Doctor Appointment Booking System...
echo.

REM Check if required directories exist
if not exist "..\auth-service" (
    echo ❌ Auth Service directory not found
    pause
    exit /b 1
)

if not exist "..\appointment-service" (
    echo ❌ Appointment Service directory not found
    pause
    exit /b 1
)

if not exist "..\frontend" (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

echo ✅ All service directories found
echo.

REM Start Auth Service
echo Starting Auth Service on port 5002...
start "Auth Service" cmd /k "cd ..\auth-service && npm run start:dev"
timeout /t 3 /nobreak
echo.

REM Start Appointment Service
echo Starting Appointment Service on port 5003...
start "Appointment Service" cmd /k "cd ..\appointment-service && npm run start:dev"
timeout /t 3 /nobreak
echo.

REM Start BFF Gateway
echo Starting BFF Gateway on port 3001...
start "BFF Gateway" cmd /k "cd gateway && npm run start:dev"
timeout /t 3 /nobreak
echo.

REM Start Frontend
echo Starting Frontend on port 3000...
start "Frontend" cmd /k "cd ..\frontend && npm run dev"
timeout /t 3 /nobreak
echo.

echo ========================================
echo 🎉 All services started successfully!
echo ========================================
echo.
echo Service URLs:
echo   📱 Frontend:            http://localhost:3000
echo   🔌 BFF Gateway:         http://localhost:3001
echo   🔧 Auth Service:        TCP 127.0.0.1:5002
echo   🔧 Appointment Service: TCP 127.0.0.1:5003
echo   🗄️  PostgreSQL:          localhost:5432
echo.
echo ✅ Open a browser and navigate to http://localhost:3000
echo.
pause
