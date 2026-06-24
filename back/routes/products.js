const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public catalog routes
router.get('/', getProducts);
router.get('/:id', getProductById);

const fs = require('fs');
const path = require('path');

// Admin-only catalog management routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Upload product image (saves Base64 payload as file on backend)
router.post('/upload', protect, adminOnly, async (req, res) => {
  const { base64Data } = req.body;
  if (!base64Data) {
    return res.status(400).json({ message: 'No image data provided' });
  }

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: 'Invalid image format payload' });
    }

    const type = matches[1];
    const extension = type.split('/')[1] === 'jpeg' ? 'jpg' : type.split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');
    
    const uniqueFileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
    const filePath = path.join(__dirname, '../public/uploads', uniqueFileName);

    // Ensure uploads directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
    res.json({ url: `/uploads/${uniqueFileName}` });
  } catch (err) {
    console.error('File write error:', err);
    res.status(500).json({ message: 'Server error saving image file', error: err.message });
  }
});

module.exports = router;
