@echo off
echo ==========================================
echo Starting APEX - AI Powered Masters Program Explorer
echo ==========================================

echo [1/2] Starting FastAPI Backend...
start "APEX Backend" cmd /k "cd backend && python main.py"

echo [2/2] Starting React Frontend...
start "APEX Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting up in separate windows!
echo Backend will be available at http://localhost:8000
echo Frontend will be available at http://localhost:5173
echo.
echo Press any key to exit this launcher window...
pause >nul
