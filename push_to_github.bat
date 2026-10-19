@echo off
chcp 65001 > nul
title Push to GitHub
echo ========================================================
echo  Пуш коду Pautina Admin 2.0 на GitHub
echo ========================================================
echo.
cd /d "C:\folder\JOB\VS_Code_AL\rea_pautina_admin_panel"
set PATH=C:\Program Files\nodejs;C:\Users\lisit\AppData\Local\Programs\Git\cmd;%PATH%

set /p REPO_URL="Вставте посилання на ваш GitHub репозиторій (наприклад https://github.com/user/pautina-admin.git): "

if "%REPO_URL%"=="" (
    echo Посилання не введено!
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Відправляємо код на GitHub...
git push -u origin main

echo.
echo ========================================================
echo  Готово! Код на GitHub.
echo ========================================================
pause
