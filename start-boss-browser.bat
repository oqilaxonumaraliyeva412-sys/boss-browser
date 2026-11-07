@echo off
title BOSS BROWSER - Loading...
echo.
echo  ██████╗  ██████╗ ███████╗███████╗
echo  ██╔══██╗██╔═══██╗██╔════╝██╔════╝
echo  ██████╔╝██║   ██║███████╗███████╗
echo  ██╔══██╗██║   ██║╚════██║╚════██║
echo  ██████╔╝╚██████╔╝███████║███████║
echo  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
echo.
echo  BOSS BROWSER - Starting...
echo.

cd /d "C:\Users\MADI\.gemini\antigravity\scratch\boss-browser"

:: Electron ni to'g'ri ishlatish uchun ELECTRON_RUN_AS_NODE ni o'chiramiz
set ELECTRON_RUN_AS_NODE=
set ELECTRON_SKIP_BINARY_DOWNLOAD=

if exist "node_modules\electron\dist\electron.exe" (
    echo  [OK] Electron topildi, ishga tushirilmoqda...
    start "" "node_modules\electron\dist\electron.exe" "."
    echo  [OK] BOSS BROWSER ishga tushdi!
) else (
    echo  [!] Electron topilmadi. npm install ishga tushirilmoqda...
    npm install
    if exist "node_modules\electron\dist\electron.exe" (
        start "" "node_modules\electron\dist\electron.exe" "."
        echo  [OK] BOSS BROWSER ishga tushdi!
    ) else (
        echo  [X] Xato: electron.exe topilmadi!
        pause
    )
)
