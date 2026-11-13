@echo off
title DevScribe Server - Kanak
echo ==========================================================
echo   DevScribe Full-Stack Server by Kanak
echo ==========================================================

:: Prepend Node.js to PATH if installed in user local AppData
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Node.js was not detected in PATH.
    echo Launching PowerShell lightweight HTTP server instead...
    powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
    pause
    exit /b 1
)

echo Starting DevScribe Node.js and Express.js REST API Backend...
echo Server URL: http://localhost:5000
echo REST APIs:  http://localhost:5000/api
echo.
start http://localhost:5000
node "%~dp0server\server.js"
pause
