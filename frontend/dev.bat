@echo off
echo Starting Next.js in safe mode...
echo.
echo This script uses a custom configuration to avoid EPERM errors
echo.

:: Install cross-env if not already installed
call npm install --no-save cross-env

:: Run the development server with the safe configuration
call npm run dev:safe

pause
