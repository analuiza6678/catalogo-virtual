@echo off
cd /d "%~dp0"
echo Iniciando o Catalogo WhatsApp Premium...
echo.
echo Limpando cache temporario do Next.js...
if exist ".next" rmdir /s /q ".next"
echo.
npm.cmd run dev
pause
