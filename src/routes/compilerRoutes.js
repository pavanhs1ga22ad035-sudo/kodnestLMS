const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { executeCode } = require('../controllers/compilerController');

const router = express.Router();

router.post('/execute', authenticate, executeCode);

module.exports = router;
