@echo off
echo ======================================
echo D-CARPOOL Setup Script
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js v16 or higher.
    exit /b 1
)

echo + Node.js is installed
echo.

REM Install dependencies
echo Installing dependencies...
echo.

echo Installing contracts dependencies...
cd contracts
call npm install
cd ..

echo Installing server dependencies...
cd server
call npm install
cd ..

echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo + All dependencies installed successfully!
echo.

REM Check if .env exists
if not exist .env (
    echo .env file not found. Copying from .env.example...
    copy .env.example .env
    echo + .env file created. Please edit it with your configuration.
    echo.
)

REM Check if client/.env exists
if not exist client\.env (
    echo client\.env file not found. Copying from client\.env.example...
    copy client\.env.example client\.env
    echo + client\.env file created.
    echo.
)

echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Edit .env file with your MySQL credentials
echo 2. Create MySQL database: CREATE DATABASE d_carpool;
echo 3. Start Hardhat node: cd contracts ^&^& npx hardhat node
echo 4. Deploy contracts: cd contracts ^&^& npm run deploy:local
echo 5. Run migrations: cd server ^&^& npm run migrate
echo 6. (Optional) Seed data: cd server ^&^& npm run seed
echo 7. Start backend: cd server ^&^& npm run dev
echo 8. Start frontend: cd client ^&^& npm start
echo.
echo For detailed instructions, see README.md
echo.
pause
