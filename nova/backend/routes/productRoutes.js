const express = require('express');
const controller = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public: anyone can browse products
router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);

// Admin only: authMiddleware checks the login, adminMiddleware checks the role
router.post('/', authMiddleware, adminMiddleware, controller.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, controller.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, controller.deleteProduct);

module.exports = router;
