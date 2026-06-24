const db = require('../config/db');

// @desc    Get all products (with filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category, fabric, priceMin, priceMax, search, size } = req.query;

  try {
    const products = await db.products.getAll({
      category,
      fabric,
      priceMin,
      priceMax,
      search,
      size
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products', error: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await db.products.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error fetching product', error: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { Product_Name, Category, Fabric_Quality, Price, Size_Available, Stock_Quantity, Description, Image_URL } = req.body;

  if (!Product_Name || !Category || !Fabric_Quality || !Price || !Size_Available || Stock_Quantity === undefined) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Generate unique product ID if not provided
    const Product_ID = req.body.Product_ID || `GABA-${Category.substring(0,1).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newProduct = {
      Product_ID,
      Brand_Name: 'GABA',
      Product_Name,
      Category,
      Fabric_Quality,
      Price: parseFloat(Price),
      Size_Available: Array.isArray(Size_Available) ? Size_Available : Size_Available.split(','),
      Stock_Quantity: parseInt(Stock_Quantity),
      Description: Description || '',
      Image_URL: Image_URL || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
    };

    const saved = await db.products.create(newProduct);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { Product_Name, Category, Fabric_Quality, Price, Size_Available, Stock_Quantity, Description, Image_URL } = req.body;

  try {
    const existing = await db.products.getById(productId);
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = {
      Product_Name: Product_Name || existing.Product_Name,
      Category: Category || existing.Category,
      Fabric_Quality: Fabric_Quality || existing.Fabric_Quality,
      Price: Price !== undefined ? parseFloat(Price) : existing.Price,
      Size_Available: Size_Available || existing.Size_Available,
      Stock_Quantity: Stock_Quantity !== undefined ? parseInt(Stock_Quantity) : existing.Stock_Quantity,
      Description: Description || existing.Description,
      Image_URL: Image_URL || existing.Image_URL
    };

    const updated = await db.products.update(productId, updatedProduct);
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const success = await db.products.delete(productId);
    if (!success) {
      return res.status(404).json({ message: 'Product not found or already deleted' });
    }
    res.json({ message: 'Product deleted successfully', Product_ID: productId });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
