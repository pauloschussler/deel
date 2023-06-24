const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile');
const { getContractById, getContracts } = require('../controllers/contracts');

// Apply the getProfile middleware to all routes in the router
router.use(getProfile);

// Route to get contract by ID
router.get('/:id', getContractById);

// Route to get all contracts
router.get('/', getContracts);

module.exports = router;