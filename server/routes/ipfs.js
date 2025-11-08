const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { uploadToIPFS, uploadJSONToIPFS } = require('../utils/ipfsService');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

// POST /api/ipfs/upload - Upload file to IPFS
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = await uploadToIPFS(req.file.buffer, req.file.originalname);

    res.json({
      message: 'File uploaded to IPFS successfully',
      ...result
    });
  } catch (error) {
    console.error('IPFS upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload to IPFS' });
  }
});

// POST /api/ipfs/upload-json - Upload JSON to IPFS
router.post('/upload-json', authenticateToken, async (req, res) => {
  try {
    const jsonData = req.body;

    if (!jsonData || Object.keys(jsonData).length === 0) {
      return res.status(400).json({ error: 'No JSON data provided' });
    }

    const result = await uploadJSONToIPFS(jsonData);

    res.json({
      message: 'JSON uploaded to IPFS successfully',
      ...result
    });
  } catch (error) {
    console.error('IPFS JSON upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload JSON to IPFS' });
  }
});

module.exports = router;
