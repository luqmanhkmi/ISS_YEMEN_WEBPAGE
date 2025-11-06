const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') return next();
    if (req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      if (user && user.role === 'admin') return next();
    }
    return res.status(403).json({ message: 'Admin access required' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyToken, adminOnly };
