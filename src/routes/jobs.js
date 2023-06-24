const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile');
const { getUnpaidJobs, payJob } = require('../controllers/jobs');

// Apply the getProfile middleware to all routes in the router
router.use(getProfile);

// Route to get unpaid jobs for specific profiles
router.get('/unpaid/', getUnpaidJobs);

router.post('/:job_id/pay/', payJob);

module.exports = router;