@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo === Frontend React (Vite) ===
echo.

if not exist "node_modules\react-router-dom\package.json" (
  echo Installation des dependances npm ^(premiere fois ou dossier incomplet^)...
  call npm install
  if errorlevel 1 (
    echo [ERREUR] npm install a echoue. Fermez Cursor/VS Code et relancez ce script.
    pause
    exit /b 1
  )
)

echo Lancement : npm run dev
echo Ouvrez l URL affichee ^(souvent http://localhost:5173^)
echo Le backend doit tourner sur http://localhost:8080
echo.
call npm run dev
pause
