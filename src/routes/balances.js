const express = require('express');
const router = express.Router();
const { depositAmount } = require('../controllers/balances');

// Route to deposit values to a profile
router.post('/deposit/:userId', depositAmount);

module.exports = router;