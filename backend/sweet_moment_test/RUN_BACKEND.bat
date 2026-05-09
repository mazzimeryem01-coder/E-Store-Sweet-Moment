@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
echo.
echo === Backend Sweet Moment (Spring Boot + H2) ===
echo Dossier: %CD%
echo.

where mvn >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Maven ^(mvn^) n'est pas dans le PATH.
  echo.
  echo IntelliJ IDEA :
  echo   - File ^> Open : ouvrez CE dossier ^(sweet_moment_test^)
  echo   - Maven ^(droite^) ^> bouton Recharger le projet Maven
  echo   - File ^> Project Structure ^> Project : SDK = JDK 17
  echo   - Ouvrez SweetFullBackendApplication.java ^> fleche verte Run
  echo   OU installez Maven et ajoutez ^"bin^" au PATH Windows.
  echo.
  pause
  exit /b 1
)

echo Demarrage : mvn spring-boot:run ^(port 8080^)...
echo.
call mvn spring-boot:run
pause
