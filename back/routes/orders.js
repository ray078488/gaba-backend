const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ==========================================
// CART ROUTES (Protected, User specific)
// ==========================================
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:id', protect, updateCartItem);
router.delete('/cart/:id', protect, removeCartItem);

// ==========================================
// ORDER ROUTES (Protected)
// ==========================================
router.post('/', protect, checkout);
router.get('/history', protect, getUserOrders);

// Admin-only order overview & status update
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// ==========================================
// RETURN & EXCHANGE ROUTES
// ==========================================
// User requests return/exchange
router.post('/items/:id/request', protect, requestReturnOrExchange);

// Admin reviews request
router.put('/items/:id/review', protect, adminOnly, reviewReturnOrExchange);

module.exports = router;
