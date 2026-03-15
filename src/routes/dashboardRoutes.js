const express = require('express');
const { getHomeDashboard } = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/home', authenticate, getHomeDashboard);

module.exports = router;
