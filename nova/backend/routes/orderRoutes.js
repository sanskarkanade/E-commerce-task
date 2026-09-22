const express = require('express');
const controller = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', controller.createOrder); // public checkout
router.get('/', authMiddleware, adminMiddleware, controller.getOrders);
router.get('/:id', authMiddleware, adminMiddleware, controller.getOrderById);

module.exports = router;
