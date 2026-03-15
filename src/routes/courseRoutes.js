const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getCoursePlayerData } = require('../controllers/courseController');

const router = express.Router();

router.get('/:courseId/player', authenticate, getCoursePlayerData);

module.exports = router;
