const jwt = require('jsonwebtoken');

// Protect routes - check if user is logged in
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gaba_premium_secret_key_2026_college_project');
      
      // Assign user payload to request
      req.user = {
        User_ID: decoded.id,
        Email: decoded.email,
        Role: decoded.role
      };
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin access only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.Role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

module.exports = { protect, adminOnly };
