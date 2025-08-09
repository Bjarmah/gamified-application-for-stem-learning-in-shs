@echo off
setlocal

echo STEM Stars Ghana - Sample Data Generation
echo =======================================

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

:: Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to install dependencies.
        exit /b 1
    )
)

:: Check for .env file and create if it doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env >nul 2>nul
    echo Please edit the .env file with your Supabase service key before continuing.
    echo Press any key to continue once you've updated the .env file...
    pause >nul
)

:: Check if SUPABASE_SERVICE_KEY is set in environment or .env file
set KEY_SET=0
if not "%SUPABASE_SERVICE_KEY%"=="" set KEY_SET=1
for /f "tokens=*" %%a in ('node -e "try { require('dotenv').config(); console.log(process.env.SUPABASE_SERVICE_KEY ? 1 : 0); } catch(e) { console.log(0); }"') do set ENV_KEY_SET=%%a
if %KEY_SET%==0 if %ENV_KEY_SET%==0 (
    echo Error: SUPABASE_SERVICE_KEY is not set in environment or .env file.
    echo Please set it in the .env file or using: set SUPABASE_SERVICE_KEY=your_service_key_here
    echo Get this from your Supabase dashboard under Project Settings ^> API
    exit /b 1
)

echo.
echo Step 1/3: Creating sample users...
node create-sample-users.js
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to create sample users.
    exit /b 1
)

echo.
echo Step 2/3: Creating sample user progress data...
node create-sample-user-progress.js
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to create sample user progress data.
    exit /b 1
)

echo.
echo Step 3/3: Creating sample quiz attempt data...
node create-sample-quiz-attempts.js
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to create sample quiz attempt data.
    exit /b 1
)

echo.
echo =======================================
echo Sample data generation completed successfully!
echo.
echo You can now log in with the following credentials:
echo.
echo Admin: admin@example.com / password123
echo Teacher: teacher1@example.com / password123
echo Student: student1@example.com / password123
echo.

endlocal