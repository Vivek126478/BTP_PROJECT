// Contract addresses - will be populated after deployment
export const CONTRACT_ADDRESSES = {
  UserIdentity: process.env.REACT_APP_USER_IDENTITY_CONTRACT || '',
  RideContract: process.env.REACT_APP_RIDE_CONTRACT || '',
  Reputation: process.env.REACT_APP_REPUTATION_CONTRACT || ''
};

export const BLOCKCHAIN_CONFIG = {
  rpcUrl: process.env.REACT_APP_RPC_URL || 'http://127.0.0.1:8545',
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID || '1337'),
  chainName: process.env.REACT_APP_CHAIN_NAME || 'Localhost'
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
