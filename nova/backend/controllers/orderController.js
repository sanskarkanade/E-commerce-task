const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const createError = require('../utils/createError');
const { calculateTotals } = require('../utils/pricing');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]{10,15}$/;
const PINCODE_REGEX = /^\d{6}$/;

// Returns a list of problems with the customer details (empty list = valid)
const validateCustomer = (customer) => {
  if (!customer || typeof customer !== 'object') return ['Customer details are required'];
  const errors = [];
  const text = (value) => (typeof value === 'string' ? value.trim() : '');

  if (text(customer.name).length < 2) errors.push('Name is required');
  if (!EMAIL_REGEX.test(text(customer.email))) errors.push('A valid email is required');
  if (!PHONE_REGEX.test(text(customer.phone))) errors.push('A valid phone number is required');
  if (text(customer.address).length < 5) errors.push('Address is required');
  if (text(customer.city).length < 2) errors.push('City is required');
  if (!PINCODE_REGEX.test(text(customer.pincode))) errors.push('Pincode must be 6 digits');
  return errors;
};

// POST /api/orders  (public: customers do not need an account)
// The client only sends product IDs + quantities. Prices come from the database,
// so nobody can change the price by editing the request.
const createOrder = asyncHandler(async (req, res) => {
  const { customer, items } = req.body;

  const customerErrors = validateCustomer(customer);
  if (customerErrors.length > 0) throw createError(400, customerErrors.join('. '));

  if (!Array.isArray(items) || items.length === 0) throw createError(400, 'Your cart is empty');
  const quantityById = new Map();
  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!item.productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw createError(400, 'Each item needs a productId and a quantity between 1 and 20');
    }
    quantityById.set(String(item.productId), (quantityById.get(String(item.productId)) || 0) + quantity);
  }

  const products = await Product.find({ _id: { $in: [...quantityById.keys()] } });
  if (products.length !== quantityById.size) {
    throw createError(400, 'Some products in your cart are no longer available');
  }

  const orderItems = products.map((product) => {
    const quantity = quantityById.get(String(product._id));
    if (product.stock < quantity) {
      throw createError(409, `Only ${product.stock} of "${product.name}" left in stock`);
    }
    return { product: product._id, name: product.name, price: product.price, image: product.image, quantity };
  });

  // Reduce stock. The filter (stock >= quantity) protects against two people buying the last item.
  const stockUpdates = orderItems.map((item) => ({
    updateOne: { filter: { _id: item.product, stock: { $gte: item.quantity } }, update: { $inc: { stock: -item.quantity } } },
  }));
  const result = await Product.bulkWrite(stockUpdates);
  if (result.modifiedCount !== orderItems.length) {
    // Known limitation: a real system would use a transaction to undo partial updates.
    throw createError(409, 'Stock changed while placing your order. Please review your cart and try again.');
  }

  const totals = calculateTotals(orderItems);
  const order = await Order.create({
    customer: {
      name: customer.name, email: customer.email, phone: customer.phone,
      address: customer.address, city: customer.city, pincode: customer.pincode,
    },
    items: orderItems,
    ...totals,
  });

  res.status(201).json({ order });
});

// GET /api/orders  (admin)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ count: orders.length, orders });
});

// GET /api/orders/:id  (admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw createError(404, 'Order not found');
  res.json({ order });
});

module.exports = { createOrder, getOrders, getOrderById };
