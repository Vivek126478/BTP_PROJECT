import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG } from '../config/contracts';

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    // Check if on correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const expectedChainId = `0x${BLOCKCHAIN_CONFIG.chainId.toString(16)}`;

    if (chainId !== expectedChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: expectedChainId }]
        });
      } catch (switchError) {
        // Chain doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: expectedChainId,
              chainName: BLOCKCHAIN_CONFIG.chainName,
              rpcUrls: [BLOCKCHAIN_CONFIG.rpcUrl],
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18
              }
            }]
          });
        } else {
          throw switchError;
        }
      }
    }

    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

export const getContract = async (address, abi) => {
  const signer = await getSigner();
  return new ethers.Contract(address, abi, signer);
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatEther = (value) => {
  return ethers.formatEther(value);
};

export const parseEther = (value) => {
  return ethers.parseEther(value.toString());
};
