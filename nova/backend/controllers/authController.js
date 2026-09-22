const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const createError = require('../utils/createError');

const formatUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    throw createError(400, 'Email and password are required');
  }

  // password has select:false in the schema, so we ask for it explicitly here
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  const passwordMatches = user ? await user.comparePassword(password) : false;

  // Same message for both cases so attackers cannot tell which one was wrong
  if (!user || !passwordMatches) throw createError(401, 'Invalid email or password');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: formatUser(user) });
});

// GET /api/auth/me  (used by the frontend to restore the session after a refresh)
const getMe = (req, res) => {
  res.json({ user: formatUser(req.user) });
};

module.exports = { login, getMe };
