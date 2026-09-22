const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const { LOW_STOCK_LIMIT } = require('../config/constants');

// Cancelled orders should not count as revenue
const COUNTED_ORDERS = { status: { $ne: 'Cancelled' } };

// GET /api/analytics/overview  (admin)
const getOverview = asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, revenueRows, lowStockCount, lowStockItems, categoryRows, recentOrders] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: COUNTED_ORDERS }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
      Product.countDocuments({ stock: { $lte: LOW_STOCK_LIMIT } }),
      Product.find({ stock: { $lte: LOW_STOCK_LIMIT } }).sort({ stock: 1 }).limit(5).select('name stock image'),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    totalProducts,
    totalOrders,
    totalRevenue: revenueRows[0] ? revenueRows[0].revenue : 0,
    lowStockCount,
    lowStockItems,
    categoryDistribution: categoryRows.map((row) => ({ category: row._id, count: row.count })),
    recentOrders,
  });
});

// GET /api/analytics/sales?days=30  (admin)
// Returns one row per day (including days with no orders) so charts have no gaps.
const getSales = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 90);

  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const rows = await Order.aggregate([
    { $match: { ...COUNTED_ORDERS, createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
  ]);
  const byDate = new Map(rows.map((row) => [row._id, row]));

  const sales = [];
  for (let i = 0; i < days; i += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    const key = day.toISOString().slice(0, 10);
    const row = byDate.get(key);
    sales.push({ date: key, revenue: row ? row.revenue : 0, orders: row ? row.orders : 0 });
  }

  res.json({ days, sales });
});

module.exports = { getOverview, getSales };
