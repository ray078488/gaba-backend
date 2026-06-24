const db = require('../config/db');

// ==========================================
// 1. CART CONTROLLERS
// ==========================================

// @desc    Get logged in user's cart
// @route   GET /api/orders/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const items = await db.cart.getByUser(req.user.User_ID);
    res.json(items);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error fetching cart', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/orders/cart
// @access  Private
const addToCart = async (req, res) => {
  const { Product_ID, Size, Quantity } = req.body;

  if (!Product_ID || !Size || !Quantity) {
    return res.status(400).json({ message: 'Please provide Product_ID, Size and Quantity' });
  }

  try {
    // Verify product exists and has stock
    const product = await db.products.getById(Product_ID);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.Stock_Quantity < Quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.Stock_Quantity} remaining.` });
    }

    const item = await db.cart.add(req.user.User_ID, Product_ID, Size, parseInt(Quantity));
    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error adding to cart', error: error.message });
  }
};

// @desc    Update quantity of item in cart
// @route   PUT /api/orders/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  const cartId = req.params.id;
  const { Quantity } = req.body;

  if (Quantity === undefined || Quantity <= 0) {
    return res.status(400).json({ message: 'Please provide a valid quantity' });
  }

  try {
    const success = await db.cart.updateQuantity(cartId, parseInt(Quantity));
    if (!success) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error updating cart', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/orders/cart/:id
// @access  Private
const removeCartItem = async (req, res) => {
  const cartId = req.params.id;

  try {
    const success = await db.cart.remove(cartId);
    if (!success) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error removing from cart', error: error.message });
  }
};

// ==========================================
// 2. ORDER CONTROLLERS
// ==========================================

// @desc    Checkout / Place an order
// @route   POST /api/orders
// @access  Private
const checkout = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0 || !totalAmount) {
    return res.status(400).json({ message: 'No items or total amount provided for checkout' });
  }

  try {
    // Validate stock levels before placing order
    for (const item of items) {
      const product = await db.products.getById(item.Product_ID);
      if (!product || product.Stock_Quantity < item.Quantity) {
        return res.status(400).json({
          message: `Stock validation failed for ${item.Product_Name || item.Product_ID}. Available stock: ${product ? product.Stock_Quantity : 0}`
        });
      }
    }

    const order = await db.orders.create(req.user.User_ID, items, parseFloat(totalAmount));
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Server error placing order', error: error.message });
  }
};

// @desc    Get order history for logged in user
// @route   GET /api/orders/history
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await db.orders.getByUser(req.user.User_ID);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Server error fetching order history', error: error.message });
  }
};

// @desc    Get all orders (Admin dashboard view)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await db.orders.getAll();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
};

// @desc    Update order shipping/delivery status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { Status } = req.body;

  if (!Status) {
    return res.status(400).json({ message: 'Please provide order Status' });
  }

  try {
    const success = await db.orders.updateStatus(orderId, Status);
    if (!success) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: `Order status updated to ${Status}` });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status', error: error.message });
  }
};

// ==========================================
// 3. RETURNS & EXCHANGES CONTROLLERS
// ==========================================

// @desc    Request a return or exchange for an order item
// @route   POST /api/orders/items/:id/request
// @access  Private
const requestReturnOrExchange = async (req, res) => {
  const orderItemId = req.params.id;
  const { type, reason } = req.body; // type: 'return' or 'exchange'

  if (!type || !reason) {
    return res.status(400).json({ message: 'Please provide request type (return/exchange) and reason' });
  }

  if (type !== 'return' && type !== 'exchange') {
    return res.status(400).json({ message: 'Request type must be "return" or "exchange"' });
  }

  try {
    const success = await db.orders.requestReturnExchange(orderItemId, type, reason);
    if (!success) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    res.json({ message: `${type === 'return' ? 'Return' : 'Exchange'} request submitted successfully` });
  } catch (error) {
    console.error('Error requesting return/exchange:', error);
    res.status(500).json({ message: 'Server error filing return/exchange request', error: error.message });
  }
};

// @desc    Admin approve or reject return/exchange requests
// @route   PUT /api/orders/items/:id/review
// @access  Private/Admin
const reviewReturnOrExchange = async (req, res) => {
  const orderItemId = req.params.id;
  const { approve } = req.body; // approve: true or false

  if (approve === undefined) {
    return res.status(400).json({ message: 'Please specify whether to approve (true/false)' });
  }

  try {
    const success = await db.orders.reviewReturnExchange(orderItemId, approve);
    if (!success) {
      return res.status(404).json({ message: 'Order item not found or request status invalid' });
    }
    res.json({ message: `Request has been ${approve ? 'Approved' : 'Rejected'} successfully` });
  } catch (error) {
    console.error('Error reviewing request:', error);
    res.status(500).json({ message: 'Server error processing request review', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  checkout,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  requestReturnOrExchange,
  reviewReturnOrExchange
};
