@echo off
title Pautina Admin 2.0 Dev Server
echo ========================================================
echo  Запуск Pautina Admin 2.0 (Next.js + Tailwind CSS)
echo ========================================================
echo.
cd /d "C:\folder\JOB\VS_Code_AL\rea_pautina_admin_panel"
set PATH=C:\Program Files\nodejs;%PATH%
echo Відкрийте у браузері: http://localhost:3000
echo.
npm run dev
pause
