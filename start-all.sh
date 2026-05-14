#!/bin/bash

echo "=========================================="
echo "RailVision AI - Starting Full Stack"
echo "=========================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo "Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT

# Start Backend
echo "Starting Backend on port 8000..."
cd backend
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..
sleep 3
echo "Backend started (PID: $BACKEND_PID)"
echo ""

# Start Frontend
echo "Starting Frontend on port 3000..."
pnpm dev &
FRONTEND_PID=$!
sleep 3
echo "Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "=========================================="
echo "All services running!"
echo "=========================================="
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=========================================="
echo ""

# Keep script running
wait
