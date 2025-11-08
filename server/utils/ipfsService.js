const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config({ path: '../.env' });

// Upload file to IPFS using Pinata or similar service
exports.uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    // Using Pinata as IPFS provider
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);

    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        app: 'D-CARPOOL',
        uploadedAt: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0
    });
    formData.append('pinataOptions', options);

    const response = await axios.post(url, formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'pinata_api_key': process.env.IPFS_API_KEY,
        'pinata_secret_api_key': process.env.IPFS_API_SECRET
      }
    });

    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp,
      url: `${process.env.IPFS_GATEWAY}${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('IPFS upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload to IPFS');
  }
};

// Get file from IPFS
exports.getFromIPFS = async (ipfsHash) => {
  try {
    const url = `${process.env.IPFS_GATEWAY}${ipfsHash}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve from IPFS');
  }
};

// Upload JSON metadata to IPFS
exports.uploadJSONToIPFS = async (jsonData) => {
  try {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    const data = {
      pinataContent: jsonData,
      pinataMetadata: {
        name: 'D-CARPOOL-Metadata',
        keyvalues: {
          app: 'D-CARPOOL',
          uploadedAt: new Date().toISOString()
        }
      }
    };

    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': process.env.IPFS_API_KEY,
        'pinata_secret_api_key': process.env.IPFS_API_SECRET
      }
    });

    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      url: `${process.env.IPFS_GATEWAY}${response.data.IpfsHash}`
    };
  } catch (error) {
    console.error('IPFS JSON upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload JSON to IPFS');
  }
};
