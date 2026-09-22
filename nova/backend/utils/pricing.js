const { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } = require('../config/constants');

// items: [{ price, quantity }]
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
};

module.exports = { calculateTotals };
