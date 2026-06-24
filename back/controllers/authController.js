const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.User_ID, email: user.Email, role: user.Role },
    process.env.JWT_SECRET || 'gaba_premium_secret_key_2026_college_project',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }

  try {
    // Check if user already exists
    const userExists = await db.users.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Auto-promote admin@gaba.com to admin
    const role = email.toLowerCase() === 'admin@gaba.com' ? 'admin' : 'user';

    // Create user in DB
    const user = await db.users.create(name, email, hashedPassword, role);

    res.status(201).json({
      User_ID: user.User_ID,
      Name: user.Name,
      Email: user.Email,
      Role: user.Role,
      Token: generateToken(user)
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error registering user', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      User_ID: user.User_ID,
      Name: user.Name,
      Email: user.Email,
      Role: user.Role,
      Token: generateToken(user)
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error logging in', error: error.message });
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await db.users.findById(req.user.User_ID);
    if (user) {
      res.json({
        User_ID: user.User_ID,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role,
        Created_At: user.Created_At
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
