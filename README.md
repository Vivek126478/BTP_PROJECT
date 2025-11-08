# D-CARPOOL - Decentralized Peer-to-Peer Carpooling Platform

A full-stack decentralized carpooling application built with React, Node.js, MySQL, Solidity smart contracts, and IPFS integration.

## 🚀 Features

### Core Features
- **Web3 Wallet Authentication**: Connect via MetaMask for secure, decentralized identity
- **Ride Management**: Create, search, join, and cancel rides
- **Smart Contract Integration**: User identity, ride creation, and reputation stored on blockchain
- **Rating System**: On-chain reputation system for drivers and riders
- **Admin Dashboard**: Manage users, rides, and complaints

### User Features
- Profile management with ratings and cancellation history
- Search rides with advanced filters (location, date, seats, tags, price)
- Ride categories: Office Commute, Airport Drop, College Ride, Weekend Trip, etc.
- Real-time seat availability updates

### Admin Features
- View all users and rides
- Ban/unban users
- Manage complaints
- Dashboard statistics

## 📁 Project Structure

```
d-carpool/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Web3)
│   │   ├── utils/          # Utility functions (API, Web3)
│   │   ├── config/         # Configuration files
│   │   └── contracts/      # Contract ABIs
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── scripts/            # Migration and seed scripts
│   ├── utils/              # Email and IPFS services
│   ├── package.json
│   └── server.js
├── contracts/              # Solidity smart contracts
│   ├── contracts/
│   │   ├── UserIdentity.sol
│   │   ├── RideContract.sol
│   │   └── Reputation.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── hardhat.config.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **TailwindCSS** - Styling
- **Ethers.js** - Web3 integration
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM

### Blockchain
- **Solidity** - Smart contracts
- **Hardhat** - Development environment
- **OpenZeppelin** - Contract libraries

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **MetaMask** browser extension
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd d-carpool
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=d_carpool
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# Blockchain Configuration
BLOCKCHAIN_NETWORK=localhost
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your_private_key_for_deployment
```

### 3. Database Setup

Create MySQL database:

```bash
mysql -u root -p
CREATE DATABASE d_carpool;
EXIT;
```

### 4. Install Dependencies

Install all dependencies for each component:

```bash
# Install contracts dependencies
cd contracts
npm install

# Install server dependencies
cd ../server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Deploy Smart Contracts

Start a local Hardhat node:

```bash
cd contracts
npx hardhat node
```

In a new terminal, deploy contracts:

```bash
cd contracts
npm run deploy:local
```

This will:
- Deploy all three smart contracts
- Save contract addresses to `.env`
- Save ABIs to `contracts/deployments/abis/`

### 6. Copy Contract ABIs to Frontend

```bash
# Copy ABIs from contracts/deployments/abis/ to client/src/contracts/
cp contracts/deployments/abis/UserIdentity.json client/src/contracts/
cp contracts/deployments/abis/RideContract.json client/src/contracts/
cp contracts/deployments/abis/Reputation.json client/src/contracts/
```

### 7. Update Frontend Environment

Create `client/.env`:

```bash
cp client/.env.example client/.env
```

Update with contract addresses from deployment:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RPC_URL=http://127.0.0.1:8545
REACT_APP_CHAIN_ID=1337
REACT_APP_CHAIN_NAME=Localhost

REACT_APP_USER_IDENTITY_CONTRACT=<address_from_deployment>
REACT_APP_RIDE_CONTRACT=<address_from_deployment>
REACT_APP_REPUTATION_CONTRACT=<address_from_deployment>
```

### 8. Database Migration

Run database migrations:

```bash
cd server
npm run migrate
```

### 9. Seed Database (Optional)

Populate with test data:

```bash
cd server
npm run seed
```

This creates:
- 5 test users (including 1 admin)
- 4 sample rides
- Sample ratings and participants

### 10. Start the Application

Start all services in separate terminals:

**Terminal 1 - Hardhat Node:**
```bash
cd contracts
npx hardhat node
```

**Terminal 2 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Blockchain**: http://127.0.0.1:8545

## 🔐 MetaMask Configuration

1. Install MetaMask browser extension
2. Import one of the test accounts from Hardhat node
3. Add local network to MetaMask:
   - Network Name: Localhost
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

## 📱 Usage Guide

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" on homepage
   - Enter username and email
   - Approve MetaMask connection

