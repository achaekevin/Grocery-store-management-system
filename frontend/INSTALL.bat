@echo off
echo ========================================
echo GroceryOS Frontend Installation
echo ========================================
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo Node.js found!
echo.

echo [2/3] Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Installation failed!
    pause
    exit /b 1
)
echo.

echo [3/3] Creating environment file...
if not exist .env (
    copy .env.example .env
    echo Environment file created!
) else (
    echo Environment file already exists.
)
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Demo Login:
echo   Email: john@groceryos.co.ke
echo   Password: password
echo.
pause
