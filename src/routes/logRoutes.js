const express = require('express');
const router = express.Router();

const { getLogs } = require('../controllers/logController');
const protect = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, adminOnly, getLogs);

module.exports = router;