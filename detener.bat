@echo off
title POS-CORDILLERAS - Deteniendo sistema...
color 0C

echo ============================================
echo    POS-CORDILLERAS - Deteniendo sistema
echo ============================================
echo.

echo Cerrando backend (puerto 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo Cerrando frontend (puerto 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo Cerrando ventanas de terminal...
taskkill /FI "WINDOWTITLE eq BACKEND - POS-Cordilleras" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq FRONTEND - POS-Cordilleras" /F >nul 2>&1

echo.
echo Sistema detenido correctamente.
echo Para volver a iniciarlo, ejecute iniciar.bat
echo.

timeout /t 2
exit