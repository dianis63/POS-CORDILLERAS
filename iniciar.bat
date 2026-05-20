@echo off
title POS-CORDILLERAS - Iniciando sistema...
color 0A

echo ============================================
echo    POS-CORDILLERAS - Iniciando sistema
echo ============================================
echo.

echo [1/2] Iniciando backend...
cd /d "C:\Users\Admin\POS-Cordilleras\Cordilleras_Specialty_Coffee\backend"
if not exist "node_modules" (
    echo Instalando dependencias del backend...
    npm install
)
start /min "BACKEND - POS-Cordilleras" cmd /k "node index.js"

echo [2/2] Iniciando frontend...
cd /d "C:\Users\Admin\POS-Cordilleras\Cordilleras_Specialty_Coffee"
if not exist "node_modules" (
    echo Instalando dependencias del frontend...
    npm install
)
start /min "FRONTEND - POS-Cordilleras" cmd /k "npm run dev"

echo.
echo ============================================
echo    Sistema listo. Abriendo navegador...
echo ============================================
echo.

timeout /t 3
start http://localhost:5173
exit