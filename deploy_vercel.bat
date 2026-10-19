@echo off
title Deploy Pautina Admin to Vercel
echo ========================================================
echo  Деплой Pautina Admin 2.0 на Vercel
echo ========================================================
echo.
cd /d "C:\folder\JOB\VS_Code_AL\rea_pautina_admin_panel"
set PATH=C:\Program Files\nodejs;%PATH%
echo Запуск Vercel CLI...
echo (Якщо запитає логін - оберіть Continue with GitHub або Email)
echo.
npx vercel
echo.
echo ========================================================
echo  Деплой завершено! Посилання вказано вище.
echo ========================================================
pause
