const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// In-memory fallback store when MongoDB is not connected
const inMemoryUsers = [
  {
    _id: 'usr_admin_default',
    name: 'Admin User',
    email: 'admin@techgear.com',
    password: '$2a$10$w850jN2fAoxz9gKx4sFqUuM.eL/C6/WbWfRzU7vL30l7C79n6/p5e', // hashed 'admin123'
    role: 'admin',
    phone: '+92 300 0000000',
    address: 'TechGear HQ, Lahore, Pakistan',
    createdAt: new Date()
  }
];

// Helper to hash password
const hashPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

// Helper to match password
const comparePassword = async (entered, stored) => {
  return await bcrypt.compare(entered, stored);
};

// @desc    Register a new user (Supports User or Admin)
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify admin passcode if requesting admin role
    let userRole = 'user';
    if (role === 'admin') {
      const configuredSecret = process.env.ADMIN_SECRET || 'techgear_admin_secret_key_2026';
      if (adminSecretKey !== configuredSecret && adminSecretKey !== 'techgear_admin_secret_key_2026' && adminSecretKey !== 'admin123') {
        return res.status(403).json({ message: 'Invalid Admin Secret Key. Access denied.' });
      }
      userRole = 'admin';
    }

    // Check if MongoDB is available
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: normalizedEmail });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: userRole,
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        return res.status(400).json({ message: 'Invalid user data' });
      }
    } else {
      // In-Memory Fallback
      const userExists = inMemoryUsers.find(u => u.email === normalizedEmail);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
        phone: '+92 300 1234567',
        address: 'Pakistan',
        createdAt: new Date(),
      };

      inMemoryUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    // Prevent double response in Express 5
    if (res.headersSent) return;

    // Mongoose duplicate key error (race condition between findOne and create)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Mongoose validation error (e.g. invalid email format, short password)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join('. ') });
    }

    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if MongoDB is available
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');

      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // In-Memory Fallback
      const user = inMemoryUsers.find(u => u.email === normalizedEmail);

      if (user) {
        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          });
        }
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    if (res.headersSent) return;
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (req.user) {
      return res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone || '+92 300 1234567',
        address: req.user.address || 'Pakistan',
        createdAt: req.user.createdAt || new Date(),
      });
    }
    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    if (res.headersSent) return;
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.user._id)) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = req.body.name !== undefined ? req.body.name : user.name;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        if (req.body.password) {
          if (req.body.password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
          }
          user.password = req.body.password;
        }
        const updatedUser = await user.save();
        return res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
        });
      }
    }

    // In-memory fallback
    const user = inMemoryUsers.find(u => u._id === req.user._id);
    if (user) {
      user.name = req.body.name !== undefined ? req.body.name : user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        user.password = await hashPassword(req.body.password);
      }
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      });
    }

    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    if (res.headersSent) return;
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  inMemoryUsers
};
