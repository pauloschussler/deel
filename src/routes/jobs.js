const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile');
const { getUnpaidJobs, payJob } = require('../controllers/jobs');

// Route to get unpaid jobs for specific profiles
router.get('/unpaid/', getProfile, getUnpaidJobs);

// Route to pay for a specific job
router.post('/:job_id/pay/', payJob);

module.exports = router;