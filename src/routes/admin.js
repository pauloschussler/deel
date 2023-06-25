const express = require('express');
const router = express.Router();
const { bestProfession, bestClients } = require('../controllers/admin');

router.get('/best-profession', bestProfession);
router.get('/best-clients', bestClients);

module.exports = router;