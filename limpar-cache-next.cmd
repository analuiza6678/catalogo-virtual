@echo off
cd /d "%~dp0"
echo Feche o servidor do site antes de continuar.
echo.
echo Limpando cache temporario do Next.js...
if exist ".next" rmdir /s /q ".next"
echo Cache limpo.
pause
