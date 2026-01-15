// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { dashboardData } = require('../controllers/dashboardController');

router.get('/', dashboardData);

module.exports = router;
