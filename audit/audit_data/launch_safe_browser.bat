@echo off
title Safe Browser Recorder - Pautina Rooms
echo ========================================================
echo  Starting Safe Browser Recorder...
echo  Target: https://www.pautina-rooms.com/admin/times
echo ========================================================
echo.
cd /d "C:\folder\JOB\VS_Code_AL\rea_pautina_admin_panel"
"C:\Users\lisit\AppData\Local\Python\pythoncore-3.14-64\python.exe" -u "C:\folder\JOB\VS_Code_AL\rea_pautina_admin_panel\safe_capture.py"
echo.
echo ========================================================
echo  Finished. Press any key to close this window.
echo ========================================================
pause
