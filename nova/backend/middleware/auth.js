const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const createError = require('../utils/createError');

// 1) authMiddleware: is the request made by a logged-in user?
// Expects the header:  Authorization: Bearer <token>
const authMiddleware = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) throw createError(401, 'Not authorized: no token provided');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createError(401, 'Not authorized: token is invalid or expired');
  }

  // Load the user from the database instead of trusting the role inside the token.
  const user = await User.findById(decoded.id);
  if (!user) throw createError(401, 'Not authorized: user no longer exists');

  req.user = user;
  next();
});

// 2) adminMiddleware: must run AFTER authMiddleware. Only lets admins through.
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(createError(403, 'Forbidden: admin access required'));
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
