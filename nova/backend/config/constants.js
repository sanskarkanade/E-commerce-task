// Shared business rules. The server is the source of truth for prices and shipping.
module.exports = {
  CATEGORIES: ['Apparel', 'Footwear', 'Accessories', 'Bags', 'Lifestyle'],
  ORDER_STATUSES: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  FREE_SHIPPING_THRESHOLD: 1999, // orders at or above this get free shipping
  SHIPPING_FEE: 99,
  LOW_STOCK_LIMIT: 5, // stock at or below this counts as "low stock"
};
