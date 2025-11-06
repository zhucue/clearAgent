@echo off
echo ========================================
echo AI Corpus Cleaner - Backend Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Warning: .env file not found!
    echo Please copy .env.example to .env and configure your API keys.
    echo.
    pause
    exit /b 1
)

echo Starting development server...
echo Server will run on http://localhost:3001
echo.

call npm run dev

