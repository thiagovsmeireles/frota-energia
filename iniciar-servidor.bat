@echo off
echo ===================================================
echo Iniciando Servidor de Arquivos e Ngrok na MV
echo ===================================================
echo.
echo 1. Iniciando servidor local na porta 8080...
start cmd /k "npx http-server ./ -p 8080 --cors"
timeout /t 3 >nul

echo 2. Iniciando o Ngrok para expor a porta 8080...
start cmd /k "ngrok http 8080"

echo.
echo Pronto! Copie o link do Ngrok (https://...) que aparecer na tela preta.
echo Cole o link no 'generate_frota.js' e depois rode 'node generate_frota.js'.
pause