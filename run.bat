@echo off
echo ========================================================
echo Starting AI Career Copilot...
echo ========================================================

echo.
echo [1/2] Starting FastAPI Backend on port 8000...
start cmd /k "cd backend\app && set PYTHONPATH=. && ..\venv\Scripts\python.exe -m uvicorn main:app --reload"

echo.
echo [2/2] Starting React Frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Both servers are launching in separate windows!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000/docs
echo ========================================================
