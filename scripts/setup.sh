#!/bin/bash

echo "======================================"
echo "D-CARPOOL Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null
then
    echo "❌ MySQL is not installed. Please install MySQL v8 or higher."
    exit 1
fi

echo "✅ MySQL is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

echo "Installing contracts dependencies..."
cd contracts
npm install
cd ..

echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ All dependencies installed successfully!"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
    echo ""
fi

# Check if client/.env exists
if [ ! -f client/.env ]; then
    echo "⚠️  client/.env file not found. Copying from client/.env.example..."
    cp client/.env.example client/.env
    echo "✅ client/.env file created."
    echo ""
fi

echo "======================================"
echo "Setup Complete! 🎉"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your MySQL credentials"
echo "2. Create MySQL database: CREATE DATABASE d_carpool;"
echo "3. Start Hardhat node: cd contracts && npx hardhat node"
echo "4. Deploy contracts: cd contracts && npm run deploy:local"
echo "5. Run migrations: cd server && npm run migrate"
echo "6. (Optional) Seed data: cd server && npm run seed"
echo "7. Start backend: cd server && npm run dev"
echo "8. Start frontend: cd client && npm start"
echo ""
echo "For detailed instructions, see README.md"
echo ""
