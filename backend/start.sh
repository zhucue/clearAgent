#!/bin/bash

echo "========================================"
echo "AI Corpus Cleaner - Backend Server"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found!"
    echo "Please copy .env.example to .env and configure your API keys."
    echo ""
    exit 1
fi

echo "Starting development server..."
echo "Server will run on http://localhost:3001"
echo ""

npm run dev

