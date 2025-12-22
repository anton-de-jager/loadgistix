@echo off
setlocal EnableDelayedExpansion

echo ========================================
echo   LoadGistix Deployment
echo ========================================
echo.

:: Check for WinSCP
set WINSCP="C:\Program Files (x86)\WinSCP\WinSCP.com"
if not exist %WINSCP% (
    echo ERROR: WinSCP is required for deployment.
    echo Please download from: https://winscp.net/eng/download.php
    echo Install to default location: C:\Program Files ^(x86^)\WinSCP\
    pause
    exit /b 1
)

:: Get FTP credentials
set /p FTP_HOST="FTP Host (e.g., ftp.loadgistix.com): "
set /p FTP_USER="FTP Username: "
set /p FTP_PASS="FTP Password: "

echo.
echo [1/4] Building API...
cd /d "%~dp0loadgistix.api"
dotnet publish -c Release -o ./publish
if errorlevel 1 (
    echo API build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Building Frontend...
cd /d "%~dp0loadgistix.frontend"
call npm run build -- --configuration=production
if errorlevel 1 (
    echo Frontend build failed!
    pause
    exit /b 1
)

:: Create web.config
echo ^<?xml version="1.0" encoding="utf-8"?^> > "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo ^<configuration^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo   ^<system.webServer^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo     ^<rewrite^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo       ^<rules^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo         ^<rule name="Angular Routes" stopProcessing="true"^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo           ^<match url=".*" /^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo           ^<conditions logicalGrouping="MatchAll"^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo             ^<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo             ^<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo           ^</conditions^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo           ^<action type="Rewrite" url="/index.html" /^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo         ^</rule^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo       ^</rules^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo     ^</rewrite^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo   ^</system.webServer^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"
echo ^</configuration^> >> "%~dp0loadgistix.frontend\dist\fuse\browser\web.config"

echo.
echo [3/4] Deploying API via FTP...
cd /d "%~dp0"

:: Create WinSCP script for API
echo open ftp://%FTP_USER%:%FTP_PASS%@%FTP_HOST%/ > "%TEMP%\winscp_api.txt"
echo cd /api.loadgistix.com >> "%TEMP%\winscp_api.txt"
echo rm *.* >> "%TEMP%\winscp_api.txt"
echo rm -r * >> "%TEMP%\winscp_api.txt"
echo lcd "%~dp0loadgistix.api\publish" >> "%TEMP%\winscp_api.txt"
echo put -r * >> "%TEMP%\winscp_api.txt"
echo exit >> "%TEMP%\winscp_api.txt"

%WINSCP% /script="%TEMP%\winscp_api.txt" /log="%TEMP%\winscp_api.log"

echo.
echo [4/4] Deploying Frontend via FTP...

:: Create WinSCP script for Frontend
echo open ftp://%FTP_USER%:%FTP_PASS%@%FTP_HOST%/ > "%TEMP%\winscp_frontend.txt"
echo cd /loadgistix.com >> "%TEMP%\winscp_frontend.txt"
echo rm *.* >> "%TEMP%\winscp_frontend.txt"
echo rm -r assets >> "%TEMP%\winscp_frontend.txt"
echo rm -r media >> "%TEMP%\winscp_frontend.txt"
echo lcd "%~dp0loadgistix.frontend\dist\fuse\browser" >> "%TEMP%\winscp_frontend.txt"
echo put -r * >> "%TEMP%\winscp_frontend.txt"
echo exit >> "%TEMP%\winscp_frontend.txt"

%WINSCP% /script="%TEMP%\winscp_frontend.txt" /log="%TEMP%\winscp_frontend.log"

:: Cleanup
del "%TEMP%\winscp_api.txt" 2>nul
del "%TEMP%\winscp_frontend.txt" 2>nul

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Frontend: https://loadgistix.com
echo API:      https://api.loadgistix.com
echo.
pause

