#!/bin/bash

echo "=========================================="
echo "RailVision AI - Quick Setup Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Installing Backend Dependencies${NC}"
cd backend
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

echo -e "${BLUE}Step 2: Checking Python version${NC}"
python --version
echo -e "${GREEN}✓ Python version checked${NC}"
echo ""

echo -e "${BLUE}Step 3: Checking Node.js version${NC}"
node --version
pnpm --version
echo -e "${GREEN}✓ Node.js and pnpm available${NC}"
echo ""

echo -e "${BLUE}Step 4: Backend Environment Setup${NC}"
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created .env file (update MONGODB_URL if needed)${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi
echo ""

echo -e "${BLUE}Step 5: Checking MongoDB${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
else
    echo "MongoDB not found. Install with:"
    echo "  macOS: brew install mongodb-community"
    echo "  Ubuntu: sudo apt-get install -y mongodb-org"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Start MongoDB:"
echo "  mongod"
echo ""
echo "Terminal 2 - Start Backend:"
echo "  cd backend"
echo "  python -m uvicorn app.main:app --reload --port 8000"
echo ""
echo "Terminal 3 - Start Frontend:"
echo "  pnpm dev"
echo ""
echo "Then visit:"
echo "  Frontend: http://localhost:3000"
echo "  Backend Docs: http://localhost:8000/docs"
echo "  Backend Health: http://localhost:8000/health"
echo ""
