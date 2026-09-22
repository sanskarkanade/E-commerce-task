const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const createError = require('../utils/createError');

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, createdAt: -1 },
};

// Escape user input so it is treated as plain text inside a RegExp
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Only copy the fields we allow. Prevents clients from setting things like _id or createdAt.
const pickProductFields = (body) => {
  const allowed = ['name', 'description', 'price', 'category', 'image', 'stock', 'rating', 'specifications'];
  return allowed.reduce((data, field) => {
    if (body[field] !== undefined) data[field] = body[field];
    return data;
  }, {});
};

// GET /api/products?search=&category=&sort=&limit=
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort, limit } = req.query;
  const filter = {};

  // typeof checks stop query-string tricks like ?category[$ne]=x (NoSQL injection)
  if (typeof search === 'string' && search.trim()) {
    const pattern = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }, { category: pattern }];
  }
  if (typeof category === 'string' && category && category !== 'All') {
    filter.category = category;
  }

  let query = Product.find(filter).sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest);
  const limitNumber = parseInt(limit, 10);
  if (limitNumber > 0) query = query.limit(Math.min(limitNumber, 100));

  const products = await query;
  res.json({ count: products.length, products });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id); // invalid id -> CastError -> 400
  if (!product) throw createError(404, 'Product not found');
  res.json({ product });
});

// POST /api/products  (admin)
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pickProductFields(req.body)); // schema validation runs here
  res.status(201).json({ product });
});

// PUT /api/products/:id  (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pickProductFields(req.body), {
    new: true, // return the updated document
    runValidators: true, // run schema validation on updates too
  });
  if (!product) throw createError(404, 'Product not found');
  res.json({ product });
});

// DELETE /api/products/:id  (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw createError(404, 'Product not found');
  res.json({ message: 'Product deleted' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
