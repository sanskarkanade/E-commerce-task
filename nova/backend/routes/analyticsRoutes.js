const express = require('express');
const controller = require('../controllers/analyticsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, adminMiddleware); // every analytics route is admin-only

router.get('/overview', controller.getOverview);
router.get('/sales', controller.getSales);

module.exports = router;
