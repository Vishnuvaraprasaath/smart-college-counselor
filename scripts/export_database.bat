@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0export_database.ps1" %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Export encountered an error.
    pause
)
