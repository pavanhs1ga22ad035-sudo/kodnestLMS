const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getAvailableJobs, applyToJob } = require('../controllers/placementController');

const router = express.Router();

router.get('/jobs', getAvailableJobs);
router.post('/jobs/:jobId/apply', authenticate, applyToJob);

module.exports = router;