2. **Search Rides**
   - Navigate to "Search Rides"
   - Use filters to find rides
   - Click on a ride to view details

3. **Post a Ride**
   - Click "Post Ride"
   - Fill in ride details
   - Approve blockchain transaction
   - Ride will be created on-chain and in database

4. **Join a Ride**
   - View ride details
   - Click "Join Ride"
   - Confirm transaction

5. **Rate Users**
   - After ride completion
   - Rate driver/riders
   - Submit on-chain rating

6. **Emergency SOS**
   - Click SOS button during active ride
   - Emergency contacts receive email with ride details

### For Admins

1. Navigate to Admin Dashboard
2. View statistics, users, rides, and complaints
3. Ban/unban users as needed
4. Manage complaints

## 🧪 Testing

### Test Accounts (from seed)

```
Username: alice_driver
Email: alice@example.com
Role: Driver

Username: bob_rider
Email: bob@example.com
Role: Rider

Username: charlie_admin
Email: charlie@example.com
Role: Admin
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/authenticate` - Register/login with wallet
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Rides
- `POST /api/rides` - Create ride
- `GET /api/rides/search` - Search rides
- `GET /api/rides/:id` - Get ride details
- `POST /api/rides/:id/join` - Join ride
- `POST /api/rides/:id/leave` - Leave ride
- `POST /api/rides/:id/cancel` - Cancel ride
- `POST /api/rides/:id/complete` - Complete ride

### Ratings
- `POST /api/ratings` - Submit rating
- `GET /api/ratings/user/:userId` - Get user ratings

### SOS
- `POST /api/sos` - Trigger SOS alert

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/rides` - Get all rides
- `PUT /api/admin/users/:userId/ban` - Ban/unban user
- `GET /api/admin/stats` - Get dashboard stats

## 🔧 Smart Contracts

### UserIdentity.sol
- Register users with wallet address
- Store username, email, IPFS hash
- Manage user activation status

### RideContract.sol
- Create rides with details
- Join/leave rides
- Track participants
- Manage ride status (active/completed/cancelled)

### Reputation.sol
- Submit ratings (0-5 stars)
- Calculate average ratings
- Store ratings on-chain
- Prevent duplicate ratings

## 🌐 IPFS Integration

Upload documents to IPFS:

```javascript
// Upload file
POST /api/ipfs/upload
Content-Type: multipart/form-data

// Upload JSON metadata
POST /api/ipfs/upload-json
Content-Type: application/json
```

## 🐛 Troubleshooting

### Common Issues

**1. MetaMask Connection Failed**
- Ensure MetaMask is installed
- Check network configuration
- Try refreshing the page

**2. Database Connection Error**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

**3. Contract Deployment Failed**
- Ensure Hardhat node is running
- Check private key in `.env`
- Verify sufficient ETH balance

**4. Frontend Can't Connect to Backend**
- Check backend is running on port 5000
- Verify CORS settings
- Check API_BASE_URL in frontend config

## 📝 Development Notes

### Adding New Features

1. **Smart Contract Changes**
   - Modify contracts in `contracts/contracts/`
   - Recompile: `npx hardhat compile`
   - Redeploy: `npm run deploy:local`
   - Update ABIs in frontend

2. **Backend Changes**
   - Add models in `server/models/`
   - Add controllers in `server/controllers/`
   - Add routes in `server/routes/`
   - Run migrations if needed

3. **Frontend Changes**
   - Add components in `client/src/components/`
   - Add pages in `client/src/pages/`
   - Update routes in `App.js`

## 🔒 Security Considerations

- Never commit `.env` files
- Use environment variables for sensitive data
- Validate all user inputs
- Implement rate limiting in production
- Use HTTPS in production
- Audit smart contracts before mainnet deployment

## 🚀 Production Deployment

### Backend
- Use production database
- Set `NODE_ENV=production`
- Enable HTTPS
- Configure proper CORS
- Use PM2 or similar for process management

### Frontend
- Build: `npm run build`
- Deploy to Netlify, Vercel, or similar
- Update environment variables

### Smart Contracts
- Deploy to testnet first (Goerli, Sepolia)
- Get contracts audited
- Deploy to mainnet
- Update contract addresses

## 📄 License

MIT License

## 👥 Contributors

Your Name - Initial work

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat for development tools
- MetaMask for Web3 integration
- Pinata for IPFS hosting

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: your-email@example.com

---

**Happy Carpooling! 🚗💨**
