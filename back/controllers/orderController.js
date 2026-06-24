import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      // Update product stocks
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.qty);
          await product.save();
        }
      }

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Allow if admin or order belongs to logged-in user
      if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || 'MOCK_PAYMENT_SUCCESS_' + Date.now(),
        status: req.body.status || 'COMPLETED',
        email_address: req.body.email_address || req.user.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered/shipped
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.orderStatus === 'Processing') {
        order.orderStatus = 'Shipped';
      } else if (order.orderStatus === 'Shipped') {
        order.orderStatus = 'Delivered';
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/orders/metrics
// @access  Private/Admin
const getSalesMetrics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('name stock');

    res.json({
      totalOrders,
      productsCount,
      usersCount,
      totalRevenue,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getSalesMetrics,
};
