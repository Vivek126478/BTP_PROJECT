# D-CARPOOL Quick Start Guide

Get up and running in 10 minutes!

## Prerequisites

- Node.js v16+
- MySQL v8+
- MetaMask browser extension

## Quick Setup

### 1. Install Dependencies

**Windows:**
```bash
scripts\setup.bat
```

**Mac/Linux:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure Environment

Edit `.env` file:
```env
DB_PASSWORD=your_mysql_password
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Setup Database

```bash
mysql -u root -p
CREATE DATABASE d_carpool;
EXIT;
```

### 4. Deploy & Start

**Terminal 1 - Blockchain:**
```bash
cd contracts
npx hardhat node
```

**Terminal 2 - Deploy Contracts:**
```bash
cd contracts
npm run deploy:local
```

**Terminal 3 - Backend:**
```bash
cd server
npm run migrate
npm run seed
npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd client
npm start
```

### 5. Configure MetaMask

1. Add Network:
   - Network Name: `Localhost`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: `ETH`

2. Import test account from Hardhat console

### 6. Access Application

Open http://localhost:3000

## Test Accounts

After running seed script:

```
Username: alice_driver
Email: alice@example.com
Role: Driver

Username: charlie_admin
Email: charlie@example.com
Role: Admin
```

## Common Commands

```bash
# Compile contracts
cd contracts && npx hardhat compile

# Run tests
cd contracts && npx hardhat test

# Reset database
cd server && npm run migrate

# Seed test data
cd server && npm run seed

# Start development server
cd server && npm run dev

# Build frontend
cd client && npm run build
```

## Troubleshooting

**Can't connect to MetaMask?**
- Ensure MetaMask is installed
- Check network is set to Localhost (Chain ID: 1337)

**Database errors?**
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists

**Contract deployment fails?**
- Make sure Hardhat node is running
- Check you have ETH in test account

## Next Steps

1. Connect wallet on homepage
2. Search for rides
3. Post your first ride
4. Join a ride
5. Complete ride and rate users

For detailed documentation, see [README.md](README.md)

---

Need help? Check the full README or create an issue!
