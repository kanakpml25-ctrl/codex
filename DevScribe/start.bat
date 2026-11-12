@echo off
title TechPulse Blog App Server
echo Starting TechPulse Blog Application...
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
