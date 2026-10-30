const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_123');

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(decoded.id)) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const { inMemoryUsers } = require('../controllers/authController');
        req.user = inMemoryUsers.find(u => u._id === decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User belonging to this token no longer exists' });
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
