import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
    setupEventListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkConnection = async () => {
    try {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupEventListeners = () => {
    // Wallet event listeners are disabled since we're not using wallet authentication
    // Users can still use the app without MetaMask
    if (window.ethereum) {
      // Optional: Add listeners back when wallet features are re-enabled
      // window.ethereum.on('accountsChanged', handleAccountsChanged);
      // window.ethereum.on('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts) => {
    // Disabled - not using wallet authentication
    if (accounts.length === 0) {
      // disconnect();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Disabled - not using wallet authentication
    // window.location.reload();
  };

  const connect = async (username, email, password, additionalData = {}) => {
    setIsConnecting(true);
    try {
      // Register with backend (signup) - no wallet required
      const response = await authAPI.signup({
        username,
        email,
        password,
        ...additionalData
      });

      const { user: userData } = response.data;

      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      toast.success('Account created successfully!');

      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.error || 'Failed to create account');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const login = async (email, password) => {
    setIsConnecting(true);
    try {
      // Login with backend - no wallet required
      const response = await authAPI.login({
        email,
        password
      });

      const { user: userData } = response.data;

      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      
      toast.success('Login successful!');

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Disconnected');
  };

  const updateUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    account,
    user,
    loading,
    isConnecting,
    isConnected: !!user, // User is considered connected if they're logged in, wallet is optional
    connect,
    login,
    disconnect,
    updateUser
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
